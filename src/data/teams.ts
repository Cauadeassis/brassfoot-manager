import { createBaseTeam } from "../gameEngine/team";
import { RawTeamData, GeneralTeamData } from "../types/team";
const topTierPatch = 330_000_000;
const richTeamPatch = 220_000_000;
const mediumTeamPatch = 120_000_000;
const poorTeamPatch = 50_000_000;

const NATIONAL_TEAMS: RawTeamData[] = [
  {
    name: "Colômbia",
    shield: "/flags/southAmerica/Colombia.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 80,
      feminine: 78,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "CO",
    trophies: {
      southAmerican_cup: [2001],
    },
  },
  {
    name: "Equador",
    shield: "/flags/southAmerica/Equador.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 76,
      feminine: 58,
    },
    money: poorTeamPatch,
    type: "national",
    nationality: "EC",
  },
  {
    name: "Paraguai",
    shield: "/flags/southAmerica/Paraguai.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 74,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "national",
    nationality: "PY",
    trophies: {
      southAmerican_cup: [1953, 1979],
    },
  },
  {
    name: "Peru",
    shield: "/flags/southAmerica/Peru.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 70,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "national",
    nationality: "PE",
    trophies: {
      southAmerican_cup: [1939, 1975],
    },
  },
  {
    name: "Uruguai",
    shield: "/flags/southAmerica/Uruguai.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 82,
      feminine: 58,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "UY",
    trophies: {
      worldCup: [1930, 1950],
      southAmerican_cup: [
        1916, 1917, 1920, 1923, 1924, 1926, 1935, 1942, 1956, 1959, 1967, 1983,
        1987, 1995, 2011,
      ],
    },
  },
  {
    name: "Venezuela",
    shield: "/flags/southAmerica/Venezuela.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 74,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "national",
    nationality: "VE",
  },
  {
    name: "Inglaterra",
    shield: "/flags/europe/England.svg",
    description:
      "Quebre a seca de 1966 e traga o segundo título mundial para os ingleses!",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 95,
      feminine: 92,
    },
    money: richTeamPatch,
    type: "national",
    nationality: "GB",
    trophies: {
      worldCup: [1966],
    },
  },
  {
    name: "França",
    shield: "/flags/europe/France.svg",
    description:
      "Bicampeã mundial, com um craque pra cada posição... você quer jogar no modo fácil, né?",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 96,
      feminine: 80,
    },
    money: richTeamPatch,
    type: "national",
    nationality: "FR",
    trophies: {
      worldCup: [1998, 2018],
      european_cup: [1984, 2000],
      european_nations_competition: [2021],
    },
  },
  {
    name: "Alemanha",
    shield: "/flags/europe/Germany.svg",
    description: "Tetracampeã mundial, em busca do penta",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 84,
      feminine: 90,
    },
    money: richTeamPatch,
    type: "national",
    nationality: "DE",
    trophies: {
      worldCup: [1954, 1974, 1990, 2014],
      european_cup: [1972, 1980, 1996],
    },
  },
  {
    name: "Itália",
    shield: "/flags/europe/Italy.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 78,
      feminine: 68,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "IT",
    trophies: {
      worldCup: [1934, 1938, 1982, 2006],
      european_cup: [1968, 2020],
    },
  },
  {
    name: "Noruega",
    shield: "/flags/europe/Norway.svg",
    description: "Temos um fã do Haaland aqui!",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 82,
      feminine: 74,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "NO",
  },
  {
    name: "Portugal",
    shield: "/flags/europe/Portugal.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 94,
      feminine: 62,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "PT",
    trophies: {
      european_cup: [2016],
      european_nations_competition: [2019],
    },
  },
  {
    name: "Espanha",
    shield: "/flags/europe/Spain.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 100,
      feminine: 96,
    },
    money: richTeamPatch,
    type: "national",
    nationality: "ES",
    trophies: {
      worldCup: [2010, 2026],
      european_cup: [1964, 2008, 2012, 2024],
      european_nations_competition: [2023],
    },
  },
  {
    name: "Suécia",
    shield: "/flags/europe/Sweden.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 74,
      feminine: 80,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "SE",
  },
  {
    name: "Suíça",
    shield: "/flags/europe/Switzerland.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 76,
      feminine: 66,
    },
    money: poorTeamPatch,
    type: "national",
    nationality: "CH",
  },
  {
    name: "Bélgica",
    shield: "/flags/europe/Belgium.svg",
    description:
      "Lidere a Bélgica sem geração belga, sem copas, sem favoritismo e sem craques. Boa sorte!",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 78,
      feminine: 62,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "BE",
  },
  {
    name: "Holanda",
    shield: "/flags/europe/Netherlands.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 90,
      feminine: 82,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "NL",
    trophies: {
      european_cup: [1988],
    },
  },
  {
    name: "Marrocos",
    shield: "/flags/africa/Morocco.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 90,
      feminine: 62,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "MA",
  },
  {
    name: "Cabo Verde",
    shield: "/flags/africa/CapeVerde.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 68,
      feminine: 50,
    },
    money: poorTeamPatch,
    type: "national",
    nationality: "CV",
  },
  {
    name: "Costa do Marfim",
    shield: "/flags/africa/IvoryCoast.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 82,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "national",
    nationality: "CI",
  },
  {
    name: "Senegal",
    shield: "/flags/africa/Senegal.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 81,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "national",
    nationality: "SN",
  },
  {
    name: "Japão",
    shield: "/flags/asia/Japan.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 90,
      feminine: 88,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "JP",
  },
  {
    name: "Estados Unidos",
    shield: "/flags/northAmerica/UnitedStates.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 77,
      feminine: 96,
    },
    money: richTeamPatch,
    type: "national",
    nationality: "US",
    trophies: {
      european_nations_competition: [2021, 2023, 2024],
    },
  },
  {
    name: "Canadá",
    shield: "/flags/northAmerica/Canada.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 72,
      feminine: 82,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "CA",
  },
  {
    name: "México",
    shield: "/flags/northAmerica/Mexico.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 78,
      feminine: 68,
    },
    money: mediumTeamPatch,
    type: "national",
    nationality: "MX",
  },
  {
    name: "Argentina",
    shield: "/flags/southAmerica/Argentina.svg",
    description: "Vai jogar de Argentina? Isso que não pode",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 92,
      feminine: 65,
    },
    money: richTeamPatch,
    type: "national",
    nationality: "AR",
    trophies: {
      worldCup: [1978, 1986, 2022],
      southAmerican_cup: [
        1921, 1925, 1927, 1929, 1937, 1941, 1945, 1946, 1947, 1955, 1957, 1959,
        1991, 1993, 2021, 2024,
      ],
    },
  },
  {
    name: "Bolívia",
    shield: "/flags/southAmerica/Bolivia.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 62,
      feminine: 50,
    },
    money: poorTeamPatch,
    type: "national",
    nationality: "BO",
    trophies: {
      southAmerican_cup: [1963],
    },
  },
  {
    name: "Brasil",
    shield: "/flags/southAmerica/Brazil.svg",
    description: "Pronto pra trazer o hexa pra casa, guerreiro?",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 93,
      feminine: 82,
    },
    money: richTeamPatch,
    type: "national",
    nationality: "BR",
    trophies: {
      worldCup: [2002, 1994, 1970, 1962, 1958],
      southAmerican_cup: [1919, 1922, 1949, 1989, 1997, 1999, 2004, 2007, 2019],
    },
  },
  {
    name: "Chile",
    shield: "/flags/southAmerica/Chile.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 74,
      feminine: 62,
    },
    money: poorTeamPatch,
    type: "national",
    nationality: "CL",
    trophies: {
      southAmerican_cup: [2015, 2016],
    },
  },
]

const CLUBS: RawTeamData[] = [
  {
    name: "Arsenal",
    shield: "/clubs/europe/GB/Arsenal.svg",
    description:
      "Com um futebol vistoso e jovem, o Arsenal busca finalmente conquistar a Europa e colocar seu nome na história do torneio",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 90,
      feminine: 96,
    },
    money: richTeamPatch,
    type: "club",
    nationality: "GB",
  },
  {
    name: "Sporting",
    shield: "/clubs/europe/PT/Sporting.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 84,
      feminine: 78,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "PT",
  },
  {
    name: "FC Porto",
    shield: "/clubs/europe/PT/FC_Porto.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 83,
      feminine: 76,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "PT",
    trophies: {
      european_clubs_competition: [1987, 2004],
      worldClubs: [1987, 2004],
    },
  },
  {
    name: "Benfica",
    shield: "/clubs/europe/PT/Benfica.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 84,
      feminine: 76,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "PT",
    trophies: {
      european_clubs_competition: [1961, 1962],
    },
  },
  {
    name: "Atlético de Madrid",
    shield: "/clubs/europe/ES/AtleticoDeMadrid.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 84,
      feminine: 74,
    },
    money: richTeamPatch,
    type: "club",
    nationality: "ES",
    trophies: {
      worldClubs: [1974],
    },
  },
  {
    name: "Atlético de Bilbao",
    shield: "/clubs/europe/ES/AtleticoDeBilbao.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 80,
      feminine: 70,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "ES",
  },
  {
    name: "Barcelona",
    shield: "/clubs/europe/ES/Barcelona.svg",
    description:
      "O Barcelona carrega o peso de sua filosofia 'Més que un club' em busca da glória europeia mais uma vez.",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 90,
      feminine: 97,
    },
    money: topTierPatch,
    type: "club",
    nationality: "ES",
    trophies: {
      european_clubs_competition: [1992, 2006, 2009, 2011, 2015],
      worldClubs: [2009, 2011, 2015],
    },
  },
  {
    name: "Bayern de Munique",
    shield: "/clubs/europe/DE/BayernDeMunique.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 90,
      feminine: 84,
    },
    money: topTierPatch,
    type: "club",
    nationality: "DE",
    trophies: {
      european_clubs_competition: [1974, 1975, 1976, 2001, 2013, 2020],
      worldClubs: [1976, 2001, 2013, 2020],
    },
  },
  {
    name: "Borussia Dortmund",
    shield: "/clubs/europe/DE/BorussiaDortmund.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 82,
      feminine: 74,
    },
    money: richTeamPatch,
    type: "club",
    nationality: "DE",
    trophies: {
      european_clubs_competition: [1997],
      worldClubs: [1997],
    },
  },
  {
    name: "Chelsea",
    shield: "/clubs/europe/GB/Chelsea.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 84,
      feminine: 93,
    },
    money: richTeamPatch,
    type: "club",
    nationality: "GB",
    trophies: {
      european_clubs_competition: [2012, 2021],
      worldClubs: [2021],
    },
  },
  {
    name: "Tottenham",
    shield: "/clubs/europe/GB/Tottenham.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 80,
      feminine: 78,
    },
    money: richTeamPatch,
    type: "club",
    nationality: "GB",
  },
  {
    name: "Inter de Milão",
    shield: "/clubs/europe/IT/InterDeMilao.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 86,
      feminine: 74,
    },
    money: richTeamPatch,
    type: "club",
    nationality: "IT",
    trophies: {
      european_clubs_competition: [1964, 1965, 2010],
      worldClubs: [1964, 1965, 2010],
    },
  },
  {
    name: "Milan",
    shield: "/clubs/europe/IT/Milan.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 82,
      feminine: 76,
    },
    money: richTeamPatch,
    type: "club",
    nationality: "IT",
    trophies: {
      european_clubs_competition: [1963, 1969, 1989, 1990, 1994, 2003, 2007],
      worldClubs: [1969, 1989, 1990, 2007],
    },
  },
  {
    name: "Juventus",
    shield: "/clubs/europe/IT/Juventus.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 83,
      feminine: 80,
    },
    money: richTeamPatch,
    type: "club",
    nationality: "IT",
    trophies: {
      european_clubs_competition: [1985, 1996],
      worldClubs: [1985, 1996],
    },
  },
  {
    name: "Liverpool",
    shield: "/clubs/europe/GB/Liverpool.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 88,
      feminine: 76,
    },
    money: topTierPatch,
    type: "club",
    nationality: "GB",
    trophies: {
      european_clubs_competition: [1977, 1978, 1981, 1984, 2005, 2019],
      worldClubs: [2019],
    },
  },
  {
    name: "Manchester City",
    shield: "/clubs/europe/GB/ManchesterCity.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 90,
      feminine: 88,
    },
    money: topTierPatch,
    type: "club",
    nationality: "GB",
    trophies: {
      european_clubs_competition: [2023],
      worldClubs: [2023],
    },
  },
  {
    name: "Manchester United",
    shield: "/clubs/europe/GB/ManchesterUnited.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 78,
      feminine: 82,
    },
    money: topTierPatch,
    type: "club",
    nationality: "GB",
    trophies: {
      european_clubs_competition: [1968, 1999, 2008],
      worldClubs: [1999, 2008],
    },
  },
  {
    name: "Paris Saint-Germain",
    shield: "/clubs/europe/FR/ParisSaintGermain.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 92,
      feminine: 78,
    },
    money: topTierPatch,
    type: "club",
    nationality: "FR",
  },
  {
    name: "Real Madrid",
    shield: "/clubs/europe/ES/RealMadrid.svg",
    description: "Você quer jogar no modo fácil, é?",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 95,
      feminine: 82,
    },
    money: topTierPatch,
    type: "club",
    nationality: "ES",
    trophies: {
      european_clubs_competition: [
        1956, 1957, 1958, 1959, 1960, 1966, 1998, 2000, 2002, 2014, 2016, 2017,
        2018, 2022, 2024,
      ],
      worldClubs: [1960, 1998, 2002, 2014, 2016, 2017, 2018, 2022],
    },
  },
  {
    name: "Independiente",
    shield: "/clubs/southAmerica/AR/Independiente.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 68,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "AR",
    trophies: {
      southAmerican_clubs_competition: [
        1964, 1965, 1972, 1973, 1974, 1975, 1984,
      ],
      worldClubs: [1973, 1984],
    },
  },
  {
    name: "Peñarol",
    shield: "/clubs/southAmerica/UY/Peñarol.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 78,
      feminine: 60,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "UY",
    trophies: {
      southAmerican_clubs_competition: [1960, 1961, 1966, 1982, 1987],
      worldClubs: [1961, 1966, 1982],
    },
  },
  {
    name: "Nacional",
    shield: "/clubs/southAmerica/UY/Nacional.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 77,
      feminine: 58,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "UY",
    trophies: {
      southAmerican_clubs_competition: [1971, 1980, 1988],
      worldClubs: [1971, 1980, 1988],
    },
  },
  {
    name: "Boca Júniors",
    shield: "/clubs/southAmerica/AR/BocaJuniors.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 85,
      feminine: 60,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "AR",
    trophies: {
      southAmerican_clubs_competition: [1977, 1978, 2000, 2001, 2003, 2007],
      worldClubs: [1977, 2000, 2003],
    },
  },
  {
    name: "Estudiantes",
    shield: "/clubs/southAmerica/AR/Estudiantes.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 78,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "AR",
    trophies: {
      southAmerican_clubs_competition: [1968, 1969, 1970, 2009],
      worldClubs: [1968],
    },
  },
  {
    name: "River Plate",
    shield: "/clubs/southAmerica/AR/RiverPlate.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 86,
      feminine: 62,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "AR",
    trophies: {
      southAmerican_clubs_competition: [1986, 1996, 2015, 2018],
      worldClubs: [1986],
    },
  },
  {
    name: "Flamengo",
    shield: "/clubs/southAmerica/BR/Flamengo.svg",
    description: "Quer jogar no modo fácil, é?",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 89,
      feminine: 78,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "BR",
    trophies: {
      southAmerican_clubs_competition: [1981, 2019, 2022],
      worldClubs: [1981],
    },
  },
  {
    name: "Palmeiras",
    shield: "/clubs/southAmerica/BR/Palmeiras.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 87,
      feminine: 84,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "BR",
    trophies: {
      southAmerican_clubs_competition: [1999, 2020, 2021],
    },
  },
  {
    name: "Atlético Mineiro",
    shield: "/clubs/southAmerica/BR/AtleticoMineiro.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 76,
      feminine: 60,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
    trophies: {
      southAmerican_clubs_competition: [2013],
    },
  },
  {
    name: "Fluminense",
    shield: "/clubs/southAmerica/BR/Fluminense.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 80,
      feminine: 62,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
    trophies: {
      southAmerican_clubs_competition: [2023],
    },
  },
  {
    name: "Internacional",
    shield: "/clubs/southAmerica/BR/Internacional.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 78,
      feminine: 82,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
    trophies: {
      southAmerican_clubs_competition: [2006, 2010],
      worldClubs: [2006],
    },
  },
  {
    name: "São Paulo",
    shield: "/clubs/southAmerica/BR/SaoPaulo.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 79,
      feminine: 85,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "BR",
    trophies: {
      southAmerican_clubs_competition: [1992, 1993, 2005],
      worldClubs: [1992, 1993, 2005],
    },
  },
  {
    name: "Grêmio",
    shield: "/clubs/southAmerica/BR/Gremio.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 75,
      feminine: 74,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
    trophies: {
      southAmerican_clubs_competition: [1983, 1995, 2017],
      worldClubs: [1983],
    },
  },
  {
    name: "Botafogo",
    shield: "/clubs/southAmerica/BR/Botafogo.svg",
    description: "Prove que o Fogão é o melhor do mundo!",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 83,
      feminine: 64,
    },
    money: -2_500_000_000,
    type: "club",
    nationality: "BR",
  },
  {
    name: "Corinthians",
    shield: "/clubs/southAmerica/BR/Corinthians.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 76,
      feminine: 93,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "BR",
    trophies: {
      southAmerican_clubs_competition: [2012],
      worldClubs: [2000, 2012],
    },
  },
  {
    name: "Ferroviária",
    shield: "/clubs/southAmerica/BR/Ferroviaria.svg",
    division: {
      masculine: "B",
      feminine: "A",
    },
    overall: {
      masculine: 62,
      feminine: 84,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },
  {
    name: "Santos",
    shield: "/clubs/southAmerica/BR/Santos.svg",
    description: "Lidere o Santos sem Pelé, sem Neymar, sem nada. Boa sorte!",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 70,
      feminine: 76,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
    trophies: {
      southAmerican_clubs_competition: [1962, 1963, 2011],
      worldClubs: [1962, 1963],
    },
  },
  {
    name: "Cruzeiro",
    shield: "/clubs/southAmerica/BR/Cruzeiro.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 80,
      feminine: 78,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "BR",
    trophies: {
      southAmerican_clubs_competition: [1976, 1997],
    },
  },
  {
    name: "Vasco",
    shield: "/clubs/southAmerica/BR/Vasco.svg",
    description: "Que Deus te ajude.",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 68,
      feminine: 60,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
    trophies: {
      southAmerican_clubs_competition: [1998],
    },
  },
  {
    name: "Atlético Paranaense",
    shield: "/clubs/southAmerica/BR/AtleticoParanaense.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 74,
      feminine: 58,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },
  {
    name: "Fortaleza",
    shield: "/clubs/southAmerica/BR/Fortaleza.svg",
    division: {
      masculine: "B",
      feminine: "B",
    },
    overall: {
      masculine: 68,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },
  {
    name: "Bahia",
    shield: "/clubs/southAmerica/BR/Bahia.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 76,
      feminine: 76,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },
  {
    name: "Bragantino",
    shield: "/clubs/southAmerica/BR/Bragantino.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 77,
      feminine: 80,
    },
    money: mediumTeamPatch,
    type: "club",
    nationality: "BR",
  },
  {
    name: "Goiás",
    shield: "/clubs/southAmerica/BR/Goias.svg",
    description: "Um dos piores clubes do planeta!",
    division: {
      masculine: "B",
      feminine: "B",
    },
    overall: {
      masculine: 62,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },
  {
    name: "Cuiabá",
    shield: "/clubs/southAmerica/BR/Cuiaba.svg",
    description: "Um dos piores clubes do planeta!",
    division: {
      masculine: "B",
      feminine: "B",
    },
    overall: {
      masculine: 60,
      feminine: 52,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },
  {
    name: "Coritiba",
    shield: "/clubs/southAmerica/BR/Coritiba.svg",
    description: "Um dos piores clubes do planeta!",
    division: {
      masculine: "A",
      feminine: "B",
    },
    overall: {
      masculine: 70,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },
  {
    name: "América-MG",
    shield: "/clubs/southAmerica/BR/AmericaMG.svg",
    description: "Um dos piores clubes do planeta!",
    division: {
      masculine: "B",
      feminine: "B",
    },
    overall: {
      masculine: 60,
      feminine: 52,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },
  {
    name: "Chapecoense",
    shield: "/clubs/southAmerica/BR/Chapecoense.svg",
    description: "Um dos piores clubes do planeta!",
    division: {
      masculine: "A",
      feminine: "B",
    },
    overall: {
      masculine: 68,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },
  {
    name: "Vila Nova",
    shield: "/clubs/southAmerica/BR/VilaNova.svg",
    description: "Um dos piores clubes do planeta!",
    division: {
      masculine: "B",
      feminine: "B",
    },
    overall: {
      masculine: 60,
      feminine: 52,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },
  {
    name: "Sport",
    shield: "/clubs/southAmerica/BR/Sport.svg",
    description: "Um dos piores clubes do planeta!",
    division: {
      masculine: "B",
      feminine: "B",
    },
    overall: {
      masculine: 62,
      feminine: 55,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },

  {
    name: "Ponte Preta",
    shield: "/clubs/southAmerica/BR/PontePreta.svg",
    description: "O futebol desse time é mais feio do que bater em mãe",
    division: {
      masculine: "B",
      feminine: "B",
    },
    overall: {
      masculine: 58,
      feminine: 52,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "BR",
  },

  {
    name: "Colo-colo",
    shield: "/clubs/southAmerica/CL/Colo-Colo.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 78,
      feminine: 60,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "CL",
    trophies: {
      southAmerican_clubs_competition: [1991],
    },
  },
  {
    name: "Olimpia",
    shield: "/clubs/southAmerica/PY/Olimpia.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 77,
      feminine: 58,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "PY",
    trophies: {
      southAmerican_clubs_competition: [1979, 1990, 2002],
      worldClubs: [1979],
    },
  },
  {
    name: "Atlético Nacional de Medellín",
    shield: "/clubs/southAmerica/CO/AtleticoNacional.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 80,
      feminine: 62,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "CO",
    trophies: {
      southAmerican_clubs_competition: [1989, 2016],
    },
  },
  {
    name: "Independiente del Valle",
    shield: "/clubs/southAmerica/EC/IndependienteDelValle.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 78,
      feminine: 58,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "EC",
  },
  {
    name: "LDU de Quito",
    shield: "/clubs/southAmerica/EC/LDUDeQuito.svg",
    division: {
      masculine: "A",
      feminine: "A",
    },
    overall: {
      masculine: 79,
      feminine: 58,
    },
    money: poorTeamPatch,
    type: "club",
    nationality: "EC",
    trophies: {
      southAmerican_clubs_competition: [2008],
    },
  },
]

const RAWTEAMS: RawTeamData[] = [
  ...CLUBS,
];
const getTeamsMap = (): Record<string, GeneralTeamData> => {
  return RAWTEAMS.reduce(
    (acc, rawTeam) => {
      const team = createBaseTeam(rawTeam);
      acc[team.id] = team;
      return acc;
    },
    {} as Record<string, GeneralTeamData>,
  );
};

const TEAMS = getTeamsMap();
export default TEAMS;
