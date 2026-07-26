import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import { simulateCPUMatches } from "../gameEngine/match/orchestrator";
import { createMarketSlice, MarketActions } from "./slices/createMarketSlice";
import { GameState } from "../types/state";
import { getUpcomingMatches } from "../gameEngine/match/state";
import { toast } from "./useToastStore";
import generateSeason from "../gameEngine/generators/season";
import { processMatchResults } from "../gameEngine/match/progression";
import useUIStore from "./useUIStore";
import { MatchEvent } from "../types/match";
import { Modality, PlayStyle } from "../types/team";
import { FormationType } from "../data/formations";
import { generateSquad, setStarters } from "../gameEngine/team";

export interface LoadStateProps {
  state: GameState;
}

export interface SetModalityProps {
  modality: Modality;
}

export interface UpdateTeamMoneyProps {
  teamId: string;
  amount: number;
}

export interface ChangeTacticsPayload {
  formation?: FormationType;
  style?: PlayStyle;
}

export interface ChangeTacticsProps {
  teamId: string;
  payload: ChangeTacticsPayload;
}

export interface FinishMatchProps {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
}

export interface GameActions {
  loadState: (props: LoadStateProps) => void;
  setModality: (props: SetModalityProps) => void;
  updateTeamMoney: (props: UpdateTeamMoneyProps) => void;
  resetGame: () => void;
  advanceDay: () => void;
  finishMatch: (props: FinishMatchProps) => void;
  changeTactics: (props: ChangeTacticsProps) => void;
  simulateNextMatch: () => void;
  startSeason: () => void;
}

export type GameStore = GameState & GameActions & MarketActions;

const initialGameState: GameState = {
  currentDate: "2026-01-01",
  modality: "masculine",
  season: 2026,
  status: "IDLE",
  userTeamId: null,
  teams: {},
  players: {},
  competitions: [],
  calendar: [],
  activeMatch: null,
  notifications: [],
  results: [],
};

const useGameStore = create<GameStore>()(
  persist(
    immer((...a) => {
      const [set, get] = a;
      return {
        ...initialGameState,
        ...createMarketSlice(...a),

        loadState: ({ state: savedState }) =>
          set(() => {
            // Como agora as entidades são objetos puros, não precisamos instanciar classes
            return {
              ...savedState,
              teams: savedState.teams,
              players: savedState.players,
            } as unknown as GameStore;
          }),
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

        advanceDay: () => {
          set((state) => {});
        },

        changeTactics: ({ teamId, payload }) => {
          set((state) => {
            const team = state.teams[teamId];
            if (!team) return;

            if (payload.formation) team.tactics.formation = payload.formation;
            if (payload.style) team.tactics.style = payload.style;
            state.teams[teamId] = setStarters({
              team,
              playersMap: state.players,
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

        simulateNextMatch: () => {
          const gameState = get();
          if (!gameState.userTeamId) return;

          const nextMatches = getUpcomingMatches({
            calendar: gameState.calendar,
            targetTeamId: gameState.userTeamId,
          });

          if (nextMatches.length === 0) {
            return;
          }

          const nextMatch = nextMatches[0];
          if (nextMatch.date !== gameState.currentDate) {
            return;
          }

          useUIStore.getState().openMatchModal(nextMatch);
        },
      };
    }),
    {
      name: "game-save",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useGameStore;
