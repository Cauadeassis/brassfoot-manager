import useGameStore from "./stores/useGameStore";
import { Position } from "./types/player";
import { Competition } from "./types/competition";
import { Player } from "./types/player";
import { Team } from "./types/team";
import COMPETITIONS from "./data/competitions";
import getPositionsData from "./gameEngine/generators/positions";

export const getRandom = <T>(props: { array: readonly T[] }): T => {
  return props.array[Math.floor(Math.random() * props.array.length)];
};

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let firstIndex = shuffled.length - 1; firstIndex > 0; firstIndex--) {
    const secondIndex = Math.floor(Math.random() * (firstIndex + 1));
    [shuffled[firstIndex], shuffled[secondIndex]] = [
      shuffled[secondIndex],
      shuffled[firstIndex],
    ];
  }
  return shuffled;
}

export const getCompatiblePositions = (position: Position): Position[] => {
  const POSITIONS_DATA = getPositionsData("masculine");
  return [position, ...(POSITIONS_DATA[position].canBePlayedBy ?? [])];
};

export const getCompetition = (id: string): Competition | undefined =>
  COMPETITIONS.find((competition) => competition.id === id);

export const overallLimits = [
  { min: 80, label: "alto", color: "green-color" },
  { min: 72, label: "medio", color: "yellow-color" },
  { min: 0, label: "baixo", color: "red-color" },
];

export const getOverallLabel = (overall: number): string =>
  overallLimits.find(({ min }) => overall >= min)!.label;

const moneyFormatMap = [
  { divisor: 1_000_000, suffix: "M" },
  { divisor: 1_000, suffix: "K" },
];

export function formatMoney(value: number | string): string {
  const numericValue = Number(value);
  const formatRule = moneyFormatMap.find(
    ({ divisor }) => Math.abs(numericValue) >= divisor,
  );
  if (!formatRule) return new Intl.NumberFormat("pt-BR").format(numericValue);

  const reducedValue = numericValue / formatRule.divisor;

  return (
    new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 1,
    }).format(reducedValue) + formatRule.suffix
  );
}

// ---------------------------------------------------------
// FUNÇÕES DE ACESSO AO ESTADO (Usando Zustand .getState())
// ---------------------------------------------------------

export const getTeam = (id: string): Team | undefined =>
  useGameStore.getState().teams[id];

export const getUserTeam = (): Team => {
  const state = useGameStore.getState();
  if (!state.userTeamId)
    throw new Error("User team ID is not set in the game state.");
  const userTeam = state.teams[state.userTeamId];
  if (!userTeam)
    throw new Error(`Team with ID ${state.userTeamId} could not be found.`);
  return userTeam;
};
interface GetPlayersByPositionProps {
  positions: Position[];
  starters: Player[];
}
export function filterPlayersByPosition({
  positions,
  starters,
}: GetPlayersByPositionProps): Player[] {
  return starters.filter((player) => positions.includes(player.position));
}

export const getPlayer = (playerId: string): Player | undefined =>
  useGameStore.getState().players[playerId];

export const getSpriteId = (path: string) => {
  const normalizedPath = path.replace(/\\/g, "/").replace(/\.svg$/, "");
  const parts = normalizedPath.split("/");
  const fileName = parts[parts.length - 1];
  const parentFolder = parts[parts.length - 2];
  return `${parentFolder}-${fileName}`.toLowerCase();
};
