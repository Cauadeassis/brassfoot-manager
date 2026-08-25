"use client";

import useGameStore from "../../../stores/useGameStore";
import { HistoryKey, Team } from "../../../types/team";
import styles from "./standings.module.css";
import { TeamBadge } from "../../badges";
import { getTeamStats } from "../../../gameEngine/team";
import { CompetitionId } from "../../../types/competition";
import { ZoneData } from "../../../app/(game)/standings/page";
import React from "react";
interface StandingsRowProps {
  team: Team;
  index: number;
  historyKey: HistoryKey;
  variant?: "full" | "mini";
  zone?: ZoneData;
}

const goalDifferenceMap = {
  1: { prefix: "+", color: "green-color" },
  0: { prefix: "", color: "" },
  [-1]: { prefix: "", color: "red-color" },
};

function StandingsRow({
  team,
  index,
  variant = "full",
  historyKey,
  zone,
}: StandingsRowProps) {
  const userTeamId = useGameStore((state) => state.userTeamId);
  const [season, competitionId] = historyKey.split("_");
  const { wins, draws, losses, goalsFor, goalsAgainst, points } = getTeamStats({
    team,
    season: Number(season),
    competitionId: competitionId as CompetitionId,
  });
  const goalsDifference = goalsFor - goalsAgainst;
  const sign = Math.sign(goalsDifference) as 1 | 0 | -1;
  const { prefix, color: gdColorClass } = goalDifferenceMap[sign];
  const formattedGD = `${prefix}${goalsDifference}`;
  const isUserTeam = team.id === userTeamId;
  const rowClass = isUserTeam
    ? styles.greenHighlight
    : zone?.rowClass
      ? styles[zone.rowClass]
      : "";
  return (
    <tr className={`${styles.standingsRow} ${rowClass}`}>
      <td className={zone?.colorClass || ""}>{index + 1}</td>
      <td>
        <TeamBadge teamShield={team.shield} teamName={team.name} />
      </td>
      {variant === "full" && (
        <>
          <td>{wins}</td>
          <td>{draws}</td>
          <td>{losses}</td>
          <td>{goalsFor}</td>
          <td>{goalsAgainst}</td>
        </>
      )}
      <td className={variant === "full" ? gdColorClass : ""}>{formattedGD}</td>
      <td className={styles.points}>{points}</td>
    </tr>
  );
}

export default React.memo(StandingsRow);
