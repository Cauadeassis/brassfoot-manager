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
import MobilePlayerCard from "../mobilePlayer";

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
      <MobilePlayerCard
        player={marketPlayer}
        isDisabled={!canAfford}
        topRightContent={
          originTeam ? (
            <TeamBadge
              teamShield={originTeam.shield}
              teamName={originTeam.name}
              isMobile={true}
            />
          ) : (
            <span className={styles.freeAgentTag}>LIVRE</span>
          )
        }
        customValue={
          <span className={`${styles.valueTag} ${!canAfford ? styles.noFunds : ""}`}>
            {formatMoney(value)}
          </span>
        }
        actionButton={
          canAfford
            ? { action: handleBuyClick, type: "buy" }
            : undefined
        }
      />
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
