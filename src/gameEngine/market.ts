import {
  GameState,
  TransferOffer,
  TransferProposal,
  TransferProposalResult,
} from "../types/state";
import { Team } from "../types/team";
import { Player } from "../types/player";
import { getRandom, formatMoney } from "../utils";
import getPositionsData from "./generators/positions";
import { Position } from "../types/player";
import { TransferError } from "../errors";
import {
  createContractFromOffer,
  evaluatePlayerContractOffer,
  generateAIContractOffer,
  validateContractOffer,
} from "./contracts";
import { ContractOffer } from "../types/contract";

interface MakeTransferProps {
  draft: GameState;
  transferOffer: TransferOffer;
}

export function isTransferWindowOpen(date: string): boolean {
  const month = Number(date.slice(5, 7));
  return month === 1 || month === 2 || month === 7 || month === 8;
}

export function getTransferWindowEnd(date: string): string | null {
  const [year, month] = date.split("-").map(Number);
  if (!isTransferWindowOpen(date)) return null;
  if (month <= 2) {
    const lastDay = new Date(year, 2, 0).getDate();
    return `${year}-02-${String(lastDay).padStart(2, "0")}`;
  }
  return `${year}-08-31`;
}

function getAIContractOffer(player: Player): ContractOffer | null {
  return generateAIContractOffer({
    age: player.age,
    overall: player.overall,
    value: player.value,
    maxWageCommitment: player.value * 0.25,
  });
}

interface GenerateTransferMessageProps {
  player: Player;
  value: number;
  signingBonus: number;
  buyer?: Team | null;
  seller?: Team | null;
}

const generateTransferMessage = ({
  player,
  value,
  signingBonus,
  buyer,
  seller,
}: GenerateTransferMessageProps) => {
  const stateKey = `${seller ? "team" : "free"}_to_${buyer ? "team" : "free"}`;
  const messages: Record<string, string> = {
    team_to_team: `${player.name} foi transferido do ${seller?.name} para ${buyer?.name} por ${formatMoney(value)}. Luvas: ${formatMoney(signingBonus)}.`,
    free_to_team: `${player.name} contratado como agente livre pelo ${buyer?.name}. Luvas: ${formatMoney(signingBonus)}.`,
    team_to_free: `${player.name} foi dispensado pelo ${seller?.name} e agora está livre no mercado.`,
  };
  return messages[stateKey];
};

const completeTransfer = ({
  draft,
  buyer,
  seller,
  player,
  value,
  contractOffer,
}: {
  draft: GameState;
  buyer: Team | null;
  seller: Team | null;
  player: Player;
  value: number;
  contractOffer?: ContractOffer;
}): string => {
  const { buyerTeamId, sellerTeamId } = {
    buyerTeamId: buyer?.id ?? null,
    sellerTeamId: seller?.id ?? null,
  };
  let playerIndex = -1;
  if (seller) {
    playerIndex = seller.squad.playerIds.findIndex((id) => id === player.id);
    if (playerIndex === -1) throw TransferError.playerNotFound(player.name);
  }

  const signingBonus = buyer?.type === "club" ? contractOffer!.signingBonus : 0;
  if (seller) seller.squad.playerIds.splice(playerIndex, 1);
  if (buyer) {
    buyer.money -= value + signingBonus;
    buyer.squad.playerIds.push(player.id);
    player.currentTeamId = buyer.id;
    player.contract =
      buyer.type === "club" && contractOffer
        ? createContractFromOffer(contractOffer, draft.currentDate)
        : null;
  } else {
    player.currentTeamId = null;
    player.contract = null;
  }
  if (seller && buyer) seller.money += value;

  return generateTransferMessage({
    player,
    value,
    signingBonus,
    buyer,
    seller,
  });
};

export const makeTransfer = ({
  draft,
  transferOffer,
}: MakeTransferProps): string | null => {
  const { buyerTeamId, sellerTeamId, playerId, value, contractOffer } =
    transferOffer;
  if (!buyerTeamId && !sellerTeamId)
    throw TransferError.missingBuyerAndSeller();
  const buyer = buyerTeamId ? draft.teams[buyerTeamId] : null;
  const seller = sellerTeamId ? draft.teams[sellerTeamId] : null;
  const player = draft.players[playerId];
  if (!player) throw new Error("Jogador não encontrado na base de dados!");
  if (seller && !seller.squad.playerIds.includes(playerId)) {
    throw TransferError.playerNotFound(player.name);
  }
  if (!seller && player.currentTeamId !== null && buyer) {
    throw TransferError.invalidPlayer(player.name);
  }

  if (!Number.isSafeInteger(value) || value < 0) return null;
  if (buyer && buyer.id === draft.userTeamId) return null;
  if (
    buyer &&
    seller?.type === "club" &&
    buyer.type === "club" &&
    !isTransferWindowOpen(draft.currentDate)
  ) {
    return null;
  }
  if (buyer?.type === "club") {
    if (!contractOffer || validateContractOffer(contractOffer)) return null;
    if (
      !evaluatePlayerContractOffer({
        age: player.age,
        overall: player.overall,
        value: player.value,
        offer: contractOffer,
      }).accepted
    ) {
      return null;
    }
  }

  const signingBonus =
    buyer?.type === "club" ? (contractOffer?.signingBonus ?? 0) : 0;
  if (buyer && buyer.money < value + signingBonus) {
    if (buyerTeamId === draft.userTeamId) throw TransferError.missingMoney();
    return null;
  }

  return completeTransfer({
    draft,
    buyer,
    seller,
    player,
    value,
    contractOffer,
  });
};

export const evaluateTransferProposal = ({
  draft,
  buyerTeamId,
  proposal,
}: {
  draft: GameState;
  buyerTeamId: string;
  proposal: TransferProposal;
}): TransferProposalResult => {
  const seller = proposal.sellerTeamId
    ? draft.teams[proposal.sellerTeamId]
    : null;
  const buyer = draft.teams[buyerTeamId];
  const player = draft.players[proposal.playerId];
  const rejected = (
    message: string,
    clubAccepted = false,
    playerAccepted = false,
  ): TransferProposalResult => ({
    status: "rejected",
    message,
    clubAccepted,
    playerAccepted,
  });

  if (!player || !buyer || (seller && player.currentTeamId !== seller.id)) {
    return rejected("A proposta de transferência é inválida.");
  }
  if (!seller && player.currentTeamId !== null) {
    return rejected("O jogador não está livre no mercado.");
  }
  if (buyer.type !== "club") {
    return rejected("Apenas clubes podem contratar jogadores.");
  }

  if (
    seller &&
    seller.type === "club" &&
    !isTransferWindowOpen(draft.currentDate)
  ) {
    return rejected("A janela de transferências está fechada.");
  }
  if (
    !Number.isSafeInteger(proposal.transferFee) ||
    proposal.transferFee < 0 ||
    (!seller && proposal.transferFee !== 0)
  ) {
    return rejected("Informe uma taxa de transferência válida.");
  }

  const clubAccepted = !seller || proposal.transferFee >= player.value;
  const contractError = validateContractOffer(proposal.contractOffer);
  const playerEvaluation = contractError
    ? { accepted: false, message: "Os termos do contrato são inválidos." }
    : evaluatePlayerContractOffer({
        age: player.age,
        overall: player.overall,
        value: player.value,
        offer: proposal.contractOffer,
      });
  const playerAccepted = playerEvaluation.accepted;

  if (
    buyer.money <
    proposal.transferFee + proposal.contractOffer.signingBonus
  ) {
    return rejected(
      "Seu clube não tem saldo para taxa e luvas.",
      clubAccepted,
      playerAccepted,
    );
  }
  if (!clubAccepted || !playerAccepted) {
    const message = !clubAccepted
      ? `${seller?.name} recusou a taxa. Valor estimado: ${formatMoney(player.value)}.`
      : playerEvaluation.message;
    return rejected(message, clubAccepted, playerAccepted);
  }

  const message = completeTransfer({
    draft,
    buyer,
    seller,
    player,
    value: proposal.transferFee,
    contractOffer: proposal.contractOffer,
  });

  return { status: "accepted", message, clubAccepted, playerAccepted };
};

export const processAITransfers = (gameState: GameState): void => {
  const teamsList = Object.values(gameState.teams);
  const POSITIONS_DATA = getPositionsData(gameState.modality!);
  const freeAgents = Object.values(gameState.players).filter(
    (p) => p.currentTeamId === null,
  );
  teamsList.forEach((team) => {
    if (team.id === gameState.userTeamId) return;
    if (team.squad.playerIds.length > 22) {
      const positionGroups: Record<string, Player[]> = {};
      team.squad.playerIds.forEach((id: string) => {
        const player = gameState.players[id];
        if (!player) return;
        if (!positionGroups[player.position])
          positionGroups[player.position] = [];
        positionGroups[player.position].push(player);
      });

      const surplusPlayers: Player[] = [];
      Object.entries(positionGroups).forEach(([position, players]) => {
        const limit = POSITIONS_DATA[position as Position]?.max || 2;
        if (players.length > limit) {
          const sortedByQuality = [...players].sort(
            (a, b) => b.overall - a.overall,
          );
          surplusPlayers.push(...sortedByQuality.slice(limit));
        }
      });

      if (surplusPlayers.length > 0) {
        surplusPlayers.sort((a, b) => a.overall - b.overall);
        const playerToSell = surplusPlayers[0];

        makeTransfer({
          draft: gameState,
          transferOffer: {
            playerId: playerToSell.id,
            value: playerToSell.value,
            buyerTeamId: null,
            sellerTeamId: team.id,
          },
        });
      }
    }
    if (
      team.squad.playerIds.length < 18 &&
      freeAgents.length > 0 &&
      team.money > 2_000_000
    ) {
      const affordableFreeAgent = freeAgents.find((player) => {
        const offer = getAIContractOffer(player);
        return (
          offer !== null &&
          player.value + offer.signingBonus <= team.money * 0.5
        );
      });

      if (affordableFreeAgent) {
        makeTransfer({
          draft: gameState,
          transferOffer: {
            playerId: affordableFreeAgent.id,
            value: affordableFreeAgent.value,
            buyerTeamId: team.id,
            sellerTeamId: null,
            contractOffer: getAIContractOffer(affordableFreeAgent) ?? undefined,
          },
        });
        const agentIndex = freeAgents.findIndex(
          (p) => p.id === affordableFreeAgent.id,
        );
        if (agentIndex > -1) freeAgents.splice(agentIndex, 1);
      }
    }
  });
};

interface GenerateOfferProps {
  teams: Team[];
  players: Record<string, Player>;
  userTeamId: string | null;
  currentCount: number;
  currentDate: string;
}

export const generateOffer = ({
  teams,
  players,
  userTeamId,
  currentCount,
  currentDate,
}: GenerateOfferProps) => {
  if (currentCount >= 3 || !userTeamId || !isTransferWindowOpen(currentDate))
    return null;
  const userTeam = teams.find((team) => team.id === userTeamId);
  if (!userTeam) return null;
  const buyablePlayers = userTeam.squad.playerIds
    .map((id) => players[id])
    .filter((player) => player && player.overall >= 72);
  if (!buyablePlayers.length || Math.random() >= 0.4) return null;
  const targetPlayer = getRandom({ array: buyablePlayers });
  const contractOffer = getAIContractOffer(targetPlayer);
  if (!contractOffer) return null;
  const value = Math.floor(targetPlayer.value * (1.1 + Math.random() * 0.5));
  const otherTeams = teams.filter(
    (team) =>
      team.id !== userTeamId &&
      team.type === "club" &&
      team.money >= value + contractOffer.signingBonus,
  );
  if (!otherTeams.length) return null;
  const buyerTeam = getRandom({ array: otherTeams });
  const expiresAt = getTransferWindowEnd(currentDate);
  if (!expiresAt) return null;
  return {
    playerId: targetPlayer.id,
    value,
    contractOffer,
    expiresAt,
    sellerTeamId: userTeam.id,
    buyerTeamId: buyerTeam.id,
    text: `${buyerTeam.name} oferece ${formatMoney(value)} por ${targetPlayer.name}, mais ${formatMoney(contractOffer.signingBonus)} em luvas e ${formatMoney(contractOffer.salary)}/mês por ${contractOffer.durationInMonths} meses.`,
  };
};
