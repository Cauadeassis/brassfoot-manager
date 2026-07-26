import { Region } from "../types/competition";
export type Nationality = keyof typeof NATIONALITIES_DATA;

export interface NationalityData {
  flag: string;
  region: Region;
  language: Language;
  demonym: {
    masculine: string;
    feminine: string;
  };
}

export type Language =
  | "portuguese"
  | "french"
  | "spanish"
  | "english"
  | "japanese"
  | "arabic"
  | "italian"
  | "dutch"
  | "german"
  | "nordic";

const NATIONALITIES_DATA: Record<string, NationalityData> = {
  BR: {
    flag: "/flags/southAmerica/Brazil.svg",
    region: "southAmerican",
    language: "portuguese",
    demonym: { feminine: "brasileira", masculine: "brasileiro" },
  },
  CV: {
    flag: "/flags/africa/CapeVerde.svg",
    region: "african",
    language: "portuguese",
    demonym: { feminine: "cabo-verdiana", masculine: "cabo-verdiano" },
  },
  SN: {
    flag: "/flags/africa/Senegal.svg",
    region: "african",
    language: "french",
    demonym: { feminine: "senegalesa", masculine: "senegalês" },
  },
  CI: {
    flag: "/flags/africa/IvoryCoast.svg",
    region: "african",
    language: "french",
    demonym: { feminine: "marfinense", masculine: "marfinense" },
  },
  MA: {
    flag: "/flags/africa/Morocco.svg",
    region: "african",
    language: "arabic",
    demonym: { feminine: "marroquina", masculine: "marroquino" },
  },
  JP: {
    flag: "/flags/asia/Japan.svg",
    region: "asian",
    language: "japanese",
    demonym: { feminine: "japonesa", masculine: "japonês" },
  },
  US: {
    flag: "/flags/northAmerica/UnitedStates.svg",
    region: "northAmerican",
    language: "english",
    demonym: { feminine: "estadunidense", masculine: "estadunidense" },
  },
  MX: {
    flag: "/flags/northAmerica/Mexico.svg",
    region: "northAmerican",
    language: "spanish",
    demonym: { feminine: "mexicana", masculine: "mexicano" },
  },
  CA: {
    flag: "/flags/northAmerica/Canada.svg",
    region: "northAmerican",
    language: "english",
    demonym: { feminine: "canadense", masculine: "canadense" },
  },
  AR: {
    flag: "/flags/southAmerica/Argentina.svg",
    region: "southAmerican",
    language: "spanish",
    demonym: { feminine: "argentina", masculine: "argentino" },
  },
  CO: {
    flag: "/flags/southAmerica/Colombia.svg",
    region: "southAmerican",
    language: "spanish",
    demonym: { feminine: "colombiana", masculine: "colombiano" },
  },
  UY: {
    flag: "/flags/southAmerica/Uruguai.svg",
    region: "southAmerican",
    language: "spanish",
    demonym: { feminine: "uruguaia", masculine: "uruguaio" },
  },
  EC: {
    flag: "/flags/southAmerica/Equador.svg",
    region: "southAmerican",
    language: "spanish",
    demonym: { feminine: "equatoriana", masculine: "equatoriano" },
  },
  PY: {
    flag: "/flags/southAmerica/Paraguai.svg",
    region: "southAmerican",
    language: "spanish",
    demonym: { feminine: "paraguaia", masculine: "paraguaio" },
  },
  CL: {
    flag: "/flags/southAmerica/Chile.svg",
    region: "southAmerican",
    language: "spanish",
    demonym: { feminine: "chilena", masculine: "chileno" },
  },
  BO: {
    flag: "/flags/southAmerica/Bolivia.svg",
    region: "southAmerican",
    language: "spanish",
    demonym: { feminine: "boliviana", masculine: "boliviano" },
  },
  VE: {
    flag: "/flags/southAmerica/Venezuela.svg",
    region: "southAmerican",
    language: "spanish",
    demonym: { feminine: "venezuelana", masculine: "venezuelano" },
  },
  PE: {
    flag: "/flags/southAmerica/Peru.svg",
    region: "southAmerican",
    language: "spanish",
    demonym: { feminine: "peruana", masculine: "peruano" },
  },
  PT: {
    flag: "/flags/europe/Portugal.svg",
    region: "european",
    language: "portuguese",
    demonym: { feminine: "portuguesa", masculine: "português" },
  },
  ES: {
    flag: "/flags/europe/Spain.svg",
    region: "european",
    language: "spanish",
    demonym: { feminine: "espanhola", masculine: "espanhol" },
  },
  GB: {
    flag: "/flags/europe/England.svg",
    region: "european",
    language: "english",
    demonym: { feminine: "inglesa", masculine: "inglês" },
  },
  FR: {
    flag: "/flags/europe/France.svg",
    region: "european",
    language: "french",
    demonym: { feminine: "francesa", masculine: "francês" },
  },
  BE: {
    flag: "/flags/europe/Belgium.svg",
    region: "european",
    language: "french",
    demonym: { feminine: "belga", masculine: "belga" },
  },
  IT: {
    flag: "/flags/europe/Italy.svg",
    region: "european",
    language: "italian",
    demonym: { feminine: "italiana", masculine: "italiano" },
  },
  DE: {
    flag: "/flags/europe/Germany.svg",
    region: "european",
    language: "german",
    demonym: { feminine: "alemã", masculine: "alemão" },
  },
  NL: {
    flag: "/flags/europe/Netherlands.svg",
    region: "european",
    language: "dutch",
    demonym: { feminine: "holandesa", masculine: "holandês" },
  },
  NO: {
    flag: "/flags/europe/Norway.svg",
    region: "european",
    language: "nordic",
    demonym: { feminine: "norueguesa", masculine: "norueguês" },
  },
  CH: {
    flag: "/flags/europe/Switzerland.svg",
    region: "european",
    language: "french",
    demonym: { feminine: "suíça", masculine: "suíço" },
  },
  SE: {
    flag: "/flags/europe/Sweden.svg",
    region: "european",
    language: "nordic",
    demonym: { feminine: "sueca", masculine: "sueco" },
  },
};

export default NATIONALITIES_DATA;
