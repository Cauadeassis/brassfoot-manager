"use client";

import { memo } from "react";
import { ScorerPlayer } from "../../../app/(game)/topScorers/page";
import { TeamBadge, PositionBadge } from "../../badges";
import styles from "./topScorerPlayer.module.css";

interface TopScorerRowProps {
  scorerPlayer: ScorerPlayer;
  index: number;
  historyKey: string;
}

function TopScorerRow({ scorerPlayer, index, historyKey }: TopScorerRowProps) {
  const stats = scorerPlayer.history[historyKey];
  const isAttacker = stats.role === "attacker";
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
        <PositionBadge position={scorerPlayer.position} />
      </td>
      <td>{stats.matchesPlayed}</td>
      {stats.role === "attacker" && (
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
