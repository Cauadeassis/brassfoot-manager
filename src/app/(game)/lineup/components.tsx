import React, { useMemo } from "react";
import { Modifiers } from "../../../gameEngine/match/orchestrator";
import styles from "./lineup.module.css";
import { AnimatedPercent } from "../../../hooks";
import { SubstitutionEvent } from "../../../hooks/useSubstitutionEvent";

interface TacticStat {
  label: string;
  value: number;
}

const getTacticStats = (modifiers: Modifiers): TacticStat[] => [
  { label: "Posse de Bola", value: modifiers.ownPossession },
  { label: "Ataque", value: modifiers.ownShots },
  { label: "Defesa", value: modifiers.opponentShots * -1 },
];

export function TacticsPanel({ modifiers }: { modifiers: Modifiers }) {
  const stats = useMemo(() => getTacticStats(modifiers), [modifiers]);
  return (
    <div className={styles.tacticsPanel}>
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
          <label key={stat.label} className={styles.tacticsRow}>
            <p className={styles.tacticsLabel}>{stat.label}</p>
            <AnimatedPercent value={stat.value} className={valueClassName} />
          </label>
        );
      })}
    </div>
  );
}

export function SubstitutionLog({ events }: { events: SubstitutionEvent[] }) {
  if (events.length === 0) return null;

  const batchKey = events[0].id.split("-")[0];

  return (
    <div className={styles.substitutionLog} key={batchKey}>
      {events.map((event) => (
        <div key={event.id} className={styles.substitutionEntry}>
          {event.outPlayer && (
            <p className={styles.subOut}>
              Sai {event.outPlayer.name} ({event.outPlayer.position})
            </p>
          )}
          {event.inPlayer && (
            <p className={styles.subIn}>
              Entra {event.inPlayer.name} ({event.inPlayer.position})
            </p>
          )}
          {event.positionSwap && (
            <p className={styles.subSwap}>
              {event.positionSwap.player.name} troca de{" "}
              {event.positionSwap.fromRole} para {event.positionSwap.toRole}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
