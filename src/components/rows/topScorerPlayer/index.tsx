"use client";

import { memo } from "react";
import { ScorerPlayer } from "../../../app/(game)/topScorers/page";
import { TeamBadge, PositionBadge } from "../../badges";
import styles from "./topScorerPlayer.module.css";
import MobilePlayerCard from "../mobilePlayer";
import { LayoutMode } from "../../../app/(game)/transfers/page";

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
                {stats.goals > 0 &&
                  <span className={styles.playerGoals}>{stats.goals} {stats.goals === 1 ? "Gol" : "Gols"}</span>
                }
                {stats.assists > 0 &&
                  <span className={styles.playerAssists}>{stats.assists} {stats.assists === 1 ? "Assist" : "Assists"}</span>
                }
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
          isMobile={layoutMode === "desktop" ? false : true}
        />
      </td>
      <td>
        <PositionBadge position={scorerPlayer.position} isMobile={layoutMode === "desktop" ? false : true} />
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
