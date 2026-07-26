import { IntensityMessages } from "../types/match";
const openPlayMessages: Record<string, IntensityMessages> = {
  goal: {
    low: [
      "{shooter} empurra a bola para dentro do gol.",
      "{shooter} faz um gol mais feio do que bater em mãe.",
      "{shooter} marca por causa de frango do {goalkeeper}",
    ],
    medium: [
      "{shooter} acerta um gol no canto esquerdo do {goalkeeper}!",
      "{shooter} finaliza colocado e faz o gol!",
      "Boa jogada e {shooter} balança as redes!",
    ],
    high: [
      "{shooter}! {shooter}! QUE GOLAÇO!",
      "{shooter} de bicicleta, minha nossa! GOOOOOOOOOOOOOOL!",
      "QUE GOLAAAAAAÇO DE {shooter}!",
    ],
  },
  shot_defended_caught: {
    low: [
      "Chute fraco de {shooter}. {goalkeeper} encaixa a bola sem dificuldade.",
    ],
    medium: [
      "{shooter} bate pro gol, mas {goalkeeper} segura firme no centro.",
      "Boa tentativa de {shooter}, mas {goalkeeper} faz a defesa sem dar rebote.",
    ],
    high: [
      "Bomba de {shooter} e {goalkeeper} demonstra extrema segurança ao encaixar!",
    ],
  },
  shot_defended_corner: {
    low: ["{shooter} chuta cruzado e {goalkeeper} manda para escanteio."],
    medium: [
      "{goalkeeper} espalma chute de {shooter} para a linha de fundo.",
      "Defesa de {goalkeeper} após chute de {shooter}. É escanteio!",
    ],
    high: [
      "DEFESAÇA! {goalkeeper} salva chute de {shooter} com a ponta dos dedos! Escanteio!",
      "{shooter} obriga {goalkeeper} a voar na bola! Escanteio!",
    ],
  },
  shot_missed: {
    low: [
      "{shooter} pega mal na bola e manda longe.",
      "{shooter} isola a finalização.",
    ],
    medium: [
      "{shooter} tenta o chute, mas a bola vai para fora.",
      "Finalização perigosa de {shooter}, passou raspando a trave!",
    ],
    high: ["INACREDITÁVEL! {shooter} perde um gol de frente pro {goalkeeper}!"],
  },
};

const cornerMessages: Record<string, IntensityMessages> = {
  corner_goal: {
    low: ["{assistant} na cobrança... {shooter} cabeceia a bola pro gol!"],
    medium: [
      "{assistant} na cobrança... {shooter}, de cabeça!",
      "{assistant} na cobrança... {shooter} enterra a bola no fundo da rede! Golaço!",
    ],
    high: [
      "{assistant} na cobrança... {shooter} de voleio! Que puta chute!",
      "{assistant} na cobrança... {shooter} de bicicleta, minha nossa! GOOOOOOOOOOOOOOOOOL!",
    ],
  },
  corner_defended: {
    low: [
      "{assistant} na cobrança... Cabeceio fraco de {shooter}. {goalkeeper} segura.",
    ],
    medium: [
      "{assistant} na cobrança... A bola vai na cabeça de {shooter}, mas {goalkeeper} defende!",
      "{assistant} na cobrança... {shooter} cabeceia, mas {goalkeeper} salva!",
    ],
    high: [
      "{assistant} na cobrança... QUE DEFESA! {shooter} cabeceia mas {goalkeeper} encaixa!",
    ],
  },
  corner_missed: {
    low: [
      "{assistant} faz uma cobrança horrorosa e manda nas mãos do {goalkeeper}.",
    ],
    medium: [
      "{assistant} na cobrança... {shooter} erra o cabeceio e manda pra fora!",
    ],
    high: [
      "{assistant} na cobrança... {shooter} desperdiça e cabeceia pra fora!",
    ],
  },
};
const matchEventsMessages: Record<string, IntensityMessages | string[]> = {
  yellow_card: {
    low: [
      "Juíz ladrão! {shooter} recebe amarelo por nada.",
      "{shooter} protesta demais e leva o amarelo.",
    ],
    medium: ["O juiz não gosta da atitude e dá amarelo para {shooter}."],
    high: ["Que entrada violenta de {shooter}! Sorte que foi só amarelo."],
  },
  red_card: {
    low: ["{shooter} está fora da partida.", "Vermelho direto para {shooter}."],
    medium: [
      "{shooter} xinga o juíz e é expulso!",
      "{shooter} faz entrada dura e toma vermelho!",
    ],
    high: [
      "{shooter} perdeu a cabeça completamente. Expulso!",
      "Que absurdo de {shooter}! Quase quebrou a perna do adversário!",
    ],
  },
  substitution: [
    "Substituição: {shooter} entra em campo.",
    "O treinador mexe no time: {shooter} entra no jogo!",
    "{shooter} é a aposta para mudar a partida.",
  ],
};

const eventMessages: Record<string, IntensityMessages | string[]> = {
  ...openPlayMessages,
  ...cornerMessages,
  ...matchEventsMessages,
};
export default eventMessages;
