import type { Nationality } from "./nationalities";
import type { Uniform } from "../types/team";

export const BASE_TEAM_COLORS = {
  white: "#ffffff",
  black: "#18181b",
  red: "#dc2626",
  navyBlue: "#1e3a8a",
  skyBlue: "#38bdf8",
  yellow: "#facc15",
  green: "#16a34a",
  maroon: "#7f1d1d",
  purple: "#7e22ce",
  orange: "#ea580c",
} as const;

type BaseTeamColor = (typeof BASE_TEAM_COLORS)[keyof typeof BASE_TEAM_COLORS];

export const OPPOSITE_COLORS: Record<string, string> = {
  "#ffffff": "#18181b",
  "#18181b": "#ffffff",
  "#dc2626": "#16a34a",
  "#16a34a": "#dc2626",
  "#1e3a8a": "#ea580c",
  "#38bdf8": "#ea580c",
  "#facc15": "#7e22ce",
  "#7f1d1d": "#16a34a",
  "#7e22ce": "#facc15",
  "#ea580c": "#1e3a8a",
} satisfies Record<BaseTeamColor, string>;

const DEFAULT_UNIFORMS: Partial<Record<Nationality, Uniform>> = {
  AR: {
    design: "verticalLines",
    colors: {
      primary: BASE_TEAM_COLORS.skyBlue,
      secondary: BASE_TEAM_COLORS.white,
      number: BASE_TEAM_COLORS.black,
    },
  },
  BE: {
    design: "verticalLines",
    colors: {
      primary: BASE_TEAM_COLORS.black,
      secondary: BASE_TEAM_COLORS.yellow,
      number: BASE_TEAM_COLORS.red,
    },
  },
  BO: {
    design: "horizontalLines",
    colors: {
      primary: BASE_TEAM_COLORS.green,
      secondary: BASE_TEAM_COLORS.yellow,
      number: BASE_TEAM_COLORS.white,
    },
  },
  BR: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.yellow,
      number: BASE_TEAM_COLORS.green,
    },
  },
  CA: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.red,
      number: BASE_TEAM_COLORS.white,
    },
  },
  CH: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.red,
      number: BASE_TEAM_COLORS.white,
    },
  },
  CI: {
    design: "verticalLines",
    colors: {
      primary: BASE_TEAM_COLORS.orange,
      secondary: BASE_TEAM_COLORS.white,
      number: BASE_TEAM_COLORS.green,
    },
  },
  CL: {
    design: "horizontalLines",
    colors: {
      primary: BASE_TEAM_COLORS.white,
      secondary: BASE_TEAM_COLORS.red,
      number: BASE_TEAM_COLORS.navyBlue,
    },
  },
  CO: {
    design: "horizontalLines",
    colors: {
      primary: BASE_TEAM_COLORS.yellow,
      secondary: BASE_TEAM_COLORS.navyBlue,
      number: BASE_TEAM_COLORS.red,
    },
  },
  CV: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.navyBlue,
      number: BASE_TEAM_COLORS.white,
    },
  },
  DE: {
    design: "horizontalLines",
    colors: {
      primary: BASE_TEAM_COLORS.black,
      secondary: BASE_TEAM_COLORS.red,
      number: BASE_TEAM_COLORS.yellow,
    },
  },
  EC: {
    design: "horizontalLines",
    colors: {
      primary: BASE_TEAM_COLORS.yellow,
      secondary: BASE_TEAM_COLORS.navyBlue,
      number: BASE_TEAM_COLORS.red,
    },
  },
  ES: {
    design: "horizontalLines",
    colors: {
      primary: BASE_TEAM_COLORS.red,
      secondary: BASE_TEAM_COLORS.yellow,
      number: BASE_TEAM_COLORS.white,
    },
  },
  FR: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.navyBlue,
      number: BASE_TEAM_COLORS.white,
    },
  },
  GB: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.white,
      number: BASE_TEAM_COLORS.navyBlue,
    },
  },
  IT: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.navyBlue,
      number: BASE_TEAM_COLORS.white,
    },
  },
  JP: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.white,
      number: BASE_TEAM_COLORS.red,
    },
  },
  MA: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.maroon,
      number: BASE_TEAM_COLORS.white,
    },
  },
  MX: {
    design: "verticalLines",
    colors: {
      primary: BASE_TEAM_COLORS.green,
      secondary: BASE_TEAM_COLORS.white,
      number: BASE_TEAM_COLORS.red,
    },
  },
  NL: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.orange,
      number: BASE_TEAM_COLORS.white,
    },
  },
  NO: {
    design: "horizontalLines",
    colors: {
      primary: BASE_TEAM_COLORS.red,
      secondary: BASE_TEAM_COLORS.navyBlue,
      number: BASE_TEAM_COLORS.white,
    },
  },
  PE: {
    design: "verticalLines",
    colors: {
      primary: BASE_TEAM_COLORS.white,
      secondary: BASE_TEAM_COLORS.red,
      number: BASE_TEAM_COLORS.black,
    },
  },
  PT: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.red,
      number: BASE_TEAM_COLORS.white,
    },
  },
  PY: {
    design: "horizontalLines",
    colors: {
      primary: BASE_TEAM_COLORS.red,
      secondary: BASE_TEAM_COLORS.white,
      number: BASE_TEAM_COLORS.navyBlue,
    },
  },
  SE: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.yellow,
      number: BASE_TEAM_COLORS.navyBlue,
    },
  },
  SN: {
    design: "verticalLines",
    colors: {
      primary: BASE_TEAM_COLORS.green,
      secondary: BASE_TEAM_COLORS.yellow,
      number: BASE_TEAM_COLORS.white,
    },
  },
  US: {
    design: "horizontalLines",
    colors: {
      primary: BASE_TEAM_COLORS.navyBlue,
      secondary: BASE_TEAM_COLORS.red,
      number: BASE_TEAM_COLORS.white,
    },
  },
  UY: {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.skyBlue,
      number: BASE_TEAM_COLORS.white,
    },
  },
  VE: {
    design: "horizontalLines",
    colors: {
      primary: BASE_TEAM_COLORS.yellow,
      secondary: BASE_TEAM_COLORS.navyBlue,
      number: BASE_TEAM_COLORS.red,
    },
  },
};

export const getDefaultUniformDesign = (nationality: Nationality): Uniform =>
  DEFAULT_UNIFORMS[nationality] ?? {
    design: "monoColor",
    colors: {
      primary: BASE_TEAM_COLORS.navyBlue,
      number: BASE_TEAM_COLORS.white,
    },
  };
