import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createMarketSlice } from "./slices/useMarketStore";
import type { GameState, Round, Transaction, Match } from "../types";
import { getNextMatches } from "../gameEngine/matchSimulator";
import { shuffleArray } from "../utils";
import { toast } from "./useToastStore";
export interface MarketActions {
  acceptOffer: (index: number) => void;
  rejectOffer: (index: number) => void;
  sellPlayer: (playerId: string) => void;
  makeTransaction: (transaction: Transaction) => void;
  generateOffers: () => void;
  aiManageMarket: () => void;
}

interface UpdateTeamMoneyProps {
  teamId: number;
  amount: number;
}

export interface GameActions {
  setInitialState: (state: GameState) => void;
  advanceRound: () => void;
  updateTeamMoney: ({ teamId, amount }: UpdateTeamMoneyProps) => void;
  resetGame: () => void;
  openMatchModal: (match: Match) => void;
  closeMatchModal: () => void;
  finishMatch: ({ matchId, homeGoals, awayGoals }: FinishMatchProps) => void;
  generateCalendar: () => void;
  simulateNextMatch: () => void;
}

export type GameStore = GameState & GameActions & MarketActions;

interface FinishMatchProps {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
}

const initialGameState: GameState = {
  competitionId: null,
  userTeamId: null,
  season: 2026,
  activeMatch: null,
  currentRound: 1,
  teams: [],
  calendar: [],
  freeAgents: [],
  notifications: [],
  results: [],
};

const useGameStore = create<GameStore>()(
  immer((...a) => {
    const [set, get] = a;
    return {
      ...initialGameState,
      ...createMarketSlice(...a),
      setInitialState: (savedState) =>
        set((gameState: GameState) => {
          Object.assign(gameState, savedState);
        }),
      advanceRound: () =>
        set((gameState: GameState) => {
          gameState.currentRound += 1;
        }),
      updateTeamMoney: ({ teamId, amount }) =>
        set((gameState: GameState) => {
          const team = gameState.teams.find((team) => team.id === teamId);
          if (team) team.money += amount;
        }),
      resetGame: () =>
        set((gameState: GameState) => {
          Object.assign(gameState, initialGameState);
        }),
      generateCalendar: () =>
        set((gameState: GameState) => {
          const divisions = [
            ...new Set(gameState.teams.map((t) => t.division)),
          ];
          const allRounds: Round[] = [];

          divisions.forEach((div) => {
            const baseTeamIds = gameState.teams
              .filter((team) => team.division === div)
              .map((team) => team.id);

            const teamIds = shuffleArray(baseTeamIds);
            const teamCount = teamIds.length;
            if (teamCount === 0) return;

            let rotation = [...teamIds];
            const totalDivRounds = (teamCount - 1) * 2;
            const divRounds: Match[][] = Array.from(
              { length: totalDivRounds },
              () => [],
            );
            for (let round = 0; round < teamCount - 1; round++) {
              for (let index = 0; index < teamCount / 2; index++) {
                divRounds[round].push({
                  id: `${round + 1}-${rotation[index]}-${rotation[teamCount - 1 - index]}`, // ID único gerado
                  homeTeamId: rotation[index],
                  awayTeamId: rotation[teamCount - 1 - index],
                  roundNumber: round + 1,
                  simulated: false,
                  homeGoals: 0,
                  awayGoals: 0,
                  accelerated: false,
                });
              }
              rotation = [
                rotation[0],
                rotation[teamCount - 1],
                ...rotation.slice(1, teamCount - 1),
              ];
            }
            for (let round = 0; round < teamCount - 1; round++) {
              const returnoRoundIndex = round + teamCount - 1;
              divRounds[returnoRoundIndex] = divRounds[round].map((game) => ({
                id: `${returnoRoundIndex + 1}-${game.awayTeamId}-${game.homeTeamId}`,
                homeTeamId: game.awayTeamId,
                awayTeamId: game.homeTeamId,
                roundNumber: returnoRoundIndex + 1,
                simulated: false,
                homeGoals: 0,
                awayGoals: 0,
                accelerated: false,
              }));
            }
            divRounds.forEach((matches, rIndex) => {
              if (!allRounds[rIndex]) {
                allRounds[rIndex] = { roundNumber: rIndex + 1, matches: [] };
              }
              allRounds[rIndex].matches.push(...matches);
            });
          });
          gameState.calendar = allRounds;
        }),

      openMatchModal: (match) =>
        set((draft) => {
          draft.activeMatch = match;
        }),

      closeMatchModal: () =>
        set((draft) => {
          draft.activeMatch = null;
        }),

      finishMatch: ({ matchId, homeGoals, awayGoals }) =>
        set((gameState: GameState) => {
          const match = gameState.calendar
            .flatMap((round) => round.matches)
            .find((match) => match.id === matchId);
          if (!match) return;
          match.simulated = true;
          match.homeGoals = homeGoals;
          match.awayGoals = awayGoals;
          gameState.results.push({ ...match });
          const matchRound = gameState.calendar.find((round) =>
            round.matches.some((m) => m.id === matchId),
          );
          if (matchRound) {
            matchRound.matches.forEach((roundMatch) => {
              if (!roundMatch.simulated) {
              }
            });
            gameState.currentRound = matchRound.roundNumber + 1;
          }
        }),
      simulateNextMatch: () => {
        const nextMatches = getNextMatches({ state: get(), number: 1 });
        if (nextMatches.length === 0) {
          toast({
            message: "Não há mais jogos nesta temporada!",
            type: "info",
          });
          return;
        }
        const nextMatch = nextMatches[0];
        set({ activeMatch: nextMatch });
      },
    };
  }),
);
export default useGameStore;
