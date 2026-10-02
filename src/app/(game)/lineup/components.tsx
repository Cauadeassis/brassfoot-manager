import styles from "./lineup.module.css";
import { SubstitutionEvent } from "../../../hooks/useSubstitutionEvent";
import { Player } from "../../../types/player";
import { Team } from "../../../types/team";

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

interface TakersPanelProps {
  starters: Pick<Player, "id" | "name">[];
  takers: Team["tactics"]["takers"];
  onTakerChange: (
    role: keyof Team["tactics"]["takers"],
    playerId: string,
  ) => void;
}

const TAKER_ROLES: {
  roleKey: keyof Team["tactics"]["takers"];
  label: string;
}[] = [
  { roleKey: "penalty", label: "Pênalti" },
  { roleKey: "freeKick", label: "Falta" },
  { roleKey: "corner", label: "Escanteio" },
];

export function TakersPanel({
  starters,
  takers,
  onTakerChange,
}: TakersPanelProps) {
  return (
    <div className={styles.takersPanel}>
      <h4>Definir cobradores</h4>
      {TAKER_ROLES.map(({ roleKey, label }) => (
        <label key={roleKey} className={styles.takersRow}>
          <p className={styles.takersLabel}>{label}</p>
          <select
            value={String(takers?.[roleKey] ?? "")}
            onChange={(event) => onTakerChange(roleKey, event.target.value)}
          >
            <option value="" disabled>
              Selecionar
            </option>
            {starters.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
