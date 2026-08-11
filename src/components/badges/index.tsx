import NATIONALITIES_DATA from "../../data/nationalities";
import getPositionsData from "../../gameEngine/generators/positions";
import { getOverallLabel } from "../../utils";
import { Position } from "../../types/player";
import { Division } from "../../types/team";
import { Nationality } from "../../data/nationalities";
import styles from "./badges.module.css";
import useGameStore from "../../stores/useGameStore";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "../../app/components";
interface PositionBadgeProps {
  position: Position;
  isMobile?: boolean;
}
interface OverallBadgeProps {
  overall: number;
}
interface NationalityBadgeProps {
  nationality: Nationality;
}
interface TeamBadgeProps {
  isMobile?: boolean;
  teamShield: string;
  teamName: string;
}

interface SerieBadgeProps {
  serie: Division;
}

export function PositionBadge({
  position,
  isMobile = false,
}: PositionBadgeProps) {
  const modality = useGameStore((state) => state.modality);
  const POSITIONS_DATA = useMemo(() => {
    return getPositionsData(modality);
  }, [modality]);
  if (!modality) return null;
  const data = POSITIONS_DATA[position];
  if (!data) return null;
  return (
    <span className={`${data.color} ${styles.positionBadge}`}>
      <span>{isMobile ? position : data.label.singular}</span>
    </span>
  );
}
export function SerieBadge({ serie }: SerieBadgeProps) {
  return (
    <span className={`${styles.serie} ${styles[serie]}`}>
      <span>Série </span>
      {serie}
    </span>
  );
}

export function OverallBadge({ overall }: OverallBadgeProps) {
  const overallLabel = getOverallLabel(overall);
  return (
    <span className={`${styles.overall} ${styles[overallLabel]}`}>
      {overall}
    </span>
  );
}

export function NationalityBadge({ nationality }: NationalityBadgeProps) {
  const flag = NATIONALITIES_DATA[nationality]?.flag;
  if (!flag) return null;
  return <Icon name={flag} className={styles.nationalityFlag} />;
}

export function TeamBadge({
  teamShield,
  teamName,
  isMobile = false,
}: TeamBadgeProps) {
  return (
    <div className={`${styles.teamContainer}`}>
      <Icon name={teamShield} className={styles.shieldIcon} />
      {!isMobile && <span className={styles.teamName}>{teamName}</span>}
    </div>
  );
}
