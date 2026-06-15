import useGameStore from "./stores/useGameStore";
import type { Team, Player, Competition, Position } from "./types";
import COMPETITIONS from "./data/competitions";
import POSITIONS_DATA from "./data/positions";

// ---------------------------------------------------------
// FUNÇÕES PURAS (Não dependem do estado global)
// ---------------------------------------------------------

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

export const getCompatiblePositions = (position: Position): Position[] =>
  POSITIONS_DATA[position]?.compatible ?? [position];

export function getStarters(team: Team): Player[] {
  const starterIds = new Set(team.startersId.map(String));
  return team.squad.filter((player) => starterIds.has(player.id));
}

export const getGK = (starters: Player[]) =>
  starters.find((player) => player.position === "GK") || starters[0]; // Ajuste "GOL" ou "GK" de acordo com sua tipagem de posições

export interface FilterPlayersByPositionProps {
  starters: Player[];
  array: Position[];
}

export const filterPlayersByPosition = ({
  starters,
  array,
}: FilterPlayersByPositionProps) =>
  starters.filter((player) => array.includes(player.position));

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

export const getTeam = (id: number): Team | undefined =>
  useGameStore.getState().teams.find((team) => team.id === id);

export const getSquad = (teamId: number) => getTeam(teamId)?.squad || [];

interface GetPlayerProps {
  playerId: string;
  teamId: number;
}

export const getPlayer = ({
  playerId,
  teamId,
}: GetPlayerProps): Player | undefined => {
  const squad = getSquad(teamId);
  return squad.find((player) => player.id === playerId);
};

export const getUserTeam = (): Team => {
  const state = useGameStore.getState();

  if (state.userTeamId === null)
    throw new Error("User team ID is not set in the game state.");

  const userTeam = state.teams.find((t) => t.id === state.userTeamId);

  if (!userTeam)
    throw new Error(`Team with ID ${state.userTeamId} could not be found.`);

  return userTeam;
};
