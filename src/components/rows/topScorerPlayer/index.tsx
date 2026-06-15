"use client";

import type { Player } from "../../../types";
import { TeamBadge, PositionBadge } from "../../badges";
import styles from "./topScorerPlayer.module.css";
export interface TopScorer extends Player {
    teamName: string;
    teamShield: string;
}

interface TopScorerRowProps {
    player: TopScorer;
    index: number;
}

export default function TopScorerRow({ player, index }: TopScorerRowProps) {
    return (
        <tr>
            <td className="dim-color"> {index + 1} </td>
            <td> {player.name} </td>
            <td>
                <TeamBadge teamShield={player.teamShield} teamName={player.teamName} />
            </td>
            <td>
                <PositionBadge position={player.position} />
            </td>
            <td className={styles.playerGoals}> {player.statistics.goals} </td>
        </tr>
    );
}
