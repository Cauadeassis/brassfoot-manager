"use client";

import useGameStore from "../../../stores/useGameStore";
import { HistoryKey, Team } from "../../../types/team";
import styles from "./standings.module.css";
import { TeamBadge } from "../../badges";
import { getTeamStats } from "../../../gameEngine/team";
type StandingsVariant = "full" | "mini";

interface StandingsRowProps {
    team: Team;
    index: number;
    historyKey: HistoryKey;
    variant?: StandingsVariant;
}

const goalDifferenceMap = {
    1: { prefix: "+", color: "green-color" },
    0: { prefix: "", color: "" },
    [-1]: { prefix: "", color: "red-color" },
};

export default function StandingsRow({
    team,
    index,
    variant = "full",
    historyKey,
}: StandingsRowProps) {
    const userTeamId = useGameStore((state) => state.userTeamId);
    const [season, competitionId] = historyKey.split("_");
    const { wins, draws, losses, goalsFor, goalsAgainst, points } = getTeamStats({
        team,
        season: Number(season),
        competitionId,
    });
    const goalDifference = goalsFor - goalsAgainst;
    const isUserTeam = team.id === userTeamId;
    const sign = Math.sign(goalDifference) as 1 | 0 | -1;
    const sgFormatted = `${goalDifferenceMap[sign].prefix}${goalDifference}`;
    const goalDifferenceClass = goalDifferenceMap[sign].color;
    const isTop4 = index < 4;
    const isBottom5 = index >= 16;
    const getRowClass = () => {
        if (isUserTeam) return styles.greenHighlight;
        if (isTop4) return styles.greenHighlight;
        if (isBottom5) return styles.redHighlight;
        return "";
    };

    const positionClass =
        index < 4 ? "blue-color" : index >= 17 ? "red-color" : "";
    const rowClass = getRowClass();
    if (variant === "mini") {
        return (
            <tr className={` ${styles.standingsRow} ${rowClass}`}>
                <td className={positionClass}>{index + 1}</td>
                <td>
                    <TeamBadge teamShield={team.shield} teamName={team.name} />
                </td>
                <td>{sgFormatted}</td>
                <td className={styles.points}>{points}</td>
            </tr>
        );
    }
    return (
        <tr className={` ${styles.standingsRow} ${rowClass}`}>
            <td className={positionClass}>{index + 1}</td>
            <td>
                <TeamBadge teamShield={team.shield} teamName={team.name} />
            </td>
            <td>{wins}</td>
            <td>{draws}</td>
            <td>{losses}</td>
            <td>{goalsFor}</td>
            <td>{goalsAgainst}</td>
            <td className={goalDifferenceClass}>{sgFormatted}</td>
            <td className={styles.points}>{points}</td>
        </tr>
    );
}
