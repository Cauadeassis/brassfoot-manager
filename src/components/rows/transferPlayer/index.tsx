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
  layoutMode?: "desktop" | "compact" | "card";
}

function TransferPlayerRow({
  marketPlayer,
  canAfford,
  layoutMode = "desktop",
}: TransferPlayerRowProps) {
  const makeTransfer = useGameStore((state) => state.makeTransfer);
  const userTeamId = useGameStore((state) => state.userTeamId);
  const { originTeam, id, value, position, age, nationality, overall, name } =
    marketPlayer;
  const handleBuyClick = () => {
    if (!canAfford) return;
    makeTransfer({
      buyerTeamId: userTeamId,
      sellerTeamId: originTeam ? originTeam.id : null,
      playerId: id,
      value: value,
    });
  };

  if (layoutMode === "card") {
    return (
      <div className={styles.mobileCard}>
        <div className={styles.cardHeader}>
          <div className={styles.playerInfo}>
            <strong className={styles.name}>{name}</strong>
            <div className={styles.badgesGroup}>
              <PositionBadge position={position} isMobile={true} />
              <OverallBadge overall={overall} />
              <NationalityBadge nationality={nationality} />
              <span className={styles.age}>{age} anos</span>
            </div>
          </div>

          <div className={styles.teamAndValue}>
            {originTeam ? (
              <TeamBadge
                teamShield={originTeam.shield}
                teamName={originTeam.name}
                isMobile={true}
              />
            ) : (
              <span className={styles.freeAgentTag}>LIVRE</span>
            )}
            <span
              className={`${styles.valueTag} ${canAfford ? styles.canBuy : styles.noFunds}`}
            >
              {formatMoney(value)}
            </span>
          </div>
        </div>
        {canAfford && (
          <button
            className={`green-button ${styles.mobileBuyBtn}`}
            onClick={canAfford ? handleBuyClick : undefined}
            disabled={!canAfford}
          >
            COMPRAR
          </button>
        )}
      </div>
    );
  }

  const isCompact = layoutMode === "compact";
  return (
    <tr className={styles.transferPlayerRow}>
      <td>
        <strong>{name}</strong>
      </td>
      <td>
        <PositionBadge position={position} isMobile={isCompact} />
      </td>
      <td className={styles.age}>{age}</td>
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
            isMobile={isCompact}
          />
        ) : (
          <span className={styles.freeAgentTag}>LIVRE</span>
        )}
      </td>
      <td className={!isCompact ? "yellow-color" : ""}>
        <span
          className={
            isCompact
              ? `${styles.valueTag} ${canAfford ? styles.canBuy : styles.noFunds}`
              : ""
          }
          onClick={isCompact && canAfford ? handleBuyClick : undefined}
          title={
            isCompact
              ? canAfford
                ? "Clique para comprar"
                : "Sem fundos"
              : undefined
          }
        >
          {formatMoney(value)}
        </span>
      </td>
      <td>
        {!isCompact &&
          (canAfford ? (
            <button className="green-button" onClick={handleBuyClick}>
              COMPRAR
            </button>
          ) : (
            <span className={styles.noFundsTag}>SEM FUNDOS</span>
          ))}
      </td>
    </tr>
  );
}

export default memo(TransferPlayerRow);
