"use client";

import { memo } from "react";
import { ScorerPlayer } from "../../../app/(game)/topScorers/page";
import { TeamBadge, PositionBadge } from "../../badges";
import styles from "./topScorerPlayer.module.css";
import { HistoryKey } from "../../../types/team";
import MobilePlayerCard from "../mobilePlayer";

interface TopScorerRowProps {
  scorerPlayer: ScorerPlayer;
  index: number;
  historyKey: HistoryKey;
  isMobile?: boolean;
}

function TopScorerRow({
  scorerPlayer,
  index,
  historyKey,
  isMobile = false,
}: TopScorerRowProps) {
  const stats = scorerPlayer.history[historyKey];
  const isAttacker = stats.role === "attacker";
  if (isMobile) {
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

  // --- RENDERIZAÇÃO DESKTOP ---
  return (
    <tr>
      <td className="dim-color">{index + 1}</td>
      <td>{scorerPlayer.name}</td>
      <td>
        <TeamBadge
          teamShield={scorerPlayer.teamShield}
          teamName={scorerPlayer.teamName}
        />
      </td>
      <td>
        <PositionBadge position={scorerPlayer.position} isMobile={false} />
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
