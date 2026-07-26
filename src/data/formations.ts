import { Position } from "../types/player";
import { PlayStyle } from "../types/team";
export type FormationType = "4-3-3" | "4-4-2" | "4-2-3-1";
export interface PlayerSlot {
  x: number;
  y: number;
  role: Position;
}

export interface Slots {
  balanced: PlayerSlot[];
  offensive: PlayerSlot[];
  defensive: PlayerSlot[];
}
interface FormationDetails {
  slots: Slots;
}

type FormationsData = Record<FormationType, FormationDetails>;
const GK = [{ x: 50, y: 88, role: "GK" }] as PlayerSlot[];
const baseDefenders = [
  ...GK,
  { x: 35, y: 75, role: "ZA" },
  { x: 65, y: 75, role: "ZA" },
] as PlayerSlot[];
const baseAttack = [
  { x: 20, y: 25, role: "PE" },
  { x: 50, y: 22.5, role: "CA" },
  { x: 80, y: 25, role: "PD" },
] as PlayerSlot[];
const baseMidfield = [
  { x: 30, y: 47.5, role: "ME" },
  { x: 50, y: 60, role: "VOL" },
  { x: 70, y: 47.5, role: "MD" },
] as PlayerSlot[];
const balancedDefenders = [
  ...baseDefenders,
  { x: 15, y: 67.5, role: "LE" },
  { x: 85, y: 67.5, role: "LD" },
] as PlayerSlot[];

const defensiveDefenders = [
  ...GK,
  { x: 40, y: 80, role: "ZA" },
  { x: 60, y: 80, role: "ZA" },
  { x: 22.5, y: 78, role: "LE" },
  { x: 78.5, y: 78, role: "LD" },
] as PlayerSlot[];

const offensiveDefenders = [
  ...baseDefenders,
  { x: 12, y: 58, role: "LE" },
  { x: 88, y: 58, role: "LD" },
] as PlayerSlot[];

const FORMATIONS_DATA: FormationsData = {
  "4-3-3": {
    slots: {
      balanced: [...balancedDefenders, ...baseMidfield, ...baseAttack],
      offensive: [...balancedDefenders, ...baseMidfield, ...baseAttack],
      defensive: [
        ...defensiveDefenders,
        { x: 50, y: 52, role: "MC" },
        { x: 37.5, y: 58, role: "VOL" },
        { x: 62.5, y: 58, role: "VOL" },
        ...baseAttack,
      ],
    },
  },

  "4-4-2": {
    slots: {
      balanced: [
        ...balancedDefenders,
        { x: 15, y: 40, role: "ME" },
        { x: 40, y: 52, role: "VOL" },
        { x: 60, y: 52, role: "VOL" },
        { x: 85, y: 40, role: "MD" },
        { x: 40, y: 25, role: "CA" },
        { x: 60, y: 25, role: "CA" },
      ],
      offensive: [
        ...balancedDefenders,
        { x: 35, y: 52, role: "ME" },
        { x: 50, y: 62.5, role: "VOL" },
        { x: 50, y: 41, role: "MA" },
        { x: 65, y: 52, role: "MD" },
        { x: 38, y: 22.5, role: "CA" },
        { x: 62, y: 22.5, role: "CA" },
      ],
      defensive: [
        ...defensiveDefenders,
        { x: 18, y: 57.5, role: "ME" },
        { x: 38, y: 57.5, role: "VOL" },
        { x: 62, y: 57.5, role: "VOL" },
        { x: 82, y: 57.5, role: "MD" },
        { x: 38, y: 25, role: "CA" },
        { x: 62, y: 25, role: "CA" },
      ],
    },
  },

  "4-2-3-1": {
    slots: {
      balanced: [
        ...balancedDefenders,
        { x: 40, y: 57.5, role: "VOL" },
        { x: 60, y: 57.5, role: "VOL" },
        { x: 25, y: 40, role: "ME" },
        { x: 50, y: 40, role: "MA" },
        { x: 75, y: 40, role: "MD" },
        { x: 50, y: 25, role: "CA" },
      ],
      offensive: [
        ...offensiveDefenders,
        { x: 38, y: 55, role: "VOL" },
        { x: 62, y: 55, role: "VOL" },
        { x: 20, y: 38, role: "ME" },
        { x: 50, y: 36, role: "MA" },
        { x: 80, y: 38, role: "MD" },
        { x: 50, y: 20, role: "CA" },
      ],
      defensive: [
        ...defensiveDefenders,
        { x: 42.5, y: 64, role: "VOL" },
        { x: 57.5, y: 64, role: "VOL" },
        { x: 24, y: 54, role: "ME" },
        { x: 50, y: 52, role: "MA" },
        { x: 76, y: 54, role: "MD" },
        { x: 50, y: 38, role: "CA" },
      ],
    },
  },
};
export default FORMATIONS_DATA;

interface GetPositionsByFormationProps {
  formation: FormationType;
  playStyle: PlayStyle;
}

export function getPositionsByFormation({
  formation,
  playStyle,
}: GetPositionsByFormationProps): Position[] {
  const formationConfig = FORMATIONS_DATA[formation];
  return formationConfig.slots[playStyle].map((slot) => slot.role);
}
