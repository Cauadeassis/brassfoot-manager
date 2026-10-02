"use client";

import React from "react";
import { CornerBadge } from "../football-badges/brooches/Corner";
import { FreeKickBadge } from "../football-badges/brooches/FreeKick";
import { PenaltyBadge } from "../football-badges/brooches/Penalty";
import { SharedSoccerDefs } from "../football-badges/SharedSoccerDefs";
import { PlayerSlot } from "../../data/formations";
import { Player as PlayerData } from "../../types/player";
import { Team } from "../../types/team";
import { Badge, getBadgeLabel } from "./badges";
import styles from "./footballField.module.css";
import useFootballFieldData from "./useFootballFieldData";

interface FootballFieldProps {
  team: Team;
  playersMap: Record<string, PlayerData>;
  mode?: "mini" | "full";
}

interface PlayerMarkerProps {
  slot: PlayerSlot;
  name: string | null;
  badges: Badge[];
}

const badgeComponentMap: Partial<Record<Badge, React.FC>> = {
  penalty: PenaltyBadge,
  freeKick: FreeKickBadge,
  corner: CornerBadge,
};

const PlayerMarker = React.memo(({ slot, name, badges }: PlayerMarkerProps) => {
  const [tooltipVisible, setTooltipVisible] = React.useState(false);

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
            if (!BadgeComponent) return null;

            const label = getBadgeLabel(badge);
            const isVisible = tooltipVisible;

            return (
              <div
                key={badge}
                className={`${styles.badgeWrapper} ${isVisible ? styles.tooltipVisible : ""}`.trim()}
                data-tooltip={label}
                title={label}
                aria-label={label}
                aria-expanded={isVisible}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
                onFocus={() => setTooltipVisible(true)}
                onBlur={() => setTooltipVisible(false)}
                onClick={() => setTooltipVisible((previous) => !previous)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setTooltipVisible((previous) => !previous);
                  }
                }}
              >
                <BadgeComponent />
              </div>
            );
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
