import useGameStore from "../stores/useGameStore";
import { updatePlayerValue } from "./playerFactory";
import { toast } from "../stores/useToastStore";
import type { GameState, Player } from "../types";

const progressionRules = [
  {
    condition: (player: Player) => player.age > 31,
    action: (player: Player) => {
      player.overall = Math.max(50, player.overall - 1);
    },
  },
  {
    condition: (_: Player, round: number) => round >= 38,
    action: (player: Player) => {
      player.age++;
    },
  },
  {
    condition: () => true,
    action: (player: Player) => {
      updatePlayerValue(player);
    },
  },
];

export function progressPlayers(): void {
  const { currentRound, teams } = useGameStore.getState();
  if (currentRound % 5 !== 0) return;
  useGameStore.setState((state: GameState) => {
    state.teams.forEach((team) => {
      team.squad.forEach((player) => {
        progressionRules
          .filter((rule) => rule.condition(player, state.currentRound))
          .forEach((rule) => rule.action(player));
      });
    });
  });
}

export function newSeason(): void {
  const { generateCalendar } = useGameStore.getState();
  useGameStore.setState((state: GameState) => {
    state.season++;
    state.currentRound = 1;
    state.teams.forEach((team) => {
      team.statistics = {
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        matchesPlayed: 0,
      };
      team.squad.forEach((player) => {
        player.statistics = {
          goals: 0,
          redCards: 0,
          assistance: 0,
          yellowCards: 0,
          matchesPlayed: 0,
        };
        updatePlayerValue(player);
      });
    });

    state.results = [];
    state.notifications = [];
  });
  generateCalendar();
  toast({ message: `Temporada iniciada!`, type: "ok" });
}
