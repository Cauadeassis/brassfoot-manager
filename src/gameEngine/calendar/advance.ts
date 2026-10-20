import { MatchSimulationError } from "../../errors";
import { advanceDay, advanceMonth, advanceYear } from "../player";
import { generateOffer, makeTransfer } from "../market";
import { simulateCPUMatches } from "../match/orchestrator";
import { processMatchResults } from "../match/progression";
import { getUpcomingMatches } from "../match/state";
import { GameState, SimulationInterrupt } from "../../types/state";
import { accrueDailyPayroll, settleMonthlyPayroll } from "../payroll";

function addOneDay(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day + 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function advanceCurrentDay(state: GameState): void {
  const currentDay = state.calendar.find(
    (day) => day.date === state.currentDate,
  );
  const cpuMatches = currentDay
    ? currentDay.matches.filter(
        (match) =>
          !match.simulated &&
          match.homeTeamId !== state.userTeamId &&
          match.awayTeamId !== state.userTeamId,
      )
    : [];
  const cpuResults = simulateCPUMatches({
    pendingMatches: cpuMatches,
    teams: state.teams,
    players: state.players,
  });
  cpuResults.forEach((result) => {
    processMatchResults({
      gameState: state,
      payload: {
        matchId: result.matchId,
        homeGoals: result.homeGoals,
        awayGoals: result.awayGoals,
        events: result.events,
      },
    });
  });

  accrueDailyPayroll(state, state.currentDate);
  const nextDateStr = addOneDay(state.currentDate);
  state.currentDate = nextDateStr;
  state.notifications = (state.notifications ?? []).filter(
    (offer) =>
      Boolean(offer.expiresAt && offer.contractOffer) &&
      offer.expiresAt >= nextDateStr,
  );
  const [, newMonth, newDay] = nextDateStr.split("-");
  const isNewMonth = newDay === "01";
  const isNewYear = newMonth === "01" && newDay === "01";
  if (isNewMonth) settleMonthlyPayroll(state);
  Object.values(state.players).forEach((player) => {
    if (
      player.contract &&
      state.currentDate > player.contract.endDate &&
      player.currentTeamId
    ) {
      makeTransfer({
        draft: state,
        transferOffer: {
          buyerTeamId: null,
          sellerTeamId: player.currentTeamId,
          playerId: player.id,
          value: 0,
        },
      });
    }
    let updatedPlayer = advanceDay({ player });
    if (isNewYear) updatedPlayer = advanceYear({ player: updatedPlayer });
    if (isNewMonth) updatedPlayer = advanceMonth({ player: updatedPlayer });
    state.players[player.id] = updatedPlayer;
  });
}

export function advanceUntilEventOrMatch(
  state: GameState,
): SimulationInterrupt {
  if (!state.userTeamId) throw MatchSimulationError.missingUserTeam();

  const nextMatch = getUpcomingMatches({
    calendar: state.calendar,
    targetTeamId: state.userTeamId,
  })
    .slice()
    .sort((first, second) => first.date.localeCompare(second.date))[0];

  if (!nextMatch) throw MatchSimulationError.noMatchesAvailable();

  if (state.currentDate >= nextMatch.date) {
    return {
      stoppedAtDate: state.currentDate,
      reason: "MATCH_DAY",
    };
  }

  while (state.currentDate < nextMatch.date) {
    advanceCurrentDay(state);
    const newOffer = generateOffer({
      teams: Object.values(state.teams),
      players: state.players,
      userTeamId: state.userTeamId,
      currentCount: state.notifications.length,
      pendingPlayerIds: state.notifications
        .filter((offer) => offer.sellerTeamId === state.userTeamId)
        .map((offer) => offer.playerId),
      currentDate: state.currentDate,
    });
    if (newOffer) {
      state.notifications.push(newOffer);
      return {
        stoppedAtDate: state.currentDate,
        reason: "TRANSFER_OFFER",
        eventPayload: newOffer,
      };
    }
  }

  return {
    stoppedAtDate: state.currentDate,
    reason: "MATCH_DAY",
  };
}
