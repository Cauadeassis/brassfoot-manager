import { Team } from "../../types/team";
import { getStats } from "../team";
interface GetStandingsProps {
  teams: Team[];
  division?: string;
  season?: number;
}
export function getStandings({
  teams,
  division = "A",
  season = 2026,
}: GetStandingsProps): Team[] {
  return [...teams]
    .filter((team) => team.division === division)
    .sort((a, b) => {
      const statsA = getStats({ team: a, season });
      const statsB = getStats({ team: b, season });
      if (statsB.points !== statsA.points) {
        return statsB.points - statsA.points;
      }

      const saldoA = statsA.goalsFor - statsA.goalsAgainst;
      const saldoB = statsB.goalsFor - statsB.goalsAgainst;

      if (saldoB !== saldoA) {
        return saldoB - saldoA;
      }

      return statsB.goalsFor - statsA.goalsFor;
    });
}
interface GetTeamPositionProps {
  teams: Team[];
  teamId: string;
}
export const getTeamPosition = ({
  teams,
  teamId,
}: GetTeamPositionProps): number => {
  const standings = getStandings({ teams });
  return standings.findIndex((team) => team.id === teamId) + 1;
};
