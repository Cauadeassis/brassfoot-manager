import { Match } from "../../types/match";
import { addDays, format, differenceInDays } from "date-fns";
import { CalendarDay } from "../../types/state";
import { CalendarGenerationError } from "../../errors";
import { CompetitionFormat } from "../../types/competition";
interface BuildMasterCalendarProps {
    season: number;
    competitions: CompetitionSlot[];
}

export interface CompetitionSlot {
    competitionId: string;
    matches: Match[][];
    format?: CompetitionFormat;
}

export const buildMasterCalendar = ({
    season,
    competitions,
}: BuildMasterCalendarProps): CalendarDay[] => {
    if (!competitions || competitions.length === 0) {
        throw CalendarGenerationError.missingCompetitions();
    }

    const calendar: CalendarDay[] = [];
    const competitionById = new Map(
        competitions.map((competition) => [competition.competitionId, competition]),
    );
    const teamCompCount: Record<string, Set<string>> = {};

    competitions.forEach((competition) => {
        competition.matches.forEach((round) => {
            round.forEach((match) => {
                if (!teamCompCount[match.homeTeamId]) {
                    teamCompCount[match.homeTeamId] = new Set();
                }
                if (!teamCompCount[match.awayTeamId]) {
                    teamCompCount[match.awayTeamId] = new Set();
                }

                teamCompCount[match.homeTeamId].add(competition.competitionId);
                teamCompCount[match.awayTeamId].add(competition.competitionId);
            });
        });
    });

    const teamLastMatchDate: Record<string, Date> = {};
    const pendingRounds = competitions.map((competition) => ({
        id: competition.competitionId,
        rounds: [...competition.matches],
    }));
    let activeMatchPool: Match[] = [];
    let currentDate = new Date(Number(season), 0, 1);
    const endDate = new Date(Number(season), 11, 31);

    const isCupCompetition = (competitionId: string) =>
        competitionById.get(competitionId)?.format === "cup";

    const isTeamRested = ({
        teamId,
        currentDate,
        minRestDays,
        competitionId,
    }: {
        teamId: string;
        currentDate: Date;
        minRestDays: number;
        competitionId: string;
    }) => {
        if (isCupCompetition(competitionId)) {
            return true;
        }

        const lastMatchDate = teamLastMatchDate[teamId];
        return !lastMatchDate || differenceInDays(currentDate, lastMatchDate) >= minRestDays;
    };

    while (currentDate <= endDate) {
        const dateString = format(currentDate, "yyyy-MM-dd");
        const dailyMatches: Match[] = [];
        const compDailyCount: Record<string, number> = {};

        if (currentDate.getDay() === 1 || activeMatchPool.length === 0) {
            pendingRounds.forEach((comp) => {
                if (comp.rounds.length > 0) {
                    const nextRound = comp.rounds.shift();
                    if (nextRound) activeMatchPool.push(...nextRound);
                }
            });
        }

        const remainingPool: Match[] = [];
        activeMatchPool.forEach((match) => {
            const homeTotalCompetitions = teamCompCount[match.homeTeamId]?.size || 1;
            const awayTotalCompetitions = teamCompCount[match.awayTeamId]?.size || 1;
            const homeMinRestDays = homeTotalCompetitions >= 3 ? 2 : 3;
            const awayMinRestDays = awayTotalCompetitions >= 3 ? 2 : 3;

            const homeIsRested = isTeamRested({
                teamId: match.homeTeamId,
                currentDate,
                minRestDays: homeMinRestDays,
                competitionId: match.competitionId,
            });
            const awayIsRested = isTeamRested({
                teamId: match.awayTeamId,
                currentDate,
                minRestDays: awayMinRestDays,
                competitionId: match.competitionId,
            });

            const compId = match.competitionId;
            const matchesTodayForComp = compDailyCount[compId] || 0;

            if (homeIsRested && awayIsRested && matchesTodayForComp < 3) {
                dailyMatches.push({ ...match, date: dateString });
                teamLastMatchDate[match.homeTeamId] = currentDate;
                teamLastMatchDate[match.awayTeamId] = currentDate;
                compDailyCount[compId] = matchesTodayForComp + 1;
            } else {
                remainingPool.push(match);
            }
        });

        activeMatchPool = remainingPool;
        if (dailyMatches.length > 0) {
            calendar.push({
                date: dateString,
                matches: dailyMatches,
                events: [],
            });
        }
        currentDate = addDays(currentDate, 1);
    }
    const hasUnscheduledMatches = activeMatchPool.length > 0;
    const hasPendingRounds = pendingRounds.some((comp) => comp.rounds.length > 0);

    if (hasUnscheduledMatches || hasPendingRounds) {
        const failedCompId =
            activeMatchPool[0]?.competitionId ||
            pendingRounds.find((c) => c.rounds.length > 0)?.id;

        throw CalendarGenerationError.overlappingDates(failedCompId);
    }

    return calendar;
};
