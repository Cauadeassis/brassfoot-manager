import { Modality } from "./team";
import { Team } from "./team";
import { Player } from "./player";
import { Match } from "./match";
import { CompetitionState } from "./competition";
import { ContractOffer } from "./contract";

export interface TransferOffer {
  buyerTeamId: string | null;
  sellerTeamId: string | null;
  playerId: string;
  value: number;
  contractOffer?: ContractOffer;
  expiresAt?: string;
}

export interface TransferProposal {
  playerId: string;
  sellerTeamId: string | null;
  transferFee: number;
  contractOffer: ContractOffer;
}

export type TransferProposalResult = {
  status: "accepted" | "rejected";
  message: string;
  clubAccepted: boolean;
  playerAccepted: boolean;
};

export interface TransferNotification {
  sellerTeamId: string;
  playerId: string;
  value: number;
  buyerTeamId: string;
  contractOffer: ContractOffer;
  expiresAt: string;
  text: string;
}

export type SimulationInterruptType =
  "MATCH_DAY" | "PLAYER_INJURY" | "TRANSFER_OFFER" | "SUSPENSION";

export interface SimulationInterrupt {
  stoppedAtDate: string;
  reason: SimulationInterruptType;
  eventPayload?: unknown;
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
  payrollSalaryDays: Record<string, number>;
  competitions: CompetitionState[];
  calendar: CalendarDay[];
  notifications: TransferNotification[];
  results: Match[];
}
