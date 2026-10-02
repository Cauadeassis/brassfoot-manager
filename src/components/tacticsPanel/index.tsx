"use client";

import { useMemo } from "react";
import { Modifiers } from "../../gameEngine/match/orchestrator";
import { AnimatedPercent } from "../../hooks";
import styles from "./tacticsPanel.module.css";

interface TacticStat {
  label: string;
  value: number;
}

const getTacticStats = (modifiers: Modifiers): TacticStat[] => [
  { label: "Posse de Bola", value: modifiers.ownPossession },
  { label: "Ataque", value: modifiers.ownShots },
  { label: "Defesa", value: modifiers.opponentShots * -1 },
];

export default function TacticsPanel({
  modifiers,
  className = "",
}: {
  modifiers: Modifiers;
  className?: string;
}) {
  const stats = useMemo(() => getTacticStats(modifiers), [modifiers]);

  return (
    <div className={`${styles.tacticsPanel} ${className}`.trim()}>
      <h4>Modificadores</h4>
      {stats.map((stat) => {
        const roundedValue = Math.round(stat.value * 100);
        const isPositive = roundedValue > 0;
        const isNegative = roundedValue < 0;
        const valueClassName = [
          styles.tacticValue,
          isPositive ? styles.positive : "",
          isNegative ? styles.negative : "",
        ]
          .join(" ")
          .trim();

        return (
          <p key={stat.label} className={styles.tacticsRow}>
            <label>{stat.label}</label>
            <AnimatedPercent value={stat.value} className={valueClassName} />
          </p>
        );
      })}
    </div>
  );
}
