import { ReactNode } from "react";
import styles from "./mobilePlayer.module.css";
import { NationalityBadge, OverallBadge, PositionBadge } from "../../badges";
import { Player } from "../../../types/player";
import ShirtIcon, { Uniform } from "../../football-badges/shirts";
import useUIStore from "../../../stores/useUIStore";

interface MobilePlayerCardProps {
  player: Player;
  shirtNumber?: number;
  uniformDesign?: Uniform;
  isDisabled?: boolean;
  topRightContent?: ReactNode;
  actionButton?: {
    action: () => void;
    type: "buy" | "sell";
    label?: string;
  };
  customValue?: ReactNode;
}

export default function MobilePlayerCard({
  player,
  shirtNumber,
  uniformDesign,
  isDisabled = false,
  topRightContent,
  actionButton,
  customValue,
}: MobilePlayerCardProps) {
  const openPlayerModal = useUIStore((state) => state.openPlayerModal);

  return (
    <div
      className={`${styles.card} ${isDisabled ? styles.disabled : ""}`}
      onClick={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest("button, a, input, select, textarea")
        ) {
          return;
        }
        openPlayerModal(player.id);
      }}
    >
      <div className={styles.header}>
        <div className={styles.info}>
          <button
            type="button"
            className={styles.playerNameButton}
            onClick={() => openPlayerModal(player.id)}
            aria-label={`Ver detalhes de ${player.name}`}
          >
            <strong className={styles.name}>{player.name}</strong>
          </button>
          <div className={styles.badges}>
            <PositionBadge position={player.position} isMobile={true} />
            <OverallBadge overall={player.overall} />
            <NationalityBadge nationality={player.nationality} />
            <span className={styles.age}>{player.age} anos</span>
          </div>
        </div>

        <div className={styles.rightSide}>
          {shirtNumber !== undefined && uniformDesign !== undefined && (
            <ShirtIcon label={String(shirtNumber)} uniform={uniformDesign} />
          )}
          {topRightContent}
          {customValue}
        </div>
      </div>

      {actionButton && (
        <button
          onClick={actionButton.action}
          className={styles[actionButton.type]}
        >
          {actionButton.label ??
            (actionButton.type === "buy" ? "COMPRAR" : "VENDER")}
        </button>
      )}
    </div>
  );
}
