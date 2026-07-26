import { Region } from "../types/competition";
import { TeamType } from "../types/team";
import { Nationality } from "./nationalities";

type RegionTemplate = {
  default: string;
} & Partial<Record<Nationality, string>>;
type TeamTypeTemplate = {
  default: string;
} & Partial<Record<Region, RegionTemplate>>;
type TemplateStructure = Record<TeamType, TeamTypeTemplate>;
const TEMPLATES: TemplateStructure = {
  club: {
    default: "Seja dono desse clube!",
    southAmerican: {
      default: "Seja dono desse poderoso clube sul-americano!",
      BR: "Lidere esse clube brasileiro em direção à Libertadores e ao Mundial!",
    },
    european: {
      default: "Seja dono desse poderoso clube europeu!",
      ES: "Vença LaLiga, Champions League e tudo o que puder imaginar",
      GB: "Vença Premier League, Champions League e tudo o que puder imaginar!",
    },
  },
  national: {
    default: "Lidere essa seleção em direção à glória!",
    southAmerican: {
      default: "Prove que o futebol sul-americano é o melhor do mundo!",
    },
    european: {
      default:
        "Ganhe Nations League, Eurocopa e Copa do Mundo com essa seleção!",
    },
  },
};
export default TEMPLATES;
