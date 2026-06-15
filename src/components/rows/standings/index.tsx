"use client";

import useGameStore from "../../../stores/useGameStore";
import type { Team } from "../../../types";
import styles from "./standings.module.css";
import { TeamBadge } from "../../badges";
type StandingsVariant = "full" | "mini";

interface StandingsRowProps {
    team: Team;
    index: number;
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
}: StandingsRowProps) {
    const userTeamId = useGameStore((state) => state.userTeamId);
    const { matchesPlayed, wins, draws, losses, goalsFor, goalsAgainst, points } =
        team.statistics;
    const goalDifference = goalsFor - goalsAgainst;
    const isUserTeam = team.id === userTeamId;
    const sign = Math.sign(goalDifference) as 1 | 0 | -1;
    const sgFormatted = `${goalDifferenceMap[sign].prefix}${goalDifference}`;
    const goalDifferenceClass = goalDifferenceMap[sign].color;
    const POSITION_RULES = [
        { condition: index < 4, className: "blue-color" },
        { condition: index >= 17, className: "red-color" },
    ];
    const positionClass =
        POSITION_RULES.find((rule) => rule.condition)?.className || "";
    const rowClass = isUserTeam ? styles.destaqueMeuTime : "";
    if (variant === "mini") {
        return (
            <tr className={` ${styles.standingsRow} ${rowClass}`}>
                <td className={positionClass}>{index + 1}</td>
                <td>
                    <TeamBadge teamShield={team.shield} teamName={team.name} />
                </td>
                <td>{matchesPlayed}</td>
                <td>{sgFormatted}</td>
                <td className="green-color">{points}</td>
            </tr>
        );
    }
    return (
        <tr className={` ${styles.standingsRow} ${rowClass}`}>
            <td className={positionClass}>{index + 1}</td>
            <td>
                <TeamBadge teamShield={team.shield} teamName={team.name} />
            </td>
            <td>{matchesPlayed}</td>
            <td>{wins}</td>
            <td>{draws}</td>
            <td>{losses}</td>
            <td>{goalsFor}</td>
            <td>{goalsAgainst}</td>
            <td className={goalDifferenceClass}>{sgFormatted}</td>
            <td className="green-color bold">{points}</td>
        </tr>
    );
}
