"use client";
import useGameStore from "../../../stores/useGameStore";
import type { Player, Team } from "../../../types";
import { formatMoney, getOverallLabel } from "../../../utils";
import styles from "./transferPlayer.module.css";
import {
    TeamBadge,
    NationalityBadge,
    OverallBadge,
    PositionBadge,
} from "../../badges";

export interface MarketPlayer extends Player {
    marketType: "free" | "club";
    originTeam?: Team | null;
}

interface TransferPlayerRowProps {
    player: MarketPlayer;
    canAfford: boolean;
}

export default function TransferPlayerRow({
    player,
    canAfford,
}: TransferPlayerRowProps) {
    const makeTransaction = useGameStore((state) => state.makeTransaction);
    const userTeamId = useGameStore((state) => state.userTeamId);
    const isFreeAgent = player.marketType === "free";
    const handleBuyClick = () => {
        makeTransaction({
            buyerTeamId: userTeamId,
            sellerTeamId: isFreeAgent ? null : (player.originTeam?.id ?? null),
            playerId: player.id,
            value: player.value,
        });
    };

    return (
        <tr className={styles.transferPlayerRow}>
            <td>
                {" "}
                <strong>{player.name} </strong>
            </td>
            <td>
                <PositionBadge position={player.position} />
            </td>
            <td className="dim-color"> {player.age} </td>
            <td>
                <NationalityBadge nationality={player.nationality} />
            </td>
            <td>
                <OverallBadge overall={player.overall} />
            </td>
            <td>
                {isFreeAgent ? (
                    <span className={styles.freeAgentTag}> FREE AGENT</span>
                ) : (
                    <TeamBadge
                        teamShield={player.originTeam!.shield}
                        teamName={player.originTeam!.name}
                    />
                )}
            </td>
            <td className="yellow-color"> {formatMoney(player.value)} </td>
            <td>
                {canAfford ? (
                    <button className="green-button" onClick={handleBuyClick}>
                        BUY
                    </button>
                ) : (
                    <span className={styles.noFundsTag}>NO FUNDS</span>
                )}
            </td>
        </tr>
    );
}
