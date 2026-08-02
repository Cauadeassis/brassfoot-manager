import { Match } from "../../types/match";
import { Team } from "../../types/team";
import {
  CompetitionRules,
  CompetitionFormat,
  CompetitionId,
} from "../../types/competition";
import { shuffleArray } from "../../utils";
import { CalendarGenerationError } from "../../errors";

interface CreateMatchProps extends Pick<
  Match,
  "homeTeamId" | "awayTeamId" | "competitionId" | "round"
> {}

interface GenerateRoundRobinProps {
  teamIds: string[];
  competitionId: CompetitionId;
  doubleLegged: boolean;
  roundLabelPrefix?: string;
}

interface ChunkTeamsIntoGroupsProps {
  teams: Team[];
  groupSize: number;
}

interface GenerateCalendarProps {
  teams: Team[];
  rules: CompetitionRules;
  competitionId: CompetitionId;
}

const createMatch = ({
  homeTeamId,
  awayTeamId,
  competitionId,
  round,
}: CreateMatchProps): Omit<Match, "date"> => ({
  id: crypto.randomUUID(),
  competitionId,
  homeTeamId,
  awayTeamId,
  round,
  simulated: false,
  accelerated: false,
  goals: { home: 0, away: 0 },
});

const chunkTeamsIntoGroups = ({
  teams,
  groupSize,
}: ChunkTeamsIntoGroupsProps): Team[][] => {
  if (!teams || teams.length === 0) {
    throw CalendarGenerationError.missingTeams();
  }
  const shuffledTeams = shuffleArray(teams);
  const groups: Team[][] = [];
  for (let index = 0; index < shuffledTeams.length; index += groupSize) {
    groups.push(shuffledTeams.slice(index, index + groupSize));
  }
  return groups;
};

const generateRoundRobinMatches = ({
  teamIds,
  competitionId,
  doubleLegged,
  roundLabelPrefix = "Rodada",
}: GenerateRoundRobinProps): Match[][] => {
  if (!teamIds || teamIds.length === 0) {
    throw CalendarGenerationError.missingTeams();
  }
  const shuffledTeamIds = shuffleArray(teamIds);
  const hasOddTeams = shuffledTeamIds.length % 2 !== 0;
  const normalizedTeamIds = hasOddTeams
    ? [...shuffledTeamIds, "BYE"]
    : [...shuffledTeamIds];
  const teamCount = normalizedTeamIds.length;
  let rotation = [...normalizedTeamIds];
  const singleTurnRounds = teamCount - 1;
  const totalRounds = doubleLegged ? singleTurnRounds * 2 : singleTurnRounds;

  const matchesPerRound: Omit<Match, "date">[][] = Array.from(
    { length: totalRounds },
    () => [],
  );

  for (let roundIndex = 0; roundIndex < singleTurnRounds; roundIndex++) {
    for (let matchIndex = 0; matchIndex < teamCount / 2; matchIndex++) {
      const homeTeamId = rotation[matchIndex];
      const awayTeamId = rotation[teamCount - 1 - matchIndex];
      if (homeTeamId !== "BYE" && awayTeamId !== "BYE") {
        matchesPerRound[roundIndex].push(
          createMatch({
            homeTeamId,
            awayTeamId,
            competitionId,
            round: roundIndex + 1,
          }),
        );
      }
    }
    rotation = [
      rotation[0],
      rotation[teamCount - 1],
      ...rotation.slice(1, teamCount - 1),
    ];
  }

  if (doubleLegged) {
    for (let roundIndex = 0; roundIndex < singleTurnRounds; roundIndex++) {
      const returnRoundIndex = roundIndex + singleTurnRounds;
      matchesPerRound[returnRoundIndex] = matchesPerRound[roundIndex].map(
        (match) =>
          createMatch({
            homeTeamId: match.awayTeamId,
            awayTeamId: match.homeTeamId,
            competitionId,
            round: returnRoundIndex + 1,
          }),
      );
    }
  }

  return matchesPerRound as Match[][];
};

export const generateLeagueMatches = ({
  teams,
  rules,
  competitionId,
}: GenerateCalendarProps): Match[][] => {
  const divisions = [...new Set(teams.map((team) => team.division))];
  const allRounds: Match[][] = [];
  const doubleLegged = (rules.leagueGamesPerOpponent || 2) === 2;
  divisions.forEach((division) => {
    const divisionTeams = teams.filter((team) => team.division === division);
    const teamIds = divisionTeams.map((team) => team.id);
    const divisionMatches = generateRoundRobinMatches({
      teamIds,
      competitionId,
      doubleLegged,
      roundLabelPrefix: `Rodada (${division})`,
    });

    divisionMatches.forEach((matches, roundIndex) => {
      if (!allRounds[roundIndex]) allRounds[roundIndex] = [];
      allRounds[roundIndex].push(...matches);
    });
  });

  return allRounds;
};

export const generateCupMatches = ({
  teams,
  rules,
  competitionId,
}: GenerateCalendarProps): Match[][] => {
  const allRounds: Match[][] = [];
  const shuffledTeams = shuffleArray(teams);
  const initialKnockoutMatches: Omit<Match, "date">[] = [];
  const initialKnockoutReturnMatches: Omit<Match, "date">[] = [];

  for (let index = 0; index < shuffledTeams.length; index += 2) {
    if (!shuffledTeams[index + 1]) break;
    initialKnockoutMatches.push(
      createMatch({
        homeTeamId: shuffledTeams[index].id,
        awayTeamId: shuffledTeams[index + 1].id,
        competitionId,
        round: 1,
      }),
    );

    if (rules.knockoutGamesPerRound === 2) {
      initialKnockoutReturnMatches.push(
        createMatch({
          homeTeamId: shuffledTeams[index + 1].id,
          awayTeamId: shuffledTeams[index].id,
          competitionId,
          round: 2,
        }),
      );
    }
  }

  allRounds.push(initialKnockoutMatches as Match[]);
  if (rules.knockoutGamesPerRound === 2) {
    allRounds.push(initialKnockoutReturnMatches as Match[]);
  }

  return allRounds;
};

export const generateMixedMatches = ({
  teams,
  rules,
  competitionId,
}: GenerateCalendarProps): Match[][] => {
  const allRounds: Match[][] = [];
  const groupSize = rules.groupSize || 4;
  const groups = chunkTeamsIntoGroups({ teams, groupSize });
  const groupStageGamesPerRound = rules.groupStageGamesPerRound || 1;
  const isGroupStageDoubleLegged = groupStageGamesPerRound === 2;
  const groupStageRoundsCount = (groupSize - 1) * groupStageGamesPerRound;
  const totalGroupMatches: Match[][] = Array.from(
    { length: groupStageRoundsCount },
    () => [],
  );
  groups.forEach((group, index) => {
    const groupTeamIds = group.map((team) => team.id);
    const groupMatches = generateRoundRobinMatches({
      teamIds: groupTeamIds,
      competitionId,
      doubleLegged: isGroupStageDoubleLegged, // Variável dinâmica
      roundLabelPrefix: `Grupo ${String.fromCharCode(65 + index)} - Rodada`,
    });
    groupMatches.forEach((matches, roundIndex) => {
      totalGroupMatches[roundIndex].push(...matches);
    });
  });

  totalGroupMatches.forEach((matches) => {
    allRounds.push(matches);
  });

  return allRounds;
};

const CALENDAR_STRATEGIES: Record<
  CompetitionFormat,
  (props: GenerateCalendarProps) => Match[][]
> = {
  league: generateLeagueMatches,
  cup: generateCupMatches,
  mixed: generateMixedMatches,
};

export const generateMatches = (props: GenerateCalendarProps): Match[][] => {
  if (!props.teams || props.teams.length === 0) {
    throw CalendarGenerationError.missingTeams();
  }

  const generatorFunction = CALENDAR_STRATEGIES[props.rules.format];
  if (!generatorFunction) {
    throw CalendarGenerationError.unsupportedFormat(props.rules.format);
  }

  return generatorFunction(props);
};
