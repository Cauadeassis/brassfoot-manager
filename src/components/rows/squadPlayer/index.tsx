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
}

export default function SquadPlayerRow({
  player,
  isStarter = false,
  showAction = false,
}: SquadPlayerRowProps) {
  const sellPlayer = useGameStore((state) => state.sellPlayer);
  const handleSellClick = () => {
    if (sellPlayer) sellPlayer(player.id);
    else
      console.warn(`Ação de venda não mapeada para o jogador: ${player.name}`);
  };

  return (
    <div className={`${styles.playerRow}`}>
      <span>
        <PositionBadge position={player.position} />
      </span>
      <p className={styles.name}>
        {player.name}
        {isStarter && <span>TITULAR</span>}
      </p>
      <span className={styles.age}>{player.age}</span>
      <NationalityBadge nationality={player.nationality} />
      <OverallBadge overall={player.overall} />
      {showAction && (
        <>
          <span className={styles.value}>{formatMoney(player.value)}</span>
          <button onClick={handleSellClick}>VENDER</button>
        </>
      )}
    </div>
  );
}
