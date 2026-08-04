import { PositionGroup } from "../app/(game)/squad/page";
import NATIONALITIES_DATA, { Nationality } from "../data/nationalities";
import { CompetitionScope } from "../stores/useFilterStore";
import { CompetitionId, Region } from "../types/competition";
import { TeamType } from "../types/team";

const NATIONAL_LEAGUES: Partial<Record<CompetitionId, QuantityVariation>> = {
  BR_league: {
    singular: "Brasileirão",
    plural: "Brasileirões",
  },
  GB_league: {
    singular: "Premier League",
    plural: "Premier Leagues",
  },
  ES_league: {
    singular: "La Liga",
    plural: "La Ligas",
  },
  DE_league: {
    singular: "Bundesliga",
    plural: "Bundesligas",
  },
  IT_league: {
    singular: "SerieA",
    plural: "SerieA",
  },
  PT_league: {
    singular: "LigaPortugal",
    plural: "LigaPortugal",
  },
  AR_league: {
    singular: "LigaArgentina",
    plural: "LigaArgentina",
  },
};

const REGIONAL_CUPS: Partial<Record<CompetitionId, QuantityVariation>> = {
  worldCup: { singular: "Copa do Mundo", plural: "Copas do Mundo" },
  european_cup: { singular: "Eurocopa", plural: "Eurocopas" },
  northAmerican_cup: {
    singular: "Copa Ouro",
    plural: "Copas Ouro",
  },
  southAmerican_cup: {
    singular: "Copa América",
    plural: "Copas América",
  },
};

const REGIONAL_CLUBS_COMPETITIONS: Partial<
  Record<CompetitionId, QuantityVariation>
> = {
  european_clubs_competition: {
    singular: "Champions League",
    plural: "Champions Leagues",
  },
  southAmerican_clubs_competition: {
    singular: "Libertadores",
    plural: "Libertadores",
  },

  northAmerican_clubs_competition: {
    singular: "Copa dos Campeões",
    plural: "Copas dos Campeões",
  },
};

const NATIONAL_CUPS: Partial<Record<CompetitionId, QuantityVariation>> = {
  BR_cup: {
    singular: "Copa do Brasil",
    plural: "Copas do Brasil",
  },
  ES_cup: {
    singular: "Copa del Rey",
    plural: "Copas del Rey",
  },
};

const NATIONAL_SUPERCUPS: Partial<Record<CompetitionId, QuantityVariation>> = {
  BR_supercup: {
    singular: "Supercopa Rei",
    plural: "Supercopas Rei",
  },
};

export const COMPETITION_NAMES: Partial<
  Record<CompetitionId, QuantityVariation>
> = {
  worldClubs: { singular: "Mundial de Clubes", plural: "Mundiais de Clubes" },
  worldCupQualifiers: {
    singular: "Qualificatórias da Copa",
    plural: "Qualificatórias da Copa",
  },
  european_cupQualifiers: {
    singular: "Qualificatórias da Eurocopa",
    plural: "Qualificatórias da Eurocopa",
  },
  european_nations_competition: {
    singular: "Nations League",
    plural: "Nations Leagues",
  },
  ...NATIONAL_LEAGUES,
  ...NATIONAL_CUPS,
  ...NATIONAL_SUPERCUPS,
  ...REGIONAL_CUPS,
  ...REGIONAL_CLUBS_COMPETITIONS,
};

export const GROUP_LABELS: Record<PositionGroup, string> = {
  attackers: "Atacantes",
  goalkeepers: "Goleiros",
  defenders: "Defensores",
  midfielders: "Meio Campistas",
};

export const REGION_LABELS: Record<Region, string> = {
  southAmerican: "América do Sul",
  european: "Europa",
  northAmerican: "América do Norte",
  african: "África",
  asian: "Ásia",
};

interface GetLabelProps {
  length: number;
  key: CompetitionId;
}

export interface QuantityVariation {
  singular: string;
  plural: string;
}

interface GenderVariation {
  masculine: string;
  feminine: string;
}
export const COMPETITION_TYPES_MAP: Record<string, string> = {
  league: "Liga",
  cup: "Copa",
  supercup: "Supercopa",
};

export const TEAMTYPES_NAMES: Record<TeamType, string> = {
  club: "clubes",
  national: "seleções",
};

export const COMPETITIONS_SCOPE_MAP: Record<CompetitionScope, string> = {
  national: "Nacionais",
  continental: "Continentais",
  world: "Mundiais",
};

export const getCompetitionName = ({ length, key }: GetLabelProps): string => {
  const staticName = COMPETITION_NAMES[key];
  if (staticName) {
    return length === 1 ? staticName.singular : staticName.plural;
  }
  const [nationalityCode, compType] = key.split("_");
  const baseType = COMPETITION_TYPES_MAP[compType];
  const nationalityData = NATIONALITIES_DATA[nationalityCode as Nationality];
  if (!baseType || !nationalityData) {
    throw new Error(`Id de competição inválido: ${key}`);
  }
  const typeWord = baseType.charAt(0).toUpperCase() + baseType.slice(1);
  const demonymBase = nationalityData.demonym.feminine;
  const demonymWord =
    demonymBase.charAt(0).toUpperCase() + demonymBase.slice(1);
  return length === 1
    ? `${typeWord} ${demonymWord}`
    : `${typeWord}s ${demonymWord}s`;
};
