import type { Position, PositionSkillGroup, Skill } from "../types";

export type PositionColor =
  | "yellow-color"
  | "blue-color"
  | "pink-color"
  | "green-color";
export type PositionLabel =
  | "Goleiro"
  | "Zagueiro"
  | "Lateral Direito"
  | "Lateral Esquerdo"
  | "Volante"
  | "Meia"
  | "Meia Ofensivo"
  | "Meia Direito"
  | "Meia Esquerdo"
  | "Ponta Esquerda"
  | "Ponta Direita"
  | "Atacante";

interface PositionData {
  color: PositionColor;
  label: PositionLabel;
  compatible: Position[];
  max: number;
  skillGroup: PositionSkillGroup;
  skillsWeight: Partial<Record<Skill, number>>;
}
export const CORNER_TAKERS: Position[] = ["MO", "MC", "PE", "PD"];
export const CORNER_HEADERS: Position[] = ["ZA", "CA", "VOL", "LD", "LE"];
export const ATTACKERS: Position[] = ["CA", "PE", "PD", "MO"];

const POSITIONS_DATA: Record<Position, PositionData> = {
  GK: {
    color: "yellow-color",
    label: "Goleiro",
    compatible: ["GK"],
    max: 2,
    skillGroup: "goalkeeper",
    skillsWeight: {
      reflexes: 0.45,
      vision: 0.15,
      shooting: 0.1,
      physical: 0.3,
    },
  },
  ZA: {
    color: "blue-color",
    label: "Zagueiro",
    compatible: ["ZA"],
    max: 4,
    skillGroup: "defender",
    skillsWeight: { defense: 0.4, vision: 0.15, shooting: 0.15, physical: 0.3 },
  },
  LD: {
    color: "blue-color",
    label: "Lateral Direito",
    compatible: ["LD", "ZA"],
    max: 2,
    skillGroup: "mixed",
    skillsWeight: {
      defense: 0.2,
      dribbling: 0.2,
      vision: 0.15,
      shooting: 0.15,
      physical: 0.3,
    },
  },
  LE: {
    color: "blue-color",
    label: "Lateral Esquerdo",
    compatible: ["LE", "ZA"],
    max: 2,
    skillGroup: "mixed",
    skillsWeight: {
      defense: 0.2,
      dribbling: 0.2,
      vision: 0.15,
      shooting: 0.15,
      physical: 0.3,
    },
  },
  VOL: {
    color: "pink-color",
    label: "Volante",
    compatible: ["VOL", "MC"],
    max: 2,
    skillGroup: "defender",
    skillsWeight: { defense: 0.25, vision: 0.25, shooting: 0.2, physical: 0.3 },
  },
  MC: {
    color: "pink-color",
    label: "Meia",
    compatible: ["MC", "VOL", "MO"],
    max: 3,
    skillGroup: "attacker",
    skillsWeight: {
      vision: 0.4,
      dribbling: 0.15,
      shooting: 0.15,
      physical: 0.3,
    },
  },
  MO: {
    color: "pink-color",
    label: "Meia Ofensivo",
    compatible: ["MO", "MC", "PE", "PD"],
    max: 2,
    skillGroup: "attacker",
    skillsWeight: {
      vision: 0.3,
      dribbling: 0.25,
      shooting: 0.15,
      physical: 0.3,
    },
  },
  MD: {
    color: "pink-color",
    label: "Meia Direito",
    compatible: ["MD", "LD", "MC"],
    max: 2,
    skillGroup: "mixed",
    skillsWeight: {
      defense: 0.2,
      dribbling: 0.25,
      vision: 0.15,
      shooting: 0.1,
      physical: 0.3,
    },
  },
  ME: {
    color: "pink-color",
    label: "Meia Esquerdo",
    compatible: ["ME", "LE", "MC"],
    max: 2,
    skillGroup: "mixed",
    skillsWeight: {
      defense: 0.2,
      dribbling: 0.25,
      vision: 0.15,
      shooting: 0.1,
      physical: 0.3,
    },
  },
  PE: {
    color: "green-color",
    label: "Ponta Esquerda",
    compatible: ["PE", "CA", "MO"],
    max: 2,
    skillGroup: "attacker",
    skillsWeight: {
      dribbling: 0.4,
      shooting: 0.15,
      vision: 0.15,
      physical: 0.3,
    },
  },
  PD: {
    color: "green-color",
    label: "Ponta Direita",
    compatible: ["PD", "CA", "MO"],
    max: 2,
    skillGroup: "attacker",
    skillsWeight: {
      dribbling: 0.4,
      shooting: 0.15,
      vision: 0.15,
      physical: 0.3,
    },
  },
  CA: {
    color: "green-color",
    label: "Atacante",
    compatible: ["CA", "PE", "PD"],
    max: 2,
    skillGroup: "attacker",
    skillsWeight: {
      shooting: 0.4,
      dribbling: 0.15,
      vision: 0.15,
      physical: 0.3,
    },
  },
};

export default POSITIONS_DATA;

export const POSITIONS = Object.keys(POSITIONS_DATA) as Position[];

export const SQUAD_POSITIONS: Position[] = [
  "GK",
  "GK",
  "ZA",
  "ZA",
  "ZA",
  "LE",
  "LD",
  "VOL",
  "VOL",
  "MC",
  "MC",
  "MO",
  "PE",
  "PD",
  "CA",
  "CA",
  "ZA",
  "LE",
  "MC",
  "CA",
  "VOL",
  "PE",
];
