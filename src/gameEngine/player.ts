import getPositionsData from "./generators/positions";
import { getRandom } from "../utils";
import { Position, PlayerSkills, Skill, Player } from "../types/player";
import { Team } from "../types/team";
import NATIONALITIES_DATA from "../data/nationalities";
import { Nationality } from "../data/nationalities";
import { Modality } from "../types/team";
import { PlayerGenerationError } from "../errors";

export interface GeneratePlayerProps {
  position: Position;
  team: Team;
  modality: Modality;
}

export interface GenerateSkillsProps {
  position: Position;
  baseOverall: number;
}

export interface GetSkillValueProps {
  skills: PlayerSkills;
  skill: Skill;
}

export interface GetOverallExponentProps {
  overall: number;
}

export interface CalculateOverallProps {
  position: Position;
  skills: PlayerSkills;
}

export interface CalculateMarketValueProps {
  overall: number;
  age: number;
}

export interface GetForeignNationalitiesProps {
  currentNationality: Nationality;
}

export interface GetPlayerTeamProps {
  player: Player;
  teamsMap: Record<string, Team>;
}

export interface PlayerActionProps {
  player: Player;
}

const POSITION_SKILLS_MAP: Record<
  string,
  (baseFn: () => number) => Partial<PlayerSkills>
> = {
  GK: (base) => ({ reflexes: base() }),
  ZA: (base) => ({ defense: base() }),
  VOL: (base) => ({ defense: base() }),
  PE: (base) => ({ dribbling: base() }),
  PD: (base) => ({ dribbling: base() }),
  MA: (base) => ({ dribbling: base() }),
  CA: (base) => ({ dribbling: base() }),
  LE: (base) => ({ dribbling: base(), defense: base() }),
  LD: (base) => ({ dribbling: base(), defense: base() }),
  ME: (base) => ({ dribbling: base(), defense: base() }),
  MC: (base) => ({ dribbling: base(), defense: base() }),
  MD: (base) => ({ dribbling: base(), defense: base() }),
};

const getSkillValue = ({ skills, skill }: GetSkillValueProps): number =>
  (skills as any)[skill] ?? 0;

const getOverallExponent = ({ overall }: GetOverallExponentProps): number => {
  if (overall >= 100) return 2.4;
  if (overall >= 90) return 2.2;
  return 2.1;
};

export const calculateOverall = ({
  position,
  skills,
}: CalculateOverallProps): number => {
  const positionData = getPositionsData("masculine")[position];
  if (!positionData || !positionData.skillsWeight) {
    throw PlayerGenerationError.invalidPosition(position);
  }

  const weights = positionData.skillsWeight;
  const skillsTotal = Object.entries(weights).reduce(
    (sum, [skill, weight]) =>
      sum + getSkillValue({ skills, skill: skill as Skill }) * weight,
    0,
  );
  return Math.round(skillsTotal);
};

export const calculateMarketValue = ({
  overall,
  age,
}: CalculateMarketValueProps): number => {
  const exponent = getOverallExponent({ overall });
  const baseOverallDiff = Math.max(1, overall - 50);
  const base = Math.pow(baseOverallDiff, exponent) * 8000;
  const ageMap = [
    { p: (a: number) => a < 21, m: 0.75 },
    { p: (a: number) => a < 26, m: 1.25 },
    { p: (a: number) => a > 33, m: 0.5 },
    { p: (a: number) => a > 30, m: 0.75 },
  ];

  const multiplier = ageMap.find(({ p }) => p(age))?.m ?? 1;
  if (overall < 50) return Math.floor(10000 * multiplier);
  return Math.floor(base * multiplier);
};

export const generateSkills = ({
  position,
  baseOverall,
}: GenerateSkillsProps): PlayerSkills => {
  const variance = () => Math.floor((Math.random() - 0.5) * 20);
  const base = () => Math.min(100, Math.max(10, baseOverall + variance()));
  const baseSkills = {
    shooting: base(),
    vision: base(),
    physical: base(),
  };

  const extraSkillsFn = POSITION_SKILLS_MAP[position];
  if (!extraSkillsFn) {
    throw PlayerGenerationError.invalidPosition(position);
  }

  const extraSkills = extraSkillsFn(base);
  return { ...baseSkills, ...extraSkills } as PlayerSkills;
};

const getForeignNationalities = ({
  currentNationality,
}: GetForeignNationalitiesProps): Nationality[] => {
  return (Object.keys(NATIONALITIES_DATA) as Nationality[]).filter(
    (nationality) => nationality !== currentNationality,
  );
};

export const getPlayerTeam = ({
  player,
  teamsMap,
}: GetPlayerTeamProps): Team | null => {
  if (!player.currentTeamId) return null;
  return teamsMap[player.currentTeamId] ?? null;
};

export const refreshPlayerStats = ({ player }: PlayerActionProps): Player => {
  const overall = calculateOverall({
    position: player.position,
    skills: player.currentSkills,
  });
  const value = calculateMarketValue({ overall, age: player.age });
  return { ...player, overall, value };
};

export const advanceYear = ({ player }: PlayerActionProps): Player => {
  const newAge = player.age + 1;
  let newPhysical = player.currentSkills.physical;

  if (newAge >= 31) {
    newPhysical = Math.max(10, newPhysical - 2);
  }

  const updatedPlayer = {
    ...player,
    age: newAge,
    currentSkills: { ...player.currentSkills, physical: newPhysical },
  };

  return refreshPlayerStats({ player: updatedPlayer });
};

export const advanceDay = ({ player }: PlayerActionProps): Player => {
  const newStamina = Math.min(player.stamina + player.currentSkills.physical / 5, 100)
  return {
    ...player,
    stamina: newStamina
  }
}

export const advanceMonth = ({ player }: PlayerActionProps): Player => {
  let newPhysical = player.currentSkills.physical;
  if (player.age < 24 && Math.random() > 0.7) {
    newPhysical = Math.min(100, newPhysical + 1);
  }
  const updatedPlayer = {
    ...player,
    currentSkills: { ...player.currentSkills, physical: newPhysical },
  };
  return refreshPlayerStats({ player: updatedPlayer });
};

export const generatePlayer = async ({
  position,
  team,
  modality,
}: GeneratePlayerProps): Promise<Player> => {
  const foreignNationalities = getForeignNationalities({
    currentNationality: team.nationality,
  });
  const nationality: Nationality =
    team.type === "club" && Math.random() < 0.25
      ? getRandom({ array: foreignNationalities })
      : team.nationality;
  const nationalityData = NATIONALITIES_DATA[nationality];
  if (!nationalityData || !nationalityData.language) {
    throw PlayerGenerationError.invalidNationality(nationality);
  }
  const language = nationalityData.language;
  let namesModule;
  try {
    namesModule = await import(`../data/names/${language}`);
  } catch (error) {
    throw PlayerGenerationError.missingNameData(
      `File 'names/${language}' doesn't exist.`,
    );
  }

  const names = namesModule.default;
  const firstNames = names[modality];
  const lastnames = names.lastnames;
  if (!firstNames || firstNames.length === 0) {
    throw PlayerGenerationError.missingNameData(
      `${language} doesn't have a ${modality} names array.`,
    );
  }
  if (!lastnames || lastnames.length === 0) {
    throw PlayerGenerationError.missingNameData(
      `${language} doesn't have a lastnames array.`,
    );
  }

  const name = `${getRandom({ array: firstNames })} ${getRandom({ array: lastnames })}`;
  const age = 17 + Math.floor(Math.random() * 18);
  const currentSkills = generateSkills({
    position,
    baseOverall: team.overall,
  });
  const overall = calculateOverall({ position, skills: currentSkills });

  return {
    id: crypto.randomUUID(),
    name,
    currentTeamId: team.id,
    position,
    age,
    overall,
    stamina: 100,
    nationality,
    currentSkills,
    potentialSkills: currentSkills,
    history: {},
    value: calculateMarketValue({ overall, age }),
    trophies: {},
  };
};
