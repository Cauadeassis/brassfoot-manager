import { GoalkeeperSkills, AttackerSkills } from "../../types/player";
import { Player } from "../../types/player";
import { MatchTeamsNumbers, Shot } from "../../types/match";

export interface SimulateShotProps {
  shooterShootingAttribute: number;
  goalkeeperReflexesAttribute: number;
  isPenaltyKick?: boolean;
}

export interface SimulateCornerProps {
  cornerTaker: Player;
  headerPlayer: Player;
  goalkeeper: Player;
}

export function simulateShot({
  shooterShootingAttribute,
  goalkeeperReflexesAttribute,
  isPenaltyKick = false,
}: SimulateShotProps): Shot["result"] {
  const maximumShotOnTargetChance = 0.8;
  const minimumShotOnTargetChance = 0.1;
  const penaltyShotOnTargetChance = 0.9;
  const shotOnTargetChance = isPenaltyKick
    ? penaltyShotOnTargetChance
    : Math.min(
        maximumShotOnTargetChance,
        Math.max(
          minimumShotOnTargetChance,
          (shooterShootingAttribute * 0.5) / 100,
        ),
      );
  const missedShot = Math.random() > shotOnTargetChance;
  if (missedShot) return "missed";
  const basePenaltyGoalChance = 75;
  const baseOpenPlayGoalChance = 50;
  const attributeDifference =
    shooterShootingAttribute - goalkeeperReflexesAttribute;
  const baseChance = isPenaltyKick
    ? basePenaltyGoalChance + attributeDifference
    : baseOpenPlayGoalChance + attributeDifference;
  const finalGoalChance = Math.min(90, Math.max(10, baseChance)) / 100;
  const isGoal = Math.random() < finalGoalChance;
  return isGoal ? "goal" : Math.random() < 0.3 ? "corner" : "defended";
}

export function simulateCorner({
  cornerTaker,
  headerPlayer,
  goalkeeper,
}: SimulateCornerProps): Shot["result"] {
  const takerSkills = cornerTaker.currentSkills as AttackerSkills;
  const cornerQualityChance = Math.min(
    0.9,
    Math.max(
      0.1,
      (takerSkills.vision * 0.65 + takerSkills.shooting * 0.35) / 100,
    ),
  );
  const missedCorner = Math.random() > cornerQualityChance;
  if (missedCorner) return "missed";
  const goalkeeperSkills = goalkeeper.currentSkills as GoalkeeperSkills;
  const headerResult = simulateShot({
    shooterShootingAttribute: headerPlayer.currentSkills.shooting,
    goalkeeperReflexesAttribute: goalkeeperSkills.reflexes,
  });
  return headerResult === "corner" ? "defended" : headerResult;
}

interface CalculatePossessionProps {
  homeTeamOverall: number;
  awayTeamOverall: number;
  homePossessionModifier?: number;
  awayPossessionModifier?: number;
}
const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(val, max));
export function calculatePossession({
  homeTeamOverall,
  awayTeamOverall,
  homePossessionModifier = 0,
  awayPossessionModifier = 0,
}: CalculatePossessionProps): MatchTeamsNumbers {
  const overallDiff = homeTeamOverall + 3 - awayTeamOverall;
  const tacticalDiff = homePossessionModifier - awayPossessionModifier;
  const homePossession = 0.5 + overallDiff / 100 + tacticalDiff * 0.5;
  const clampedHome = clamp(homePossession, 0.1, 0.9);
  return {
    home: clampedHome,
    away: 1 - clampedHome,
  };
}

export function calculateTotalShots(
  possession: number,
  tacticalModifier: number,
): number {
  const randomVariance = Math.floor(Math.random() * 5) - 2;
  const calculatedShots =
    Math.round(possession * 10 * (1 + tacticalModifier)) + randomVariance;
  return Math.max(1, calculatedShots);
}
