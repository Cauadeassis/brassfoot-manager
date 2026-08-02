import { Modality } from "./team";
import { Team } from "./team";
import { Player } from "./player";
import { Match } from "./match";
import { CompetitionState } from "./competition";

export interface TransferOffer {
  buyerTeamId: string | null;
  sellerTeamId: string | null;
  playerId: string;
  value: number;
}

export interface TransferNotification {
  sellerTeamId: string;
  playerId: string;
  value: number;
  buyerTeamId: string;
  text: string;
}

export type Style =
  "green-color" | "yellow-color" | "red-color" | "blue-color" | "none";
export type WorldStatus =
  "IDLE" | "MATCH_DAY" | "TRANSFER_WINDOW" | "SEASON_END";

export interface CalendarDay {
  date: string;
  matches: Match[];
  events?: string[];
}

export interface GameState {
  currentDate: string;
  modality: Modality;
  season: number;
  status: WorldStatus;
  userTeamId: string | null;
  players: Record<string, Player>;
  teams: Record<string, Team>;
  competitions: CompetitionState[];
  calendar: CalendarDay[];
  activeMatch: Match | null;
  notifications: TransferNotification[];
  results: Match[];
}
