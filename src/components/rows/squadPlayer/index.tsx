"use client";

import { formatMoney } from "../../../utils";
import useGameStore from "../../../stores/useGameStore";
import { Player } from "../../../types/player";
import styles from "./squadPlayer.module.css";
import { PositionBadge, NationalityBadge, OverallBadge } from "../../badges";

interface SquadPlayerRowProps {
  player: Player;
  isStarter?: boolean;
  showAction?: boolean;
  isMobile?: boolean;
}

export default function SquadPlayerRow({
  player,
  isStarter = false,
  showAction = false,
  isMobile = false,
}: SquadPlayerRowProps) {
  const sellPlayer = useGameStore((state) => state.sellPlayer);

  const handleSellClick = () => {
    if (sellPlayer) sellPlayer(player.id);
    else
      console.warn(`Ação de venda não mapeada para o jogador: ${player.name}`);
  };
  const rowClasses = `${styles.playerRow} ${
    isMobile && isStarter ? styles.starterMobile : ""
  }`;
  return (
    <div className={rowClasses}>
      <span>
        <PositionBadge position={player.position} isMobile={isMobile} />
      </span>
      <p className={styles.name}>
        {player.name}
        {!isMobile && isStarter && <span>TITULAR</span>}
      </p>
      <span className={styles.age}>{player.age}</span>
      <NationalityBadge nationality={player.nationality} />
      <OverallBadge overall={player.overall} />
      {showAction && (
        <>
          <span
            className={`${styles.value} ${isMobile ? styles.mobileSellAction : ""}`}
            onClick={isMobile ? handleSellClick : undefined}
            title={isMobile ? "Clique para vender" : undefined}
          >
            {formatMoney(player.value)}
          </span>
          {!isMobile && <button onClick={handleSellClick}>VENDER</button>}
        </>
      )}
    </div>
  );
}
