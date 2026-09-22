"use client";

import React from "react";
import { PlayerSlot } from "../../data/formations";
import { Player as PlayerData } from "../../types/player";
import { Team } from "../../types/team";
import styles from "./footballField.module.css";
import useFootballFieldData from "./useFootballFieldData";

interface FootballFieldProps {
  team: Team;
  playersMap: Record<string, PlayerData>;
  mode?: "mini" | "full";
}

const PlayerMarker = React.memo(
  ({ slot, name }: { slot: PlayerSlot; name: string | null }) => (
    <div
      className={styles.player}
      style={{ top: `${slot.y}%`, left: `${slot.x}%` }}
    >
      <div className={styles.circle}>{slot.role || "?"}</div>
      <div className={styles.name}>{name ? name.split(" ")[0] : "—"}</div>
    </div>
  ),
);
PlayerMarker.displayName = "PlayerMarker";

export default function FootballField({
  team,
  playersMap,
  mode = "full",
}: FootballFieldProps) {
  const { squadMap, slots } = useFootballFieldData({ team, playersMap });

  return (
    <>
      <div
        className={`${styles.footballFieldContainer} ${mode === "mini" ? styles.mini : ""}`.trim()}
      >
        <img src="/FootballField.svg" alt="Campo de futebol" />
        {slots.map((slot, index) => {
          const player = squadMap.get(team.squad.starterIds[index]);
          return (
            <PlayerMarker
              key={`${slot.role}-${index}`}
              slot={slot}
              name={player?.name ?? null}
            />
          );
        })}
      </div>
    </>
  );
}
