import getPositionsData from "../gameEngine/generators/positions";
import NATIONALITIES_DATA from "../data/nationalities";
import { Region } from "../types/competition";
import { Position } from "../types/player";
import { PositionGroup } from "../app/(game)/squad/page";
import FORMATIONS_DATA from "../data/formations";
import { COMPETITION_TYPES_MAP, COMPETITIONS_SCOPE_MAP, GROUP_LABELS, REGION_LABELS } from "./labels";
import { Modality } from "../types/team";
import { CompetitionScope } from "../stores/useFilterStore";

export interface SelectOption {
  value: string | number | "all";
  label: string | number;
}
const regionKeys = Object.keys(REGION_LABELS) as Region[];

export const regionOptions: SelectOption[] = [
  { value: "all", label: "Todas as regiões" },
  ...regionKeys.map((region) => ({
    value: region,
    label: REGION_LABELS[region],
  })),
];

export const competitionTypes = Object.keys(COMPETITION_TYPES_MAP)

export const COMPETITION_TYPE_OPTIONS: SelectOption[] = [
  { value: "all", label: "Todas" },
  ...competitionTypes.map((competition) => ({
    value: competition,
    label: COMPETITION_TYPES_MAP[competition],
  })),
];

const COMPETITIONS_SCOPE = Object.keys(
  COMPETITIONS_SCOPE_MAP,
) as CompetitionScope[];

export const COMPETITION_SCOPE_OPTIONS: SelectOption[] = [
  { value: "all", label: "Todas competições" },
  ...COMPETITIONS_SCOPE.map((competitionType) => ({
    value: competitionType,
    label: COMPETITIONS_SCOPE_MAP[competitionType],
  })),
];

const groupKeys = Object.keys(GROUP_LABELS) as PositionGroup[];
export const positionGroupOptions: SelectOption[] = [
  { value: "all", label: "Todos" },
  ...groupKeys.map((group) => ({
    value: group,
    label: GROUP_LABELS[group],
  })),
];

export const playerSortOptions: SelectOption[] = [
  { value: "overall", label: "Por Overall" },
  { value: "position", label: "Por Posição" },
  { value: "age", label: "Por Idade" },
];
export const lineupOptions: SelectOption[] = [
  { value: "all", label: "Todos" },
  { value: "starters", label: "Titulares" },
  { value: "reserves", label: "Reservas" },
];

export const teamTypeOptions: SelectOption[] = [
  { value: "club", label: "Clubes" },
  { value: "national", label: "Seleções" },
];

export const divisionOptions: SelectOption[] = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
];

export function getRoundsOptions(roundNumbers: number[]): SelectOption[] {
  const baseOption: SelectOption[] = [
    { value: "all", label: "Todas as Rodadas" },
  ];
  const dynamicOptions: SelectOption[] = roundNumbers.map((roundNumber) => ({
    value: roundNumber,
    label: roundNumber,
  }));
  return [...baseOption, ...dynamicOptions];
}

export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
function getMonthsOptions(): SelectOption[] {
  return [
    { value: "all", label: "Todos os Meses" },
    ...MONTHS.map((month, index) => ({ value: index, label: month })),
  ];
}

export const monthsOptions = getMonthsOptions();

interface GetPositionsOptionsProps {
  modality: Modality;
}

export function getPositionsOptions({
  modality = "masculine",
}: GetPositionsOptionsProps): SelectOption[] {
  const POSITIONS_DATA = getPositionsData(modality);
  return [
    { value: "all", label: "Todas as Posições" },
    ...(Object.keys(POSITIONS_DATA) as Position[]).map((position) => ({
      value: position,
      label: `${POSITIONS_DATA[position].label.plural}`,
    })),
  ];
}
interface SimplifiedTeam {
  id: string;
  name: string;
}

interface GetTeamOptionsProps {
  teams: SimplifiedTeam[];
  userTeamId?: string | null;
}

export function getTeamsOptions({
  teams,
  userTeamId = null,
}: GetTeamOptionsProps): SelectOption[] {
  const baseOption = [{ value: "all", label: "Todos os times" }];
  const dynamicOptions = teams
    .filter((team) => team.id !== userTeamId)
    .map((team) => ({ value: team.id, label: team.name }));

  return [...baseOption, ...dynamicOptions];
}

interface GetNationalityOptionsProps {
  region?: Region | "all";
}

export function getNationalityOptions({
  region = "all",
}: GetNationalityOptionsProps): SelectOption[] {
  const allNationalities = Object.entries(NATIONALITIES_DATA);
  const filteredEntries =
    region === "all"
      ? allNationalities
      : allNationalities.filter(([_, data]) => data.region === region);
  return [
    { value: "all", label: "Todos os países" },
    ...filteredEntries.map(([key]) => ({
      value: key,
      label: key,
    })),
  ];
}

export const formationOptions: SelectOption[] = Object.keys(
  FORMATIONS_DATA,
).map((formation) => ({
  value: formation,
  label: formation,
}));
export const playStyleOptions: SelectOption[] = [
  { value: "balanced", label: "Equilibrado" },
  { value: "offensive", label: "Ofensivo" },
  { value: "defensive", label: "Defensivo" },
];
