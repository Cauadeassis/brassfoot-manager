import { Nationality } from "../data/nationalities";
import { Division, TeamType } from "./team";
import { Match } from "./match";
import { PlayerTournamentStatistics } from "./player";
import { TeamStatistics } from "./team";

export type CompetitionFormat = "league" | "cup" | "mixed";
export type Region =
  "southAmerican" | "european" | "northAmerican" | "african" | "asian";
export type CompetitionId =
  | "worldCup"
  | "worldClubs"
  | "worldCupQualifiers"
  | "european_cupQualifiers"
  | `${Region}_clubs_competition`
  | `${Region}_nations_competition`
  | `${Region}_cup`
  | `${Nationality}_league`
  | `${Nationality}_league_${Division}`
  | `${Nationality}_cup`
  | `${Nationality}_supercup`;
export type Frequency = "anual" | "bienal" | "quadrienal";
export interface Confederation {
  id: string;
  name: string;
  competitions: RegionalCompetition[];
}

export interface CompetitionState {
  id: CompetitionId;
  matches: Match[][];
  standings: Standing[];
  stats: PlayerTournamentStatistics[];
}

export type Trophies = Partial<Record<CompetitionId, number[]>>;

export interface Standing extends TeamStatistics {
  teamId: string;
}

export interface CompetitionRules {
  format: CompetitionFormat;
  hasGroupStage: boolean;
  groupSize?: number;
  leagueGamesPerOpponent?: 1 | 2;
  groupStageGamesPerRound?: 1 | 2;
  knockoutGamesPerRound?: 1 | 2;
  hasThirdPlaceMatch: boolean;
  finalIsSingleGame: boolean;
}

export interface CompetitionEligibility {
  region?: Region;
  teamType: TeamType;
  nationality?: Nationality;
  division?: Division;
}

export interface Competition {
  id: CompetitionId;
  eligibility: CompetitionEligibility;
  rules: CompetitionRules;
  frequency?: Frequency;
  input?: TargetCompetition[];
  output?: TargetCompetition[];
}

export interface TargetCompetition {
  id: CompetitionId; // Se rebaixamento, BR_league_B. Senão, southAmerican_clubs_competition
  slots: number;
  isRelegation?: boolean;
}

export interface RegionalCompetition extends Pick<
  Competition,
  "id" | "rules" | "eligibility"
> {
  slotsByNationality?: Partial<Record<Nationality, number>>;
  defaultSlots?: number;
}
