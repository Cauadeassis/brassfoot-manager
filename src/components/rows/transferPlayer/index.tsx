"use client";

import { memo } from "react";
import useGameStore from "../../../stores/useGameStore";
import { Player } from "../../../types/player";
import { Team } from "../../../types/team";
import { formatMoney } from "../../../utils";
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
  marketPlayer: MarketPlayer;
  canAfford: boolean;
  isMobile?: boolean;
}

function TransferPlayerRow({
  marketPlayer,
  canAfford,
  isMobile = false
}: TransferPlayerRowProps) {
  const makeTransfer = useGameStore((state) => state.makeTransfer);
  const userTeamId = useGameStore((state) => state.userTeamId);

  const { originTeam, id, value, position, age, nationality, overall, name } =
    marketPlayer;

  const handleBuyClick = () => {
    makeTransfer({
      buyerTeamId: userTeamId,
      sellerTeamId: originTeam ? originTeam.id : null,
      playerId: id,
      value: value,
    });
  };

  return (
    <tr className={styles.transferPlayerRow}>
      <td>
        <strong>{name}</strong>
      </td>
      <td>
        <PositionBadge position={position} isMobile={isMobile} />
      </td>
      <td className="dim-color">{age}</td>
      <td>
        <NationalityBadge nationality={nationality} />
      </td>
      <td>
        <OverallBadge overall={overall} />
      </td>
      <td>
        {originTeam ? (
          <TeamBadge
            teamShield={originTeam.shield}
            teamName={originTeam.name}
          />
        ) : (
          <span className={styles.freeAgentTag}>LIVRE</span>
        )}
      </td>
      <td className="yellow-color">{formatMoney(value)}</td>
      <td>
        {canAfford ? (
          <button className="green-button" onClick={handleBuyClick}>
            COMPRAR
          </button>
        ) : (
          <span className={styles.noFundsTag}>SEM FUNDOS</span>
        )}
      </td>
    </tr>
  );
}

export default memo(TransferPlayerRow);
