import type { Position, FormationType } from "../types";
type FormationLine = [number, ...Position[]];

interface FormationDetails {
  lines: FormationLine[];
  positions: Position[];
}

type FormationsData = Record<FormationType, FormationDetails>;

const FORMATIONS: FormationsData = {
  "4-3-3": {
    lines: [
      [1, "GK"],
      [4, "ZA", "ZA", "LD", "LE"],
      [3, "VOL", "MC", "MC"],
      [3, "PE", "CA", "PD"],
    ],
    positions: [
      "GK",
      "ZA",
      "ZA",
      "LD",
      "LE",
      "VOL",
      "MC",
      "MC",
      "PE",
      "CA",
      "PD",
    ] as Position[],
  },
  "4-4-2": {
    lines: [
      [1, "GK"],
      [4, "ZA", "ZA", "LD", "LE"],
      [4, "MD", "VOL", "VOL", "ME"],
      [2, "CA", "CA"],
    ],
    positions: [
      "GK",
      "ZA",
      "ZA",
      "LD",
      "LE",
      "MD",
      "VOL",
      "VOL",
      "ME",
      "CA",
      "CA",
    ] as Position[],
  },
  "4-2-3-1": {
    lines: [
      [1, "GK"],
      [4, "ZA", "ZA", "LD", "LE"],
      [2, "VOL", "VOL"],
      [3, "MO", "MO", "MO"],
      [1, "CA"],
    ],
    positions: [
      "GK",
      "ZA",
      "ZA",
      "LD",
      "LE",
      "VOL",
      "VOL",
      "MO",
      "MO",
      "MO",
      "CA",
    ] as Position[],
  },
};
export default FORMATIONS;
