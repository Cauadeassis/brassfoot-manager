"use client";

import { formatMoney } from "../../../utils";
import useGameStore from "../../../stores/useGameStore";
import { Player } from "../../../types/player";
import styles from "./squadPlayer.module.css";
import { PositionBadge, NationalityBadge, OverallBadge } from "../../badges";
import { LayoutMode } from "../../../app/(game)/transfers/page";
import MobilePlayerCard from "../mobilePlayer";

interface SquadPlayerRowProps {
  player: Player;
  isStarter?: boolean;
  showAction?: boolean;
  layoutMode?: LayoutMode;
}

export default function SquadPlayerRow({
  player,
  isStarter = false,
  showAction = false,
  layoutMode = "desktop",
}: SquadPlayerRowProps) {
  const sellPlayer = useGameStore((state) => state.sellPlayer);
  const handleSellClick = () => {
    if (sellPlayer) sellPlayer(player.id);
    else
      console.warn(`Ação de venda não mapeada para o jogador: ${player.name}`);
  };
  if (layoutMode === "card") {
    return (
      <MobilePlayerCard
        player={player}
        topRightContent={
          isStarter && <span className={styles.starterTag}>TITULAR</span>
        }
        customValue={
          showAction && (
            <span className={styles.value}>{formatMoney(player.value)}</span>
          )
        }
        actionButton={
          showAction ? { action: handleSellClick, type: "sell" } : undefined
        }
      />
    );
  }

  const isCompact = layoutMode === "compact";
  const rowClasses = [
    styles.playerRow,
    isCompact ? styles.compact : "",
    isStarter ? styles.starter : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={`${rowClasses} ${layoutMode}`}>
      <span>
        <PositionBadge position={player.position} isMobile={isCompact} />
      </span>

      <p className={styles.name}>
        {player.name}
        {!isCompact && isStarter && <span>TITULAR</span>}
      </p>
      <span className={styles.age}>{player.age}</span>
      <NationalityBadge nationality={player.nationality} />
      <OverallBadge overall={player.overall} />

      {showAction && (
        <>
          <span
            className={`${styles.value}`}
            onClick={isCompact ? handleSellClick : undefined}
            title={isCompact ? "Clique para vender" : undefined}
          >
            {formatMoney(player.value)}
          </span>
          {!isCompact && (
            <button onClick={handleSellClick}>VENDER</button>
          )}
        </>
      )}
    </div>
  );
}
