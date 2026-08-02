import { Nationality } from "../data/nationalities";
import { Division, TeamType } from "./team";
import { Match } from "./match";
import { PlayerTournamentStatistics } from "./player";
import { TeamStatistics } from "./team";
import { type } from "os";
import { QuantityVariation } from "../filters/labels";
export type CompetitionFormat = "league" | "cup" | "mixed";
export type Region =
  "southAmerican" | "european" | "northAmerican" | "african" | "asian";
export type CompetitionId =
  | "worldCup"
  | "worldClubs"
  | "worldCupQualifiers"
  | "europeanCupQualifiers"
  | `${Region}_clubs_competition`
  | `${Region}_nations_competition`
  | `${Region}Cup`
  | `${Nationality}_league`
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
  groupSize?: number; // Para formatos 'mixed'
  leagueGamesPerOpponent?: 1 | 2; // Para formatos 'league' puros
  groupStageGamesPerRound?: 1 | 2; // Para formatos 'mixed'
  knockoutGamesPerRound?: 1 | 2; // Para formatos 'cup' ou 'mixed'
  hasThirdPlaceMatch: boolean;
  finalIsSingleGame: boolean;
}

export interface CompetitionEligibility {
  region?: Region;
  teamType: TeamType;
  nationality?: Nationality;
}

export interface TargetCompetition {
  id: CompetitionId;
  slots: number;
}

export interface RegionalCompetition extends Pick<
  Competition,
  "id" | "rules" | "eligibility"
> {
  slotsByNationality?: Partial<Record<Nationality, number>>;
  defaultSlots?: number;
}

export interface Competition {
  id: CompetitionId;
  eligibility: CompetitionEligibility;
  rules: CompetitionRules;
  frequency?: Frequency;
  input?: TargetCompetition[];
  output?: TargetCompetition[];
}
