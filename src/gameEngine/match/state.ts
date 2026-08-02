import { calculatePossession } from "./simulator";
import { MatchState, MatchTeams, Match } from "../../types/match";
import { getTeamsModifiers } from "./orchestrator";
import { CalendarDay } from "../../types/state";
import { getPlayer } from "../../utils";

interface CreateMatchStateProps extends MatchTeams { }

export function createMatchState({
  homeTeam,
  awayTeam,
}: CreateMatchStateProps): MatchState {
  const { homeModifiers, awayModifiers } = getTeamsModifiers({
    homeTeam,
    awayTeam,
  });
  const possession = calculatePossession({
    homeTeamOverall: homeTeam.overall,
    awayTeamOverall: awayTeam.overall,
    homePossessionModifier: homeModifiers.possessionModifier,
    awayPossessionModifier: awayModifiers.possessionModifier,
  });
  return {
    statistics: {
      currentMinute: 0,
      goals: {
        home: 0,
        away: 0,
      },
      shots: {
        home: 0,
        away: 0,
      },
      possession,
    },
    events: [],
  };
}

interface GetMatchesProps {
  calendar: CalendarDay[];
  targetTeamId: string;
  desiredQuantity?: number;
}

interface FilterMatchesByTeamProps {
  calendar: CalendarDay[];
  teamId: string;
}

const filterMatchesByTeam = ({
  calendar,
  teamId,
}: FilterMatchesByTeamProps) => {
  return calendar
    .flatMap((round) => round.matches)
    .filter(
      (match) => match.homeTeamId === teamId || match.awayTeamId === teamId,
    );
};

export const getUpcomingMatches = ({
  calendar,
  targetTeamId,
  desiredQuantity = 1,
}: GetMatchesProps): Match[] => {
  const allTeamMatches = filterMatchesByTeam({
    calendar,
    teamId: targetTeamId,
  });
  return allTeamMatches.filter((m) => !m.simulated).slice(0, desiredQuantity);
};

interface GetMatchesByMonthProps extends Omit<
  GetMatchesProps,
  "desiredQuantity"
> {
  targetMonth: string; // mm/yyyy
}

export const getMatchesByMonth = ({
  calendar,
  targetTeamId,
  targetMonth,
}: GetMatchesByMonthProps): Match[] => {
  const monthCalendar = calendar.filter((day) => {
    const year = day.date.slice(0, 4);
    const month = day.date.slice(5, 7);
    return `${month}-${year}` === targetMonth;
  });
  return filterMatchesByTeam({
    calendar: monthCalendar,
    teamId: targetTeamId,
  });
};

export const getLastMatches = ({
  calendar,
  targetTeamId,
  desiredQuantity = 5,
}: GetMatchesProps): Match[] => {
  const allTeamMatches = filterMatchesByTeam({
    calendar,
    teamId: targetTeamId,
  });
  return allTeamMatches
    .filter((m) => m.simulated)
    .reverse()
    .slice(0, desiredQuantity);
};

interface GetTeamTakersProps {
  setPieceTakers: {
    corner: string | null;
    penalty: string | null;
    freeKick: string | null;
  };
  teamId: string;
}

export function getTeamTakers({ setPieceTakers, teamId }: GetTeamTakersProps) {
  const resolveTaker = (playerId: string | null) =>
    playerId ? getPlayer(playerId) : undefined;

  return {
    cornerTaker: resolveTaker(setPieceTakers.corner),
    penaltyTaker: resolveTaker(setPieceTakers.penalty),
    freeKickTaker: resolveTaker(setPieceTakers.freeKick),
  };
}
