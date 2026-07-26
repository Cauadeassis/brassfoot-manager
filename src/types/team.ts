import { FormationType } from "../data/formations";
import { Nationality } from "../data/nationalities";
import { Trophies } from "./competition";

export type Modality = "masculine" | "feminine";
export type Division = "A" | "B";
export type PlayStyle = "balanced" | "offensive" | "defensive";
export type TeamType = "club" | "national";

export interface TeamStatistics {
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  matchesPlayed: number;
}
export interface Team {
  id: string;
  name: string;
  type: TeamType;
  nationality: Nationality;
  shield: string;
  division: Division;
  description: string;
  overall: number;
  rankingScore: number;
  money: number;
  squad: {
    playerIds: string[];
    starterIds: string[];
    playerShirts: Record<string, number>;
  };
  history: Record<number, TeamStatistics>;
  trophies: Trophies;
  tactics: {
    formation: FormationType;
    style: PlayStyle;
    captainId: string | null;
    takers: {
      penalty: string | null;
      freeKick: string | null;
      corner: string | null;
    };
  };
}

export interface GeneralTeamData
  extends
    Omit<Team, "division" | "overall" | "rankingScore">,
    Pick<RawTeamData, "overall" | "division"> {}

export interface RawTeamData extends Pick<
  Team,
  "name" | "shield" | "money" | "type" | "nationality"
> {
  description?: string;
  trophies?: Trophies;
  overall: { masculine: number; feminine: number };
  division: { masculine: Division; feminine: Division };
}

export type TeamStatistic = keyof TeamStatistics;
