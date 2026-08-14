"use client";

import { memo } from "react";
import { ScorerPlayer } from "../../../app/(game)/topScorers/page";
import { TeamBadge, PositionBadge } from "../../badges";
import styles from "./topScorerPlayer.module.css";
import { HistoryKey } from "../../../types/team";
import MobilePlayerCard from "../mobilePlayer";
import { LayoutMode } from "../../../app/(game)/transfers/page";

interface TopScorerRowProps {
  scorerPlayer: ScorerPlayer;
  index: number;
  historyKey: HistoryKey;
  layoutMode?: LayoutMode;
}

function TopScorerRow({
  scorerPlayer,
  index,
  historyKey,
  layoutMode = "desktop",
}: TopScorerRowProps) {
  const stats = scorerPlayer.history[historyKey];
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
                <span className={styles.playerGoals}>{stats.goals} Gols</span>
                <span className={styles.playerAssists}>{stats.assists} Assists</span>
              </>
            ) : (
              <span className={styles.playerGoals}>{stats.defenses} Defesas</span>
            )}
          </div>
        }
      />
    );
  }
  return (
    <tr>
      <td className="dim-color">{index + 1}</td>
      <td>{scorerPlayer.name}</td>
      <td>
        <TeamBadge
          teamShield={scorerPlayer.teamShield}
          teamName={scorerPlayer.teamName}
          isMobile={layoutMode !== "desktop"}
        />
      </td>
      <td>
        <PositionBadge position={scorerPlayer.position} isMobile={layoutMode !== "desktop"} />
      </td>
      <td>{stats.matchesPlayed}</td>
      {isAttacker && (
        <>
          <td className={styles.playerGoals}>{stats.goals}</td>
          <td>{stats.assists}</td>
        </>
      )}
      {stats.role === "goalkeeper" && <td>{stats.defenses}</td>}
    </tr>
  );
}

export default memo(TopScorerRow);
