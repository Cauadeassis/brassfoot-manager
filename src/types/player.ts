import { Nationality } from "../data/nationalities";
import { Trophies } from "./competition";

export type Skill =
  | "shooting"
  | "vision"
  | "physical"
  | "dribbling"
  | "defense"
  | "reflexes";

export interface PlayerTournamentStatistics {
  playerId: string;
  teamId: string;
  goals: number;
  assists: number;
}

export interface Player {
  id: string;
  name: string;
  currentTeamId: string | null;
  position: Position;
  age: number;
  nationality: Nationality;
  overall: number;
  currentSkills: PlayerSkills;
  potentialSkills: PlayerSkills;
  value: number;
  stamina: number;
  history: PlayerHistoryMap;
  trophies: Trophies;
}

export type PlayerHistoryMap = Record<string, PlayerStatistics>;

export interface BaseSkills {
  shooting: number;
  vision: number;
  physical: number;
}

export type PlayerRole = "shooter" | "assistant" | "goalkeeper";

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
  | "MA"
  | "MC"
  | "PE"
  | "PD"
  | "CA";

interface BaseStatistics {
  teamId: string;
  season: number;
  competitionId: string;
  redCards: number;
  yellowCards: number;
  matchesPlayed: number;
}

export interface AttackerStatistics extends BaseStatistics {
  role: "attacker";
  goals: number;
  assists: number;
}

export interface GoalkeeperStatistics extends BaseStatistics {
  role: "goalkeeper";
  defenses: number;
}

export type PlayerStatistics = AttackerStatistics | GoalkeeperStatistics;

export type PlayerStatistic =
  | "goals"
  | "assists"
  | "defenses"
  | "redCards"
  | "yellowCards"
  | "matchesPlayed";
