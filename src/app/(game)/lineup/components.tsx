import styles from "./lineup.module.css";
import { SubstitutionEvent } from "../../../hooks/useSubstitutionEvent";

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
