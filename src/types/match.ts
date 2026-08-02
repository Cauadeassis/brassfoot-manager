import { CompetitionId } from "./competition";
import { Player } from "./player";
import { Team } from "./team";

export interface MatchTeamsNumbers {
  home: number;
  away: number;
}
export interface MatchStatistics {
  shots: MatchTeamsNumbers;
  goals: MatchTeamsNumbers;
  possession: MatchTeamsNumbers;
  currentMinute: number;
}

export interface MatchState {
  statistics: MatchStatistics;
  events: MatchEvent[];
}

export type Result = "win" | "draw" | "defeat";

export interface Match {
  id: string;
  competitionId: CompetitionId;
  date: string;
  round: number;
  goals: MatchTeamsNumbers;
  homeTeamId: string;
  awayTeamId: string;
  simulated: boolean;
  accelerated: boolean;
}

export type EventType =
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
  type: EventType;
  shield: string;
  side: MatchSide;
  shooter: Player;
  goalkeeper?: Player;
  assistant?: Player;
}

export type Shot =
  | { type: "corner"; result: "goal" | "defended" | "missed" }
  | { type: "open_play"; result: "goal" | "defended" | "corner" | "missed" };

export interface ShotLog {
  type: Shot["type"];
  result: Shot["result"];
  assistant?: Player;
  shooter: Player;
  goalkeeper?: Player;
}
export interface MatchTeams {
  homeTeam: Team;
  awayTeam: Team;
}
export interface EventLog {
  id: string;
  minute: number;
  shield: string | null;
  icon: string;
  text: string;
}

export type Intensity = "low" | "medium" | "high";
export interface IntensityMessages {
  low: string[];
  medium: string[];
  high: string[];
}
