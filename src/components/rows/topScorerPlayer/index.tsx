"use client";

import { memo } from "react";
import { ScorerPlayer } from "../../../app/(game)/topScorers/page";
import { TeamBadge, PositionBadge } from "../../badges";
import styles from "./topScorerPlayer.module.css";
import MobilePlayerCard from "../mobilePlayer";
import { LayoutMode } from "../../../app/(game)/transfers/page";
import useUIStore from "../../../stores/useUIStore";

interface TopScorerRowProps {
  scorerPlayer: ScorerPlayer;
  index: number;
  layoutMode?: LayoutMode;
}

function TopScorerRow({
  scorerPlayer,
  index,
  layoutMode = "desktop",
}: TopScorerRowProps) {
  const openPlayerModal = useUIStore((state) => state.openPlayerModal);
  const stats = scorerPlayer.activeStats;
  const isAttacker = stats.role === "attacker";
  if (layoutMode === "card") {
    return (
      <MobilePlayerCard
        player={scorerPlayer}
        topRightContent={
          <TeamBadge
            teamShield={scorerPlayer.teamShield}
            teamName={scorerPlayer.teamName}
            isMobile={true}
          />
        }
        customValue={
          <div className={styles.mobileStatsGroup}>
            {isAttacker ? (
              <>
                {stats.goals > 0 && (
                  <span className={styles.playerGoals}>
                    {stats.goals} {stats.goals === 1 ? "Gol" : "Gols"}
                  </span>
                )}
                {stats.assists > 0 && (
                  <span className={styles.playerAssists}>
                    {stats.assists} {stats.assists === 1 ? "Assist" : "Assists"}
                  </span>
                )}
              </>
            ) : (
              <span className={styles.playerGoals}>
                {stats.defenses} Defesas
              </span>
            )}
          </div>
        }
      />
    );
  }

  return (
    <tr
      className={styles.scorerRow}
      onClick={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest("button, a, input, select, textarea")
        ) {
          return;
        }
        openPlayerModal(scorerPlayer.id);
      }}
    >
      <td className="dim-color">{index + 1}</td>
      <td>
        <button
          type="button"
          className={styles.playerNameButton}
          onClick={() => openPlayerModal(scorerPlayer.id)}
          aria-label={`Ver detalhes de ${scorerPlayer.name}`}
        >
          {scorerPlayer.name}
        </button>
      </td>
      <td>
        <TeamBadge
          teamShield={scorerPlayer.teamShield}
          teamName={scorerPlayer.teamName}
          isMobile={layoutMode === "desktop" ? false : true}
        />
      </td>
      <td>
        <PositionBadge
          position={scorerPlayer.position}
          isMobile={layoutMode === "desktop" ? false : true}
        />
      </td>
      <td>{stats.matchesPlayed}</td>
      {isAttacker && (
        <>
          <td className={styles.playerGoals}>{stats.goals}</td>
          <td>{stats.assists}</td>
        </>
      )}
      {!isAttacker && <td>{stats.defenses}</td>}
    </tr>
  );
}

export default memo(TopScorerRow);
