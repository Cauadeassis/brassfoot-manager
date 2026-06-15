import NATIONALITIES_DATA from "../data/nationalities";
import POSITIONS_DATA from "../data/positions";
import { getOverallLabel } from "../utils";
import type { Position, Division } from "../types";
import type { Nationality } from "../data/nationalities";
import styles from "./badges.module.css";
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
    teamShield: string;
    teamName: string;
}

interface SerieBadgeProps {
    serie: Division;
}

export function PositionBadge({ position }: PositionBadgeProps) {
    const data = POSITIONS_DATA[position] || { color: "", label: position };
    return <span className={data.color}>{data.label}</span>;
}

export function SerieBadge({ serie }: SerieBadgeProps) {
    return (
        <span className={`${styles.serie} ${styles[serie]}`}>Série {serie}</span>
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
    return (
        <img
            src={flag}
            alt={`Bandeira de ${nationality}`}
            className={styles.nationalityFlag}
        />
    );
}

export function TeamBadge({ teamShield, teamName }: TeamBadgeProps) {
    return (
        <div className={styles.teamContainer}>
            <img src={teamShield} alt={`Escudo do ${teamName}`} />
            <span>{teamName}</span>
        </div>
    );
}
