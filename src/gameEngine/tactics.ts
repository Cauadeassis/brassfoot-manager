import { Player, Position, Team } from "../types";
import { getCompatiblePositions, getTeam } from "../utils";
import { SQUAD_POSITIONS } from "../data/positions";
import { generatePlayer } from "./playerFactory";

export interface OrganizeSquadProps {
  squad: Player[];
  positions: Position[];
}

export function organizeSquad({
  squad,
  positions,
}: OrganizeSquadProps): string[] {
  const selectedPlayers = new Set<string>();

  return positions
    .map((position) => {
      const compatible = getCompatiblePositions(position);

      const playersThatCanBeSelected = squad
        .filter(
          (player) =>
            compatible.includes(player.position) &&
            !selectedPlayers.has(player.id),
        )
        .sort((playerA, playerB) => playerB.overall - playerA.overall);

      if (playersThatCanBeSelected.length) {
        selectedPlayers.add(playersThatCanBeSelected[0].id);
        return playersThatCanBeSelected[0].id;
      }

      const fallback = squad.find((player) => !selectedPlayers.has(player.id));
      if (fallback) {
        selectedPlayers.add(fallback.id);
        return fallback.id;
      }

      return null;
    })
    .filter((id): id is string => id !== null);
}

export const generateSquad = (team: Team): Player[] =>
  SQUAD_POSITIONS.map((position) =>
    generatePlayer({
      position,
      team,
    }),
  );

export function updateTeamOverall(teamId: number): void {
  const team = getTeam(teamId);
  if (!team) return;
  const allTeamPlayers = team.squad || [];
  const starterIds = team.startersId || [];
  const starters = allTeamPlayers.filter((player) =>
    starterIds.includes(player.id),
  );
  const totalOverall = starters.reduce(
    (sum, player) => sum + player.overall,
    0,
  );
  const newOverall = Math.round(totalOverall / 11);
  team.overall = newOverall;
}
