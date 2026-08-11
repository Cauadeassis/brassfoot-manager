import { ReactNode } from "react";
import styles from "./mobilePlayer.module.css";
import { NationalityBadge, OverallBadge, PositionBadge } from "../../badges";
import { Player } from "../../../types/player";
interface MobilePlayerCardProps {
  player: Player;
  isDisabled?: boolean;
  topRightContent?: ReactNode;
  actionButton?: {
    action: () => void;
    type: "buy" | "sell";
  };
  customValue?: ReactNode;
}

export default function MobilePlayerCard({
  player,
  isDisabled = false,
  topRightContent,
  actionButton,
  customValue,
}: MobilePlayerCardProps) {
  return (
    <div className={`${styles.card} ${isDisabled ? styles.disabled : ""}`}>
      <div className={styles.header}>
        <div className={styles.info}>
          <strong className={styles.name}>{player.name}</strong>
          <div className={styles.badges}>
            <PositionBadge position={player.position} isMobile={true} />
            <OverallBadge overall={player.overall} />
            <NationalityBadge nationality={player.nationality} />
            <span className={styles.age}>{player.age} anos</span>
          </div>
        </div>

        <div className={styles.rightSide}>
          {topRightContent}
          {customValue}
        </div>
      </div>

      {actionButton &&
        <button onClick={actionButton.action} className={styles[actionButton.type]}>{actionButton.type === "buy" ? "COMPRAR" : "VENDER"}</button>
      }
    </div>
  );
}
