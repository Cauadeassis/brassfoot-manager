import COMPETITIONS from "../../data/competitions";
import { Team } from "../../types/team";
import { GameState } from "../../types/state";
import { CompetitionState } from "../../types/competition";
import { generateMatches } from "./matches";
import { buildMasterCalendar } from "./calendar";
import { CompetitionSlot } from "./calendar";
import NATIONALITIES_DATA from "../../data/nationalities";
import { CompetitionEligibility } from "../../types/competition";
import { Match } from "../../types/match";
type Criteria = keyof CompetitionEligibility;
type EligibilityValueMap = {
  [K in Criteria]: Required<CompetitionEligibility>[K];
};

const ELIGIBILITY_RULES: {
  [K in Criteria]: (team: Team, value: EligibilityValueMap[K]) => boolean;
} = {
  teamType: (team, value) => team.type === value,
  nationality: (team, value) => team.nationality === value,
  region: (team, value) => {
    const teamRegion = NATIONALITIES_DATA[team.nationality]?.region;
    return teamRegion === value;
  },
};

interface IsTeamEligibleProps {
  team: Team;
  eligibility: CompetitionEligibility;
}

export const isEligible = ({
  team,
  eligibility,
}: IsTeamEligibleProps): boolean => {
  const entries = Object.entries(eligibility) as {
    [K in Criteria]: [K, EligibilityValueMap[K]];
  }[Criteria][];
  return entries.every(([key, value]) => {
    const rule = ELIGIBILITY_RULES[key];
    return rule ? (rule as any)(team, value) : true;
  });
};

const initialCompetitions = COMPETITIONS.filter((comp) => !comp.input);

interface GenerateSeasonProps {
  teams: Team[];
  season: number;
}

interface GenerateSeasonResult {
  calendar: GameState["calendar"];
  competitions: CompetitionState[];
}
const generateSeason = ({
  teams,
  season,
}: GenerateSeasonProps): GenerateSeasonResult => {
  const competitionsSlots: CompetitionSlot[] = [];
  const initialCompetitionsState: CompetitionState[] = [];
  initialCompetitions.forEach((competition) => {
    const eligibleTeams = teams.filter((team) =>
      isEligible({ team, eligibility: competition.eligibility }),
    );

    if (eligibleTeams.length === 0) return;
let matches: Match[][] = [];
try {
  matches = generateMatches({
    teams: eligibleTeams,
    rules: competition.rules,
    competitionId: competition.id,
  });
} catch (error) {
  if (error instanceof Error) {
    console.error(`Falha ao gerar o calendário: ${error.message}`);
  }
  matches = []; 
}

    competitionsSlots.push({ competitionId: competition.id, matches });
    initialCompetitionsState.push({
      id: competition.id,
      standings: eligibleTeams.map((team) => ({
        teamId: team.id,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        matchesPlayed: 0,
      })),
      matches,
      stats: [],
    });
  });
  const calendar = buildMasterCalendar({
    season,
    competitions: competitionsSlots,
  });
  return { calendar, competitions: initialCompetitionsState };
};
export default generateSeason;
