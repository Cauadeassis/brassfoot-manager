import POSITIONS_DATA from "../data/positions";
import { getRandom } from "../utils";
import type { Player, Team, Position, PlayerSkills, Skill } from "../types";
import NATIONALITIES_DATA from "../data/nationalities";
import type { Nationality } from "../data/nationalities";

const ageMultiplierMap = [
  { predicate: (age: number) => age < 21, multiplier: 0.75 },
  { predicate: (age: number) => age < 26, multiplier: 1.25 },
  { predicate: (age: number) => age > 33, multiplier: 0.5 },
  { predicate: (age: number) => age > 30, multiplier: 0.75 },
];

export interface calculatePlayerValueProps {
  overall: number;
  age: number;
}

function getOverallExponent(overall: number): number {
  if (overall >= 100) return 2.4;
  if (overall >= 90) return 2.2;
  return 2.1;
}

export function calculatePlayerValue({
  overall,
  age,
}: calculatePlayerValueProps): number {
  const exponent = getOverallExponent(overall);
  const base = Math.pow(overall - 50, exponent) * 8000;
  const multiplier =
    ageMultiplierMap.find(({ predicate }) => predicate(age))?.multiplier ?? 1;
  return Math.floor(base * multiplier);
}
export function updatePlayerValue(player: Player): void {
  player.value = calculatePlayerValue({
    overall: player.overall,
    age: player.age,
  });
}

export function getForeignNationalities(
  currentNationality: Nationality,
): Nationality[] {
  const allNationalities = Object.keys(NATIONALITIES_DATA) as Nationality[];
  return allNationalities.filter(
    (nationality) => nationality !== currentNationality,
  );
}

interface CalculatePlayerOverallProps {
  skills: PlayerSkills;
  position: Position;
}

function calculatePlayerOverall({
  skills,
  position,
}: CalculatePlayerOverallProps): number {
  const weights = POSITIONS_DATA[position].skillsWeight;
  const skillsTotal = Object.entries(weights).reduce((sum, [skill, weight]) => {
    const value = (skills as Record<Skill, number>)[skill as Skill] ?? 0;
    return sum + value * weight;
  }, 0);
  return Math.round(skillsTotal);
}

interface GeneratePlayerProps {
  position: Position;
  team: Team;
}

interface GenerateSkillsProps {
  position: Position;
  baseOverall: number;
}
function generateSkills({
  position,
  baseOverall,
}: GenerateSkillsProps): PlayerSkills {
  const { skillGroup } = POSITIONS_DATA[position];
  const variance = () => Math.floor((Math.random() - 0.5) * 20);
  const base = () => Math.min(100, Math.max(10, baseOverall + variance()));

  const baseSkills = {
    shooting: base(),
    vision: base(),
    physical: base(),
  };

  switch (skillGroup) {
    case "goalkeeper":
      return { ...baseSkills, reflexes: base() };
    case "defender":
      return { ...baseSkills, defense: base() };
    case "attacker":
      return { ...baseSkills, dribbling: base() };
    case "mixed":
      return { ...baseSkills, dribbling: base(), defense: base() };
  }
}

export function generatePlayer({
  position,
  team,
}: GeneratePlayerProps): Player {
  const foreignNationalities = getForeignNationalities(team.nationality);
  const nationality: Nationality =
    team.type === "club" && Math.random() < 0.25
      ? getRandom({ array: foreignNationalities })
      : team.nationality;

  const names = NATIONALITIES_DATA[nationality].name;
  const lastnames = NATIONALITIES_DATA[nationality].lastname;
  const name = `${getRandom({ array: names })} ${getRandom({ array: lastnames })}`;
  const age = 17 + Math.floor(Math.random() * 18);

  const skills = generateSkills({ position, baseOverall: team.overall });
  const overall = calculatePlayerOverall({ skills, position });
  const value = calculatePlayerValue({ overall, age });

  return {
    id: crypto.randomUUID(),
    name,
    position,
    age,
    nationality,
    overall,
    skills,
    value,
    statistics: {
      goals: 0,
      assistance: 0,
      redCards: 0,
      yellowCards: 0,
      matchesPlayed: 0,
    },
  };
}
