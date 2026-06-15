import type { Team } from "../types";

interface GetStandingsProps {
  teams: Team[];
  division?: string;
}
export function getStandings({
  teams,
  division = "A",
}: GetStandingsProps): Team[] {
  return [...teams]
    .filter((team) => team.division === division)
    .sort((teamA, teamB) => {
      if (teamB.statistics.points !== teamA.statistics.points)
        teamB.statistics.points - teamA.statistics.points;
      const goalDifferenceA =
        teamA.statistics.goalsFor - teamA.statistics.goalsAgainst;
      const goalDifferenceB =
        teamB.statistics.goalsFor - teamB.statistics.goalsAgainst;
      if (goalDifferenceB !== goalDifferenceA)
        return goalDifferenceB - goalDifferenceA;
      return teamB.statistics.goalsFor - teamA.statistics.goalsFor;
    });
}
interface GetTeamPositionProps {
  teams: Team[];
  teamId: number;
}
export const getTeamPosition = ({
  teams,
  teamId,
}: GetTeamPositionProps): number => {
  const standings = getStandings({ teams });
  return standings.findIndex((team) => team.id === teamId) + 1;
};
