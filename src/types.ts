import type { Nationality } from "./data/nationalities";

export interface BaseSkills {
  shooting: number;
  vision: number;
  physical: number;
}
export interface Transaction {
  buyerTeamId: number | null;
  sellerTeamId: number | null;
  playerId: string;
  value: number;
}
export type Skill =
  | "shooting"
  | "vision"
  | "physical"
  | "dribbling"
  | "defense"
  | "reflexes";
export interface AttackerSkills extends BaseSkills {
  dribbling: number; // 0-90
}

export interface DefenderSkills extends BaseSkills {
  defense: number; // 0-90
}

export interface MixedSkills extends BaseSkills {
  dribbling: number;
  defense: number;
}

export interface GoalkeeperSkills extends BaseSkills {
  reflexes: number; // 0-90
}
export type PositionSkillGroup =
  | "attacker"
  | "defender"
  | "mixed"
  | "goalkeeper";
export type PlayerSkills =
  | AttackerSkills
  | DefenderSkills
  | GoalkeeperSkills
  | MixedSkills;

export type Position =
  | "GK"
  | "ZA"
  | "VOL"
  | "LE"
  | "LD"
  | "ME"
  | "MD"
  | "MC"
  | "MO"
  | "PE"
  | "PD"
  | "CA";
export type Division = "A" | "B";
export type FormationType = "4-3-3" | "4-4-2" | "4-2-3-1";
export type PlayStyle = "balanced" | "offensive" | "defensive";
export type CompetitionFormat = "league" | "tournament";

export type CompetitionId =
  | "brasileirao"
  | "championsLeague"
  | "libertadores"
  | "worldClubs"
  | "worldCup"
  | "nationsLeague"
  | "europeanCup"
  | "americanCup";
export interface CompetitionDescriptions {
  [key: string]: string;
}

export interface CompetitionRules {
  format: CompetitionFormat;
  hasGroupStage: boolean;
  knockoutGamesPerRound: 1 | 2;
  hasThirdPlaceMatch: boolean;
  finalIsSingleGame: boolean;
}

export interface CompetitionEligibility {
  region?: Region;
  teamType: TeamType;
  nationality?: Nationality;
  minimumOverall?: number;
}

export interface Competition {
  id: CompetitionId;
  name: string;
  shield: string;
  description: string;
  eligibility: CompetitionEligibility;
  rules: CompetitionRules;
}

export interface Player {
  id: string;
  name: string;
  position: Position;
  age: number;
  nationality: Nationality;
  overall: number;
  skills: PlayerSkills;
  value: number;
  statistics: PlayerStatistics;
}

interface PlayerStatistics {
  goals: number;
  assistance: number;
  redCards: number;
  yellowCards: number;
  matchesPlayed: number;
}

export type TeamType = "club" | "national";
export type Region = "southAmerica" | "europe";

export interface Team {
  id: number;
  key: string;
  name: string;
  type: TeamType;
  nationality: Nationality;
  shield: string;
  division: Division;
  competitionDescriptions?: CompetitionDescriptions;
  overall: number;
  money: number;
  squad: Player[];
  startersId: string[];
  statistics: TeamStatistics;
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

export interface TeamStatistics {
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  matchesPlayed: number;
}

export interface SimulationState {
  currentMinute: number;
  homeGoals: number;
  awayGoals: number;
  homeShots: number;
  awayShots: number;
  homePossession: number;
  events: MatchEvent[];
}

export interface Match {
  id: string;
  homeTeamId: number;
  awayTeamId: number;
  roundNumber: number;
  simulated: boolean;
  homeGoals: number;
  awayGoals: number;
  accelerated: boolean;
}

export interface Round {
  roundNumber: number;
  matches: Match[];
}

export type MatchEventType =
  | "shot_missed"
  | "shot_defended_caught"
  | "shot_defended_corner"
  | "corner_goal"
  | "corner_defended"
  | "corner_missed"
  | "goal"
  | "yellow_card"
  | "red_card"
  | "substitution";
export type MatchSide = "home" | "away";

export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  shield: string;
  side: MatchSide;
  shooter: Player;
  goalkeeper?: Player;
  assistant?: Player;
}

export interface TransferNotification {
  sellerTeamId: number;
  playerId: string;
  value: number;
  buyerTeamId: number;
  text: string;
}

export interface GameState {
  competitionId: string | null;
  userTeamId: number | null;
  season: number;
  currentRound: number;
  teams: Team[];
  freeAgents: Player[];
  calendar: Round[];
  activeMatch: Match | null;
  notifications: TransferNotification[];
  results: Match[];
}
