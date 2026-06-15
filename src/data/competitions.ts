import type { Competition } from "../types";

const COMPETITIONS: Competition[] = [
  {
    id: "brasileirao",
    name: "Brasileirão",
    description:
      "A principal competição de clubes do Brasil, surgida em 1971, onde os melhores times disputam o título nacional em pontos corridos.",
    shield: "/competitions/Brasileirao.svg",
    eligibility: { nationality: "BR", teamType: "club" },
    rules: {
      format: "league",
      hasGroupStage: false,
      knockoutGamesPerRound: 1,
      hasThirdPlaceMatch: false,
      finalIsSingleGame: false,
    },
  },
  {
    id: "championsLeague",
    name: "Champions League",
    description:
      "A maior e mais prestigiada liga de clubes da Europa, atuando desde 1955, que reune a elite do futebol mundial.",
    shield: "/competitions/ChampionsLeague.svg",
    eligibility: { region: "europe", teamType: "club", minimumOverall: 80 },
    rules: {
      format: "tournament",
      hasGroupStage: true,
      knockoutGamesPerRound: 2,
      hasThirdPlaceMatch: false,
      finalIsSingleGame: true,
    },
  },
  {
    id: "libertadores",
    name: "Libertadores",
    description:
      "O torneio de clubes mais importante da América do Sul, surgido em 1960.",
    shield: "/competitions/Libertadores.svg",
    eligibility: {
      region: "southAmerica",
      teamType: "club",
      minimumOverall: 80,
    },
    rules: {
      format: "tournament",
      hasGroupStage: true,
      knockoutGamesPerRound: 2,
      hasThirdPlaceMatch: false,
      finalIsSingleGame: true,
    },
  },
  {
    id: "worldClubs",
    name: "Mundial de Clubes",
    description:
      "O palco onde os campeões continentais se enfrentam para decidir quem é o melhor clube do mundo.",
    shield: "/competitions/WorldClubs.svg",
    eligibility: { teamType: "club", minimumOverall: 85 },
    rules: {
      format: "tournament",
      hasGroupStage: true,
      knockoutGamesPerRound: 1,
      hasThirdPlaceMatch: false,
      finalIsSingleGame: true,
    },
  },
  {
    id: "nationsLeague",
    name: "Nations League",
    description:
      "Torneio entre seleções europeias que traz partidas competitivas entre as maiores potências do continente.",
    shield: "/competitions/NationsLeague.svg",
    eligibility: { region: "europe", teamType: "national" },
    rules: {
      format: "tournament",
      hasGroupStage: true,
      knockoutGamesPerRound: 1,
      hasThirdPlaceMatch: true,
      finalIsSingleGame: true,
    },
  },
  {
    id: "americanCup",
    name: "Copa América",
    description:
      "O torneio de seleções mais antigo do mundo, coroando a melhor nação da América do Sul.",
    shield: "/competitions/AmericanCup.svg",
    eligibility: { region: "southAmerica", teamType: "national" },
    rules: {
      format: "tournament",
      hasGroupStage: true,
      knockoutGamesPerRound: 1,
      hasThirdPlaceMatch: true,
      finalIsSingleGame: true,
    },
  },
  {
    id: "europeanCup",
    name: "Eurocopa",
    description:
      "Realizada a cada quatro anos, é a competição que define a seleção dominante no futebol europeu.",
    shield: "/competitions/EuropeanCup.svg",
    eligibility: { region: "europe", teamType: "national" },
    rules: {
      format: "tournament",
      hasGroupStage: true,
      knockoutGamesPerRound: 1,
      hasThirdPlaceMatch: false,
      finalIsSingleGame: true,
    },
  },
  {
    id: "worldCup",
    name: "Copa do Mundo",
    description:
      "O ápice do futebol mundial, onde seleções de todos os continentes lutam pela glória eterna.",
    shield: "/competitions/WorldCup.svg",
    eligibility: { teamType: "national" },
    rules: {
      format: "tournament",
      hasGroupStage: true,
      knockoutGamesPerRound: 1,
      hasThirdPlaceMatch: true,
      finalIsSingleGame: true,
    },
  },
];

export default COMPETITIONS;
