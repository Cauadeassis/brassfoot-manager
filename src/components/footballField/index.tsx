"use client";

import React from "react";
import { CornerBadge } from "../football-badges/brooches/Corner";
import { FreeKickBadge } from "../football-badges/brooches/FreeKick";
import { PenaltyBadge } from "../football-badges/brooches/Penalty";
import { SharedSoccerDefs } from "../football-badges/SharedSoccerDefs";
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

export type Badge = "penalty" | "freeKick" | "corner";

interface PlayerMarkerProps {
  slot: PlayerSlot;
  name: string | null;
  badges: Badge[];
}

// 1. MAPEAMENTO CORRIGIDO: Associa a chave ao COMPONENTE, não a uma string.
const badgeComponentMap: Partial<Record<Badge, React.FC>> = {
  penalty: PenaltyBadge,
  freeKick: FreeKickBadge,
  corner: CornerBadge,
};

const PlayerMarker = React.memo(({ slot, name, badges }: PlayerMarkerProps) => {
  return (
    <div
      className={styles.player}
      style={{ top: `${slot.y}%`, left: `${slot.x}%` }}
    >
      <div className={styles.circle}>{slot.role || "?"}</div>
      <div className={styles.name}>{name ? name.split(" ")[0] : "—"}</div>

      {badges.some((badge) => badgeComponentMap[badge]) && (
        <div className={styles.broochContainer}>
          {badges.map((badge) => {
            const BadgeComponent = badgeComponentMap[badge];
            return BadgeComponent ? <BadgeComponent key={badge} /> : null;
          })}
        </div>
      )}
    </div>
  );
});
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
        {/* 3. IMPORTANTE: Insere as definições compartilhadas UMA vez aqui. */}
        {/* Usamos display: none para garantir que o SVG de defs não ocupe espaço visual. */}
        <div style={{ display: "none" }}>
          <svg>
            <SharedSoccerDefs />
          </svg>
        </div>

        <img src="/FootballField.svg" alt="Campo de futebol" />

        {slots.map((slot, index) => {
          const player = squadMap.get(team.squad.starterIds[index]);

          const badges: Badge[] = [];
          if (player) {
            if (team.tactics?.takers?.penalty === player.id)
              badges.push("penalty");
            if (team.tactics?.takers?.freeKick === player.id)
              badges.push("freeKick");
            if (team.tactics?.takers?.corner === player.id)
              badges.push("corner");
          }

          return (
            <PlayerMarker
              key={`${slot.role}-${index}`}
              slot={slot}
              name={player?.name ?? null}
              badges={badges}
            />
          );
        })}
      </div>
    </>
  );
}
