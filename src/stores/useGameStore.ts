import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import { simulateCPUMatches } from "../gameEngine/match/orchestrator";
import { createMarketSlice } from "./slices/createMarketSlice";
import { createCalendarSlice } from "./slices/createCalendarSlice";
import { GameState } from "../types/state";
import { getUpcomingMatches } from "../gameEngine/match/state";
import { toast } from "./useToastStore";
import generateSeason from "../gameEngine/generators/season";
import { processMatchResults } from "../gameEngine/match/progression";
import { MatchEvent } from "../types/match";
import { Team } from "../types/team";
import { setStarters } from "../gameEngine/team";
import { MatchSimulationError } from "../errors";
import type {
  GameStore,
  SetModalityProps,
  UpdateTeamMoneyProps,
  ChangeTacticsProps,
  FinishMatchProps,
  LoadStateProps,
} from "./types";

const initialGameState: GameState = {
  currentDate: "2026-01-01",
  modality: "masculine",
  season: 2026,
  status: "IDLE",
  userTeamId: null,
  teams: {},
  players: {},
  payrollSalaryDays: {},
  competitions: [],
  calendar: [],
  notifications: [],
  results: [],
};

function normalizeGameState(savedState: unknown): GameState {
  const legacyState =
    typeof savedState === "object" && savedState !== null
      ? (savedState as Partial<GameState> & { activeMatch?: unknown })
      : {};
  const { activeMatch: _activeMatch, ...gameState } = legacyState;
  const players = Object.fromEntries(
    Object.entries(gameState.players ?? {}).map(([playerId, player]) => [
      playerId,
      {
        ...player,
        market: {
          isTransferListed: player.market?.isTransferListed ?? false,
        },
        contract: player.contract ?? null,
      },
    ]),
  );
  return {
    ...initialGameState,
    ...gameState,
    players,
    payrollSalaryDays: gameState.payrollSalaryDays ?? {},
  };
}

const useGameStore = create<GameStore>()(
  persist(
    immer((...a) => {
      const [set, get] = a;
      return {
        ...initialGameState,
        ...createMarketSlice(...a),
        ...createCalendarSlice(...a),

        loadState: ({ state: savedState }) =>
          set(() => normalizeGameState(savedState)),
        setModality: ({ modality }) =>
          set((state) => {
            state.modality = modality;
          }),

        updateTeamMoney: ({ teamId, amount }) =>
          set((state) => {
            const team = state.teams[teamId];
            if (team) team.money += amount;
          }),

        resetGame: () => set(() => ({ ...initialGameState })),

        changeTactics: ({ teamId, payload }) => {
          set((state) => {
            const team = state.teams[teamId];
            if (!team) return;
            Object.assign(team.tactics, payload);
            state.teams[teamId] = setStarters({
              team,
              playersMap: state.players,
              modality: state.modality,
            });
          });
        },
        finishMatch: (payload) => {
          const currentState = get();
          const currentDay = currentState.calendar.find(
            (c) => c.date === currentState.currentDate,
          );
          const cpuMatches = currentDay
            ? currentDay.matches.filter(
                (match) =>
                  !match.simulated &&
                  match.id !== payload.matchId &&
                  match.homeTeamId !== currentState.userTeamId &&
                  match.awayTeamId !== currentState.userTeamId,
              )
            : [];
          const cpuResults = simulateCPUMatches({
            pendingMatches: cpuMatches,
            teams: currentState.teams,
            players: currentState.players,
          });
          set((state) => {
            const gameState = state as unknown as GameState;
            processMatchResults({ gameState, payload });
            cpuResults.forEach((result) => {
              processMatchResults({
                gameState,
                payload: {
                  matchId: result.matchId,
                  homeGoals: result.homeGoals,
                  awayGoals: result.awayGoals,
                  events: result.events,
                },
              });
            });
            state.status = "IDLE";
          });
        },

        startSeason: () => {
          set((state) => {
            state.season++;
            const { calendar, competitions } = generateSeason({
              teams: Object.values(state.teams),
              season: state.season,
            });

            state.calendar = calendar;
            state.competitions = competitions;
            state.currentDate = `${state.season}-01-01`;
            state.status = "IDLE";
            state.results = [];
            state.notifications = [];
          });

          toast({ message: `Temporada iniciada!`, type: "ok" });
        },

        getNextMatch: () => {
          const gameState = get();

          if (!gameState.userTeamId) {
            throw MatchSimulationError.missingUserTeam();
          }

          const nextMatches = getUpcomingMatches({
            calendar: gameState.calendar,
            targetTeamId: gameState.userTeamId,
          });

          if (nextMatches.length === 0) {
            throw MatchSimulationError.noMatchesAvailable();
          }

          const nextMatch = nextMatches[0];

          if (nextMatch.date !== gameState.currentDate) {
            throw MatchSimulationError.dateMismatch(
              nextMatch.date,
              gameState.currentDate,
            );
          }

          return nextMatch;
        },
      };
    }),
    {
      name: "game-save",
      version: 3,
      migrate: (persistedState) =>
        normalizeGameState(persistedState) as GameStore,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useGameStore;
