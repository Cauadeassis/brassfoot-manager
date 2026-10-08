"use client";

import React from "react";
import { CornerBadge } from "../football-badges/brooches/Corner";
import { FreeKickBadge } from "../football-badges/brooches/FreeKick";
import { PenaltyBadge } from "../football-badges/brooches/Penalty";
import { SharedSoccerDefs } from "../football-badges/SharedSoccerDefs";
import ShirtIcon from "../football-badges/shirts";
import { PlayerSlot } from "../../data/formations";
import { Player as PlayerData } from "../../types/player";
import { Team } from "../../types/team";
import { Badge, getBadgeLabel, getBadgeLabels } from "./badges";
import styles from "./footballField.module.css";
import useFootballFieldData from "./useFootballFieldData";

interface FootballFieldProps {
  team: Team;
  playersMap: Record<string, PlayerData>;
  mode?: "mini" | "full";
  shirtLabelMode?: "number" | "position";
}

interface PlayerMarkerProps {
  slot: PlayerSlot;
  name: string | null;
  number?: number;
  shirtLabelMode: "number" | "position";
  uniform: Team["uniformDesign"];
  badges: Badge[];
}

const badgeComponentMap: Partial<Record<Badge, React.FC>> = {
  penalty: PenaltyBadge,
  freeKick: FreeKickBadge,
  corner: CornerBadge,
};

const PlayerMarker = React.memo(
  ({
    slot,
    name,
    number,
    shirtLabelMode,
    uniform,
    badges,
  }: PlayerMarkerProps) => {
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const shirtLabel =
      shirtLabelMode === "position" ? slot.role : String(number ?? 10);
    return (
      <div
        className={styles.player}
        style={{ top: `${slot.y}%`, left: `${slot.x}%` }}
      >
        <div className={styles.shirtWrapper}>
          <ShirtIcon label={shirtLabel} uniform={uniform} size={48} />
        </div>
        <div className={styles.name}>{name ? name.split(" ")[0] : "—"}</div>

        {badges.some((badge) => badgeComponentMap[badge]) && (
          <div
            className={`${styles.broochContainer} ${tooltipVisible ? styles.tooltipVisible : ""}`.trim()}
            data-tooltip={
              badges.length > 1
                ? getBadgeLabels(badges)
                : getBadgeLabel(badges[0])
            }
            title={
              badges.length > 1
                ? getBadgeLabels(badges)
                : getBadgeLabel(badges[0])
            }
            aria-label={
              badges.length > 1
                ? getBadgeLabels(badges)
                : getBadgeLabel(badges[0])
            }
            aria-expanded={tooltipVisible}
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
            {badges.map((badge) => {
              const BadgeComponent = badgeComponentMap[badge];
              if (!BadgeComponent) return null;

              return (
                <div
                  key={badge}
                  className={styles.badgeWrapper}
                  onMouseEnter={() => setTooltipVisible(true)}
                  onMouseLeave={() => setTooltipVisible(false)}
                  onFocus={() => setTooltipVisible(true)}
                  onBlur={() => setTooltipVisible(false)}
                >
                  <BadgeComponent />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);
PlayerMarker.displayName = "PlayerMarker";

export default function FootballField({
  team,
  playersMap,
  mode = "full",
  shirtLabelMode = "number",
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
          const shirtNumber = player?.id
            ? (team.squad.playerShirts[player.id] ?? 10)
            : 10;

          return (
            <PlayerMarker
              key={`${slot.role}-${index}`}
              slot={slot}
              name={player?.name ?? null}
              badges={badges}
              number={shirtNumber}
              shirtLabelMode={shirtLabelMode}
              uniform={team.uniformDesign}
            />
          );
        })}
      </div>
    </>
  );
}
