import { buildCompetitions } from "../gameEngine/generators/competitions";
import { Competition } from "../types/competition";
import { nationalLeagueRules, nationsCupRules } from "./rules";

export const worldCupQualifier = {
  id: "worldCupQualifiers",
  name: {
    singular: "Eliminatórias da Copa",
    plural: "Eliminatórias da Copa",
  },
  eligibility: { teamType: "national" },
  rules: nationalLeagueRules,
  input: [],
  frequency: "quadrienal",
  output: [{ id: "worldCup", slots: 32 }],
} as Competition;
export const worldCup = {
  id: "worldCup",
  name: {
    singular: "Copa do Mundo",
    plural: "Copas do Mundo",
  },

  eligibility: { teamType: "national" },
  rules: {
    ...nationsCupRules,
    hasThirdPlaceMatch: true,
  },
  input: [{ id: "worldCupQualifiers", slots: 32 }],
  output: [],
} as Competition;
export const worldClubs = {
  id: "worldClubs",
  name: {
    singular: "Mundial de Clubes",
    plural: "Mundiais do Clubes",
  },
  eligibility: { teamType: "club" },
  rules: {
    ...nationsCupRules,
    hasThirdPlaceMatch: false,
  },
  frequency: "quadrienal",
  input: [
    { id: "america_club_competition", slots: 4 },
    { id: "european_clubs_competition", slots: 4 },
  ],
  output: [],
} as Competition;
export const european_cupQualifiers = {
  id: `european_cupQualifiers`,
  name: {
    singular: "Eliminatórias da Eurocopa",
    plural: "Eliminatórias da Eurocopa",
  },
  eligibility: { region: "european", teamType: "national" },
  rules: nationalLeagueRules,
  input: [],
  frequency: "quadrienal",
  output: [{ id: "european_cup", slots: 24 }],
} as Competition;
export const nationsLeague = {
  id: "european_nations_competition",
  name: {
    singular: "Nations League",
    plural: "Nations Leagues",
  },
  eligibility: { region: "european", teamType: "national" },
  frequency: "bienal",
  rules: {
    format: "cup",
    hasGroupStage: true,
    groupStageGamesPerRound: 2,
    knockoutGamesPerRound: 1,
    hasThirdPlaceMatch: true,
    finalIsSingleGame: true,
  },
} as Competition;
const COMPETITIONS: Competition[] = buildCompetitions();

export default COMPETITIONS;
