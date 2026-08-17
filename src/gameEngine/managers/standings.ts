import NATIONALITIES_DATA from "../../data/nationalities";
import { CompetitionId } from "../../types/competition";
import { Team } from "../../types/team";
import { getTeamStats } from "../team";
interface GetStandingsProps {
  teams: Team[];
  competitionId: CompetitionId;
  division?: string;
  season: number;
}

export function getStandings({
  teams,
  competitionId,
  division,
  season,
}: GetStandingsProps): Team[] {
  const [prefix, _] = competitionId.split("_");
  const teamsWithStats = teams
    .filter((team) => {
      const { nationality, type } = team;
      const matchesDivision = division ? team.division === division : true;
      const isNationalLeague = nationality === prefix && type === "club";
      const isSameRegion = NATIONALITIES_DATA[nationality]?.region === prefix;
      const expectedTeamType = competitionId.includes("clubs")
        ? "club"
        : "national";
      const isRegionalCompetition = isSameRegion && type === expectedTeamType;
      const matchesLocation = isNationalLeague || isRegionalCompetition;
      return matchesDivision && matchesLocation;
    })
    .map((team) => ({
      team,
      stats: getTeamStats({ team, season, competitionId }),
    }));
  teamsWithStats.sort((itemA, itemB) => {
    const statsA = itemA.stats;
    const statsB = itemB.stats;
    if (statsB.points !== statsA.points) {
      return statsB.points - statsA.points;
    }
    const saldoA = statsA.goalsFor - statsA.goalsAgainst;
    const saldoB = statsB.goalsFor - statsB.goalsAgainst;
    if (saldoB !== saldoA) {
      return saldoB - saldoA;
    }
    if (statsB.goalsFor !== statsA.goalsFor) {
      return statsB.goalsFor - statsA.goalsFor;
    }
    return (statsB.wins ?? 0) - (statsA.wins ?? 0);
  });
  return teamsWithStats.map((item) => item.team);
}
interface GetTeamPositionProps {
  teams: Team[];
  teamId: string;
  competitionId: CompetitionId;
  season: number;
  division?: string;
}

export const getTeamPosition = ({
  teams,
  teamId,
  competitionId,
  season,
  division,
}: GetTeamPositionProps): number => {
  const standings = getStandings({ teams, competitionId, season, division });
  const index = standings.findIndex((team) => team.id === teamId);
  return index !== -1 ? index + 1 : 0;
};
