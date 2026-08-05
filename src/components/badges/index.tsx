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
}
interface OverallBadgeProps {
  overall: number;
}
interface NationalityBadgeProps {
  nationality: Nationality;
}
interface TeamBadgeProps {
  widthThatNameDisappears?: number;
  teamShield: string;
  teamName: string;
}

interface SerieBadgeProps {
  serie: Division;
}

export function PositionBadge({ position }: PositionBadgeProps) {
  const modality = useGameStore((state) => state.modality);
  if (!modality) return;
  const POSITIONS_DATA = useMemo(() => getPositionsData(modality), [modality]);
  const data = POSITIONS_DATA[position];
  return (
    <span className={`${data.color} ${styles.positionBadge}`}>
      <span className={styles.desktopText}>{data.label.singular}</span>
      <span className={styles.mobileText}>{position}</span>
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
  widthThatNameDisappears = 100,
}: TeamBadgeProps) {
  const [isNameHidden, setIsNameHidden] = useState(false);
  useEffect(() => {
    function checkWidth() {
      setIsNameHidden(window.innerWidth <= widthThatNameDisappears);
    }
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, [widthThatNameDisappears]);

  return (
    <div className={`${styles.teamContainer} ${isNameHidden ? styles.hideName : ""}`}>
      <Icon name={teamShield} className={styles.shieldIcon} />
      <span className={styles.teamName}>{teamName}</span>
    </div>
  );
}
