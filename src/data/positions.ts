import { Position, Skill } from "../types/player";
export type PositionColor =
  | "yellow-color"
  | "blue-color"
  | "pink-color"
  | "green-color";
export interface LabelData {
  singular: string;
  plural: string;
}
export interface PositionData {
  color: PositionColor;
  label: LabelData;
  canBePlayedBy?: Position[];
  max: number;
  skillsWeight: Partial<Record<Skill, number>>;
}
export type RawPositionData = Omit<PositionData, "label"> & { label: string };
export type Template = Omit<PositionData, "label">;
const BASE_TEMPLATES: Record<string, Template> = {
  lateral: {
    color: "blue-color",
    max: 2,
    skillsWeight: {
      defense: 0.2,
      dribbling: 0.2,
      vision: 0.15,
      shooting: 0.15,
      physical: 0.3,
    },
  },
  meia_lateral: {
    color: "pink-color",

    max: 2,
    skillsWeight: {
      defense: 0.2,
      dribbling: 0.25,
      vision: 0.15,
      shooting: 0.1,
      physical: 0.3,
    },
  },
  ponta: {
    color: "green-color",

    max: 2,
    skillsWeight: {
      dribbling: 0.4,
      shooting: 0.15,
      vision: 0.15,
      physical: 0.3,
    },
  },
} as const;

export const GKData: RawPositionData = {
  color: "yellow-color",
  label: "Goleiro",
  max: 3,
  skillsWeight: {
    reflexes: 0.45,
    vision: 0.15,
    shooting: 0.1,
    physical: 0.3,
  },
};

export const ZAData: RawPositionData = {
  color: "blue-color",
  label: "Zagueiro",
  max: 3,
  canBePlayedBy: ["VOL"],
  skillsWeight: { defense: 0.4, vision: 0.15, shooting: 0.15, physical: 0.3 },
};

export const LDData: RawPositionData = {
  ...BASE_TEMPLATES.lateral,
  label: "Lateral Direito",
  canBePlayedBy: ["ZA", "MD", "LE"],
};

export const LEData: RawPositionData = {
  ...BASE_TEMPLATES.lateral,
  label: "Lateral Esquerdo",
  canBePlayedBy: ["ZA", "ME", "LD"],
};

export const VOLData: RawPositionData = {
  color: "pink-color",
  label: "Volante",
  max: 2,
  canBePlayedBy: ["MC", "ZA"],
  skillsWeight: { defense: 0.25, vision: 0.25, shooting: 0.2, physical: 0.3 },
};

export const MAData: RawPositionData = {
  color: "pink-color",
  label: "Meia Armador",
  max: 2,
  canBePlayedBy: ["PE", "PD", "MC"],
  skillsWeight: {
    vision: 0.3,
    dribbling: 0.25,
    shooting: 0.15,
    physical: 0.3,
  },
};

export const MDData: RawPositionData = {
  ...BASE_TEMPLATES.meia_lateral,
  label: "Meia Direito",
  canBePlayedBy: ["LD", "PD"],
};

export const MCData: RawPositionData = {
  color: "pink-color",
  label: "Meia Central",
  max: 2,
  canBePlayedBy: ["VOL", "MA"],
  skillsWeight: {
    defense: 0.1,
    dribbling: 0.1,
    vision: 0.3,
    shooting: 0.3,
    physical: 0.2,
  },
};

export const MEData: RawPositionData = {
  ...BASE_TEMPLATES.meia_lateral,
  label: "Meia Esquerdo",
  canBePlayedBy: ["LE", "PE"],
};

export const PEData: RawPositionData = {
  ...BASE_TEMPLATES.ponta,
  label: "Ponta Esquerda",
  canBePlayedBy: ["CA", "MA", "PD"],
};

export const PDData: RawPositionData = {
  ...BASE_TEMPLATES.ponta,
  label: "Ponta Direita",
  canBePlayedBy: ["CA", "MA", "PE"],
};

export const CAData: RawPositionData = {
  color: "green-color",
  label: "Centroavante",
  max: 2,
  canBePlayedBy: ["PE", "PD", "MA"],
  skillsWeight: {
    shooting: 0.4,
    dribbling: 0.15,
    vision: 0.15,
    physical: 0.3,
  },
};
