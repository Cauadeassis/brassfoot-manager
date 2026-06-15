interface Competitions {
  main?: string;
  brasileirao?: string;
  championsLeague?: string;
  nationsLeague?: string;
  worldClubs?: string;
  libertadores?: string;
  worldCup?: string;
  americanCup?: string;
  europeanCup?: string;
}
export const COMPETITION_TEMPLATES = {
  club: {
    southAmerica: {
      brasileirao: "Prontos para jogar o futebol mais pragmático do país...",
      worldClubs:
        "A soberba está pronta para esperar o Real Madrid no aeroporto...",
    },
    europe: {
      championsLeague:
        "A obsessão anual pelo topo da Europa custe o que custar...",
      worldClubs:
        "Jogam o torneio com a má vontade de quem preferia estar de férias...",
      nationsLeague:
        "Dominação total contra os times pequenos da liga local...",
    },
  },
  national: {
    southAmerica: {
      worldCup:
        "Lidere essa seleção sul-americana em direção ao maior título da história do futebol!",
      americanCup: "Obrigação de vencer para não virar crise nacional...",
    },
    europe: {
      worldCup: "Esquema tático engessado e frieza europeia nos pênaltis...",
      nationsLeague:
        "Lidere essa seleção e prove que ela é a melhor da Europa!",
      europeanCup:
        "Onde o nível técnico é maior que a própria Copa do Mundo, segundo eles...",
    },
  },
};

export const TEAM_DESCRIPTIONS: Record<string, Competitions> = {
  flamengo: {
    libertadores:
      "O maior time do Brasil vem guloso e cheio de fome para demolir todos os clubes da América do Sul.",
    worldClubs:
      "O Flamengo não ganha um Mundial desde 1981. Pronto pra tirar o clube da seca?",
    brasileirao:
      "Octacampeão, já de saco cheio, o Flamengo vem para provar pela 9° vez quem é que manda no Brasil",
  },
  palmeiras: {
    worldClubs:
      "Então você quer trazer o mundial pro Palmeiras? Que samaritano!",
  },
  atleticoMineiro: {},
  fluminense: {},
  internacional: {},
  saoPaulo: {},
  gremio: {},
  botafogo: {
    libertadores:
      "Boa sorte liderando o Botafogo nessa jornada pela Libertadores da América!",
    worldClubs:
      "Depois da mijada histórica de 1x0 no PSG, você tem certeza que DESSA VEZ o Botafogo vence, né?",
    brasileirao:
      "Comande o Fogão na disputa, para ver quem realmente é o melhor clube do Brasil!",
  },
  corinthians: {},
  santos: {},
  cruzeiro: {},
  vasco: {
    libertadores:
      "O Vasco não é o melhor nem da cidade que ele joga, quem dirá de toda América do Sul! Que Deus te guie nessa jornada",
    worldClubs:
      "Comande o Gigante da Colina em direção à maior conquista que um clube pode ter.",
    brasileirao: "Boa sorte em tirar o Vasco da zona de rebaixamento.",
  },
  atleticoParanaense: {},
  fortaleza: {},
  bahia: {},
  bragantino: {},
  goias: {},
  cuiaba: {},
  coritiba: {},
  americaMg: {
    libertadores:
      "O Coelho entra sem nenhuma vaidade pronto para fazer o jogo mais chato da história da Libertadores apenas pelo dinheiro da participação",
    worldClubs:
      "O Coelho entra sem nenhuma vaidade pronto para fazer o jogo mais chato da história do Mundial de Clubes apenas pelo dinheiro da participação",
    brasileirao:
      "Você quer ganhar o Brasileirão com esse time? Que Jesus te oriente!",
  },
  chapecoense: {},
  vilaNova: {},
  sport: {},
  pontePreta: {},

  arsenal: {
    championsLeague:
      "Com um futebol vistoso e jovem, o Arsenal busca finalmente conquistar a Europa e colocar seu nome na história do torneio.",
    worldClubs:
      "Os Gunners levam sua elegância londrina para o palco mundial, determinados a provar que o futebol inglês é o melhor do planeta.",
  },
  barcelona: {
    championsLeague:
      "O Barcelona carrega o peso de sua filosofia 'Més que un club' em busca da glória europeia mais uma vez.",
    worldClubs:
      "Com o orgulho catalão em campo, o Barça entra no Mundial para reafirmar a superioridade do seu estilo de jogo.",
  },
  bayernDeMunique: {
    championsLeague:
      "O gigante da Baviera entra em cada edição da Champions como um dos favoritos naturais ao trono europeu.",
    worldClubs:
      "A mentalidade vencedora alemã é a arma do Bayern para atropelar qualquer adversário e conquistar o mundo.",
  },
  chelsea: {
    championsLeague:
      "Sempre uma pedra no sapato dos gigantes, o Chelsea sabe como ninguém o caminho para levantar a taça europeia.",
  },
  interDeMilao: {},
  juventus: {},
  liverpool: {},
  manchesterCity: {
    championsLeague:
      "Com um elenco estelar, o City busca consolidar sua hegemonia europeia e construir uma dinastia na Champions.",
    worldClubs:
      "O Manchester City chega ao Mundial com a confiança de quem domina o futebol moderno e quer provar ser o melhor do planeta.",
  },
  manchesterUnited: {},
  parisSaintGermain: {
    championsLeague: "Já com 2 títulos, lidere o PSG para mais um!",
    worldClubs:
      "Depois de ser humilhado pelo Botafogo no último Mundial, o PSG volta com sangue nos olhos!",
  },
  realMadrid: {
    championsLeague:
      "Com 15 títulos e uma fome insaciável, o Real Madrid vem para demolir todos os clubes da Europa pela 16ª vez!",
    worldClubs:
      "Pera aí, você quer jogar o Mundial de Clubes com o Real Madri? Quer jogar no modo fácil, é?",
  },
  argentina: {
    main: "Tricampeã mundial, conhecida pela sua garra inigualável e por revelar alguns dos maiores talentos da história.",
    worldCup:
      "Lidere a Argentina em direção aos quatro títulos de copa do mundo e faça ela ser bicampeã seguida!",
    americanCup: "A gente pode perder pra todo mundo, menos pro Brasil",
  },
  bolivia: {},
  brasil: {
    main: "A única pentacampeã mundial, sinônimo de futebol arte e a seleção mais vitoriosa do planeta.",
    worldCup: "Pronto pra trazer o hexa pra casa, guerreiro?",
    americanCup: "A gente pode perder pra todo mundo, menos pra Argentina",
  },
  chile: {},
  colombia: {},
  equador: {},
  paraguai: {},
  peru: {},
  uruguai: {},
  venezuela: {},

  england: {
    worldCup:
      "Quebre a seca de 1966 e traga o segundo título para os ingleses!",
    europeanCup:
      "Donos da liga mais rica do planeta, chegam com status de favoritos absolutos.",
  },
  france: {
    worldCup:
      "Bicampeã mundial, com um craque pra cada posição... você quer jogar no modo fácil, né?",
    europeanCup:
      "Com dois títulos, lidere os franceses para a conquista do terceiro!",
  },
  germany: {
    worldCup: "Tetracampeã mundial. Pronto pra trazer o penta pra Berlim?",
    europeanCup:
      "Jogando com um rigor tático impecável, a Mannschaft tenta resgatar a soberania continental impondo sua intensidade física e troca de passes milimétrica",
  },
  italy: {
    worldCup:
      "É tetracampeã, mas se você conseguir passar da fase de grupos, já vai ter quebrado metade das bets ao longo do mundo",
    europeanCup:
      "A camisa mais pesada taticamente da Europa. Montam um ferrolho defensivo irritante e jogam com a catimba necessária para erguer a taça sem dar show",
  },
  norway: {
    worldCup: "Temos um fã do Haaland aqui!",
  },
  portugal: {
    worldCup: "Pronto pra finalmente trazer a copa pros portugueses?",
    europeanCup:
      "Sempre perigosos e recheados de estrelas da Premier League, entram focados em provar que o coletivo deles é muito maior do que as individualidades",
  },
  spain: {
    worldCup:
      "Só possui um título de copa do mundo. Pronto pra trazer o segundo?",
  },
  sweden: {},
  switzerland: {},
  belgium: {
    worldCup:
      "Lidere a Bélgica sem geração belga, sem copas, sem favoritismo e sem craques. Boa sorte!",
  },
  netherlands: {},
};
