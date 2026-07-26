import { CompetitionRules } from "../types/competition";

export const nationalLeagueRules: CompetitionRules = {
  format: "league",
  hasGroupStage: false,
  leagueGamesPerOpponent: 2, // Turno e returno padrão
  hasThirdPlaceMatch: false,
  finalIsSingleGame: true,
};

export const regionalClubsRules: CompetitionRules = {
  format: "mixed", // Clubes continentais têm fase de grupos, logo são mixed
  hasGroupStage: true,
  groupSize: 4,
  groupStageGamesPerRound: 2,
  knockoutGamesPerRound: 2,
  hasThirdPlaceMatch: false,
  finalIsSingleGame: true,
};

export const nationsCupRules: CompetitionRules = {
  format: "mixed",
  hasGroupStage: true,
  groupSize: 4,
  groupStageGamesPerRound: 1,
  knockoutGamesPerRound: 1,
  hasThirdPlaceMatch: true,
  finalIsSingleGame: true,
};

export const nationalCupRules: CompetitionRules = {
  format: "cup",
  hasGroupStage: false,
  knockoutGamesPerRound: 2, // Ida e volta para maior rentabilidade/giro de calendário
  hasThirdPlaceMatch: false,
  finalIsSingleGame: false, // Ida e volta (como a Copa do Brasil)
};

export const nationalSupercupRules: CompetitionRules = {
  format: "cup",
  hasGroupStage: false,
  knockoutGamesPerRound: 1, // Torneio de jogo único
  hasThirdPlaceMatch: false,
  finalIsSingleGame: true,
};
