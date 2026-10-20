"use client";

import { formatMoney } from "../../../utils";
import useGameStore from "../../../stores/useGameStore";
import { Player } from "../../../types/player";
import styles from "./squadPlayer.module.css";
import { PositionBadge, NationalityBadge, OverallBadge } from "../../badges";
import { LayoutMode } from "../../../app/(game)/transfers/page";
import MobilePlayerCard from "../mobilePlayer";
import ShirtIcon, { Uniform } from "../../football-badges/shirts";
import useUIStore from "../../../stores/useUIStore";

interface SquadPlayerRowProps {
  player: Player;
  isStarter?: boolean;
  showAction?: boolean;
  shirtNumber?: number;
  uniformDesign: Uniform;
  layoutMode?: LayoutMode;
}

export default function SquadPlayerRow({
  player,
  isStarter = false,
  showAction = false,
  shirtNumber,
  uniformDesign,
  layoutMode = "desktop",
}: SquadPlayerRowProps) {
  const toggleTransferListing = useGameStore(
    (state) => state.toggleTransferListing,
  );
  const openPlayerModal = useUIStore((state) => state.openPlayerModal);
  const handleTransferListingClick = () => {
    if (toggleTransferListing) toggleTransferListing(player.id);
    else
      console.warn(
        `Ação de listagem não mapeada para o jogador: ${player.name}`,
      );
  };
  const transferListingLabel = player.market?.isTransferListed
    ? "RETIRAR DA LISTA"
    : "VENDER";
  if (layoutMode === "card") {
    return (
      <MobilePlayerCard
        player={player}
        shirtNumber={shirtNumber}
        uniformDesign={uniformDesign}
        topRightContent={
          isStarter && <span className={styles.starterTag}>TITULAR</span>
        }
        customValue={
          showAction && (
            <span className={styles.value}>{formatMoney(player.value)}</span>
          )
        }
        actionButton={
          showAction
            ? {
                action: handleTransferListingClick,
                type: "sell",
                label: transferListingLabel,
              }
            : undefined
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
    <div
      className={`${rowClasses} ${layoutMode}`}
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
      <span>
        <PositionBadge position={player.position} isMobile={isCompact} />
      </span>

      {shirtNumber !== undefined && (
        <ShirtIcon label={String(shirtNumber)} uniform={uniformDesign} />
      )}
      <button
        type="button"
        className={styles.playerNameButton}
        onClick={() => openPlayerModal(player.id)}
        aria-label={`Ver detalhes de ${player.name}`}
      >
        <span className={styles.name}>
          {player.name}
          {!isCompact && isStarter && <span>TITULAR</span>}
        </span>
      </button>
      <span className={styles.age}>{player.age}</span>
      <NationalityBadge nationality={player.nationality} />
      <OverallBadge overall={player.overall} />

      {showAction && (
        <>
          <span
            className={`${styles.value}`}
            onClick={
              isCompact
                ? (event) => {
                    event.stopPropagation();
                    handleTransferListingClick();
                  }
                : undefined
            }
            title={
              isCompact
                ? `Clique para ${transferListingLabel.toLowerCase()}`
                : undefined
            }
          >
            {formatMoney(player.value)}
          </span>
          {!isCompact && (
            <button
              type="button"
              className={styles.sellButton}
              onClick={handleTransferListingClick}
            >
              {transferListingLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}
