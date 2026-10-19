import {
  GameState,
  SimulationInterrupt,
  TransferProposal,
  TransferProposalResult,
  TransferOffer,
} from "../types/state";
import { Match, MatchEvent } from "../types/match";
import { Modality, Team } from "../types/team";

export interface LoadStateProps {
  state: GameState;
}

export interface SetModalityProps {
  modality: Modality;
}

export interface UpdateTeamMoneyProps {
  teamId: string;
  amount: number;
}

export interface ChangeTacticsPayload {
  formation?: Team["tactics"]["formation"];
  style?: Team["tactics"]["style"];
  takers?: Team["tactics"]["takers"];
}

export interface ChangeTacticsProps {
  teamId: string;
  payload: ChangeTacticsPayload;
}

export interface FinishMatchProps {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
}

export interface GameActions {
  loadState: (props: LoadStateProps) => void;
  setModality: (props: SetModalityProps) => void;
  updateTeamMoney: (props: UpdateTeamMoneyProps) => void;
  resetGame: () => void;
  finishMatch: (props: FinishMatchProps) => void;
  changeTactics: (props: ChangeTacticsProps) => void;
  getNextMatch: () => Match;
  startSeason: () => void;
}

export interface CalendarActions {
  advanceDay: () => void;
  advanceUntilEventOrMatch: () => SimulationInterrupt;
}

export interface MarketActions {
  acceptOffer: (index: number) => void;
  rejectOffer: (index: number) => void;
  sellPlayer: (playerId: string) => void;
  makeTransfer: (transfer: TransferOffer) => void;
  generateOffer: () => void;
  aiManageMarket: () => void;
  submitTransferProposal: (
    proposal: TransferProposal,
  ) => TransferProposalResult;
}

export type GameStore = GameState &
  GameActions &
  CalendarActions &
  MarketActions;
