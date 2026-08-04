import {
  PlayerRole,
  PlayerStatistic,
  PlayerStatistics,
} from "../../types/player";
import { CalendarDay, GameState } from "../../types/state";
import { HistoryKey, TeamStatistic, TeamStatistics } from "../../types/team";
import { MatchEvent, EventType, Result, MatchTeams } from "../../types/match";
import { EVENT_CONFIG } from "./events/manager";
import { Player } from "../../types/player";
import { Team } from "../../types/team";
import { CompetitionId } from "../../types/competition";

export interface MatchResultPayload {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
}

interface GetTeamStatDeltasProps {
  goalsFor: number;
  goalsAgainst: number;
}

interface GetPlayerStatDeltasProps {
  eventType: EventType;
  role: PlayerRole;
}

interface UpdateTeamsStatisticsProps {
  gameState: GameState;
  competitionId: CompetitionId;
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
}

interface UpdatePlayerAppearances {
  homeTeam: Team;
  awayTeam: Team;
  players: Record<string, Player>;
  historyKey: HistoryKey;
  season: number;
  competitionId: CompetitionId;
}

interface ApplyPlayerDeltasProps {
  playerId: string;
  role: PlayerRole;
  eventType: EventType;
  players: Record<string, Player>;
  historyKey: HistoryKey;
  season: number;
  competitionId: CompetitionId;
  homeTeam: Team;
  awayTeam: Team;
}

interface ProcessMatchEventsProps {
  events: MatchEvent[];
  players: Record<string, Player>;
  historyKey: HistoryKey;
  season: number;
  competitionId: CompetitionId;
  homeTeam: Team;
  awayTeam: Team;
}

interface ProcessMatchResultsProps {
  gameState: GameState;
  payload: MatchResultPayload;
}

const MATCH_RESULT_MAPPING = {
  win: { wins: 1, points: 3 },
  draw: { draws: 1, points: 1 },
  defeat: { losses: 1 },
} as Record<Result, Partial<TeamStatistics>>;

export interface MatchResultProps {
  scoredGoals: number;
  concededGoals: number;
}

export const getMatchResult = ({
  scoredGoals,
  concededGoals,
}: MatchResultProps): Result => {
  if (scoredGoals === concededGoals) return "draw";
  return scoredGoals > concededGoals ? "win" : "defeat";
};

export const getTeamStatDeltas = ({
  goalsFor,
  goalsAgainst,
}: GetTeamStatDeltasProps): Partial<TeamStatistics> => {
  const status = getMatchResult({
    scoredGoals: goalsFor,
    concededGoals: goalsAgainst,
  });
  return {
    matchesPlayed: 1,
    goalsFor,
    goalsAgainst,
    ...MATCH_RESULT_MAPPING[status],
  };
};

const initTeamHistory = (team: Team, historyKey: HistoryKey): void => {
  if (!team.history[historyKey as HistoryKey]) {
    team.history[historyKey as HistoryKey] = {
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      matchesPlayed: 0,
    };
  }
};

interface InitialPlayerHistoryProps {
  player: Player;
  historyKey: HistoryKey;
  season: number;
  competitionId: CompetitionId;
  teamId: string;
}

const initPlayerHistory = ({
  player,
  historyKey,
  season,
  competitionId,
  teamId,
}: InitialPlayerHistoryProps): void => {
  if (!player.history[historyKey]) {
    player.history[historyKey] =
      player.position === "GK"
        ? {
            role: "goalkeeper",
            season,
            competitionId,
            teamId,
            matchesPlayed: 0,
            defenses: 0,
            yellowCards: 0,
            redCards: 0,
          }
        : {
            role: "attacker",
            season,
            competitionId,
            teamId,
            matchesPlayed: 0,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
          };
  }
};

const updateTeamsStatistics = ({
  gameState,
  competitionId,
  homeTeam,
  awayTeam,
  homeGoals,
  awayGoals,
}: UpdateTeamsStatisticsProps): void => {
  const homeDeltas = getTeamStatDeltas({
    goalsFor: homeGoals,
    goalsAgainst: awayGoals,
  });
  const awayDeltas = getTeamStatDeltas({
    goalsFor: awayGoals,
    goalsAgainst: homeGoals,
  });
  const historyKey = `${gameState.season}_${competitionId}` as HistoryKey;
  const competitionState = gameState.competitions.find(
    (c) => c.id === competitionId,
  );

  if (competitionState) {
    const homeStanding = competitionState.standings.find(
      (s) => s.teamId === homeTeam.id,
    );
    const awayStanding = competitionState.standings.find(
      (s) => s.teamId === awayTeam.id,
    );

    if (homeStanding && awayStanding) {
      (Object.entries(homeDeltas) as [keyof TeamStatistics, number][]).forEach(
        ([key, value]) => {
          homeStanding[key] += value;
        },
      );
      (Object.entries(awayDeltas) as [keyof TeamStatistics, number][]).forEach(
        ([key, value]) => {
          awayStanding[key] += value;
        },
      );
    }
  }
  initTeamHistory(homeTeam, historyKey);
  initTeamHistory(awayTeam, historyKey);

  (Object.entries(homeDeltas) as [keyof TeamStatistics, number][]).forEach(
    ([key, value]) => {
      homeTeam.history[historyKey][key] += value;
    },
  );
  (Object.entries(awayDeltas) as [keyof TeamStatistics, number][]).forEach(
    ([key, value]) => {
      awayTeam.history[historyKey][key] += value;
    },
  );
};

export const getPlayerStatDeltas = ({
  eventType,
  role,
}: GetPlayerStatDeltasProps): Partial<PlayerStatistics> => {
  const deltas: Partial<Record<string, number>> = {};
  const statisticKey = EVENT_CONFIG[eventType]?.stats?.[role];
  if (statisticKey) deltas[statisticKey] = 1;
  return deltas;
};

const updatePlayersAppearances = ({
  homeTeam,
  awayTeam,
  players,
  historyKey,
  season,
  competitionId,
}: UpdatePlayerAppearances): void => {
  [homeTeam, awayTeam].forEach((team: Team) => {
    team.squad.starterIds.forEach((playerId) => {
      const player = players[playerId];
      if (player) {
        initPlayerHistory({
          player,
          historyKey,
          season,
          competitionId,
          teamId: team.id,
        });
        player.history[historyKey].matchesPlayed += 1;
      }
    });
  });
};

const applyPlayerDeltas = ({
  playerId,
  role,
  eventType,
  players,
  historyKey,
  season,
  competitionId,
  homeTeam,
  awayTeam,
}: ApplyPlayerDeltasProps): void => {
  const targetPlayer = players[playerId];
  if (!targetPlayer) throw new Error(`Invalid player Id: ${playerId}`);
  if (!targetPlayer.history[historyKey]) {
    const playerTeamId =
      (targetPlayer as any).teamId ||
      (JSON.stringify(homeTeam).includes(playerId) ? homeTeam.id : awayTeam.id);
    initPlayerHistory({
      player: targetPlayer,
      historyKey,
      season,
      competitionId,
      teamId: playerTeamId,
    });

    const stats = targetPlayer.history[historyKey] as PlayerStatistics;
    if (stats) {
      stats.matchesPlayed += 1;
    }
  }

  const playerDeltas = getPlayerStatDeltas({ eventType, role });
  const stats = targetPlayer.history[historyKey];

  if (!stats) throw new Error(`Invalid historyKey for player: ${historyKey}`);

  Object.entries(playerDeltas).forEach(([key, value]) => {
    if (value) {
      (stats as any)[key] += value;
    }
  });
};

const processMatchEvents = ({
  events,
  players,
  historyKey,
  season,
  competitionId,
  homeTeam,
  awayTeam,
}: ProcessMatchEventsProps): void => {
  const roles = ["shooter", "assistant", "goalkeeper"] as PlayerRole[];
  events.forEach((matchEvent) => {
    roles.forEach((role) => {
      const playerEventData = matchEvent[role];
      if (playerEventData) {
        try {
          applyPlayerDeltas({
            playerId: playerEventData.id,
            role,
            eventType: matchEvent.type,
            players,
            historyKey,
            season,
            competitionId,
            homeTeam,
            awayTeam,
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  });
};

const updateDayStatus = ({
  gameState,
  calendarDay,
}: {
  gameState: GameState;
  calendarDay: CalendarDay;
}): void => {
  const areAllMatchesSimulated = calendarDay.matches.every(
    (match) => match.simulated,
  );
  if (areAllMatchesSimulated) gameState.status = "IDLE";
};

export const processMatchResults = ({
  gameState,
  payload,
}: ProcessMatchResultsProps): void => {
  const { matchId, homeGoals, awayGoals, events } = payload;
  const calendarDay = gameState.calendar.find((day) =>
    day.matches.some((match) => match.id === matchId),
  );
  if (!calendarDay)
    throw new Error(
      `Couldn't find the day in the calendar for the match ${matchId}...`,
    );
  const currentMatch = calendarDay.matches.find(
    (match) => match.id === matchId,
  );
  if (!currentMatch) throw new Error(`Couldn't find the match: ${matchId}.`);
  if (currentMatch.simulated)
    throw new Error(`Match has already been simulated: ${matchId}.`);
  currentMatch.simulated = true;
  currentMatch.goals.home = homeGoals;
  currentMatch.goals.away = awayGoals;
  gameState.results.push({ ...currentMatch });

  const homeTeam = gameState.teams[currentMatch.homeTeamId];
  const awayTeam = gameState.teams[currentMatch.awayTeamId];

  if (homeTeam && awayTeam) {
    const historyKey =
      `${gameState.season}_${currentMatch.competitionId}` as HistoryKey;
    updateTeamsStatistics({
      gameState,
      competitionId: currentMatch.competitionId,
      homeTeam,
      awayTeam,
      homeGoals,
      awayGoals,
    });
    updatePlayersAppearances({
      homeTeam,
      awayTeam,
      players: gameState.players,
      historyKey,
      season: gameState.season,
      competitionId: currentMatch.competitionId,
    });
    processMatchEvents({
      events,
      players: gameState.players,
      historyKey,
      season: gameState.season,
      competitionId: currentMatch.competitionId,
      homeTeam,
      awayTeam,
    });
  }

  updateDayStatus({ gameState, calendarDay });
};
