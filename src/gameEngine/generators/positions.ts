import { Position } from "../../types/player";
import { Modality } from "../../types/team";
import {
  CAData,
  GKData,
  LDData,
  LEData,
  MAData,
  MCData,
  MDData,
  MEData,
  PDData,
  PEData,
  PositionData,
  RawPositionData,
  VOLData,
  ZAData,
} from "../../data/positions";

export const CORNER_TAKERS: Position[] = ["MA", "PE", "PD"];
export const CORNER_HEADERS: Position[] = ["ZA", "CA", "VOL", "LD", "LE"];
export const ATTACKERS: Position[] = ["CA", "PE", "PD", "MA"];

const pluralExceptions: Partial<Record<Position, string>> = {
  LD: "Laterais Direitos",
  LE: "Laterais Esquerdos",
  MA: "Meias Armadores",
  MD: "Meias Direitos",
  MC: "Meias Centrais",
  ME: "Meias Esquerdos",
  PE: "Pontas Esquerdas",
  PD: "Pontas Direitas",
};

const pluralGenderExceptions: Position[] = ["MC", "PE", "PD"];
const genderExceptions: Position[] = ["VOL", "MC", "PE", "PD", "CA"];

function getFeminineSingular(position: Position, singular: string): string {
  if (genderExceptions.includes(position)) return singular;
  if (singular.endsWith("o")) return singular.slice(0, -1) + "a";
  return singular + "a";
}

function getFemininePlural(
  position: Position,
  feminineSingular: string,
): string {
  if (pluralGenderExceptions.includes(position))
    return pluralExceptions[position]!;
  return pluralExceptions[position]
    ? pluralExceptions[position].slice(0, -2) + "as"
    : `${feminineSingular}s`;
}
export function getPositionPlural(
  positionKey: Position,
  singularLabel: string,
): string {
  return pluralExceptions[positionKey]
    ? pluralExceptions[positionKey]
    : `${singularLabel}s`;
}

interface BuildPositionProps {
  key: Position;
  data: RawPositionData;
  modality: Modality;
}
function buildPosition({
  key,
  data,
  modality,
}: BuildPositionProps): PositionData {
  if (!data || !data.label) {
    throw new Error(
      `Dados de posição inválidos ou ausentes para a chave: ${key}`,
    );
  }
  const isFeminine = modality === "feminine";
  const singular = isFeminine
    ? getFeminineSingular(key, data.label)
    : data.label;
  const plural = isFeminine
    ? getFemininePlural(key, singular)
    : getPositionPlural(key, data.label);
  return {
    ...data,
    label: { singular, plural },
  };
}
export default function getPositionsData(
  modality: Modality,
): Record<Position, PositionData> {
  return {
    GK: buildPosition({ key: "GK", data: GKData, modality }),
    ZA: buildPosition({ key: "ZA", data: ZAData, modality }),
    LD: buildPosition({ key: "LD", data: LDData, modality }),
    LE: buildPosition({ key: "LE", data: LEData, modality }),
    VOL: buildPosition({ key: "VOL", data: VOLData, modality }),
    MA: buildPosition({ key: "MA", data: MAData, modality }),
    MD: buildPosition({ key: "MD", data: MDData, modality }),
    MC: buildPosition({ key: "MC", data: MCData, modality }),
    ME: buildPosition({ key: "ME", data: MEData, modality }),
    PE: buildPosition({ key: "PE", data: PEData, modality }),
    PD: buildPosition({ key: "PD", data: PDData, modality }),
    CA: buildPosition({ key: "CA", data: CAData, modality }),
  };
}

export const POSITIONS = Object.keys(
  getPositionsData("masculine"),
) as Position[];
