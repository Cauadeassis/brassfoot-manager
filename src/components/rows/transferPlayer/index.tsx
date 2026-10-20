"use client";

import { memo } from "react";
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
import useUIStore from "../../../stores/useUIStore";

export interface MarketPlayer extends Player {
  marketType: "free" | "club";
  originTeam?: Team | null;
}

interface TransferPlayerRowProps {
  marketPlayer: MarketPlayer;
  canAfford: boolean;
  disabledReason?: string;
  onPropose: (player: MarketPlayer) => void;
  layoutMode?: "desktop" | "compact" | "card";
}

function TransferPlayerRow({
  marketPlayer,
  canAfford,
  disabledReason,
  onPropose,
  layoutMode = "desktop",
}: TransferPlayerRowProps) {
  const openPlayerModal = useUIStore((state) => state.openPlayerModal);
  const { originTeam, id, value, position, age, nationality, overall, name } =
    marketPlayer;

  const handleBuyClick = () => {
    if (!canAfford) return;
    onPropose(marketPlayer);
  };

  if (layoutMode === "card") {
    return (
      <MobilePlayerCard
        player={marketPlayer}
        isDisabled={!canAfford}
        topRightContent={
          originTeam ? (
            <div>
              <TeamBadge
                teamShield={originTeam.shield}
                teamName={originTeam.name}
                isMobile={true}
              />
              {!canAfford && disabledReason && (
                <span className={styles.windowClosedTag}>{disabledReason}</span>
              )}
            </div>
          ) : (
            <span className={styles.freeAgentTag}>LIVRE</span>
          )
        }
        customValue={
          <span
            className={`${styles.valueTag} ${!canAfford ? styles.noFunds : ""}`}
          >
            {formatMoney(value)}
          </span>
        }
        actionButton={
          canAfford
            ? {
                action: handleBuyClick,
                type: "buy",
                label: originTeam ? "PROPOR" : "CONTRATAR",
              }
            : undefined
        }
      />
    );
  }

  const isCompact = layoutMode === "compact";
  return (
    <tr
      className={styles.transferPlayerRow}
      onClick={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest("button, a, input, select, textarea")
        ) {
          return;
        }
        openPlayerModal(id);
      }}
    >
      <td>
        <button
          type="button"
          className={styles.playerNameButton}
          onClick={() => openPlayerModal(id)}
          aria-label={`Ver detalhes de ${name}`}
        >
          {name}
        </button>
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
          onClick={
            isCompact && canAfford
              ? (event) => {
                  event.stopPropagation();
                  handleBuyClick();
                }
              : undefined
          }
          title={
            isCompact
              ? canAfford
                ? originTeam
                  ? "Clique para propor transferência"
                  : "Clique para contratar"
                : (disabledReason ?? "Sem fundos")
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
              {originTeam ? "PROPOR" : "CONTRATAR"}
            </button>
          ) : (
            <span className={styles.noFundsTag}>
              {disabledReason ?? "SEM FUNDOS"}
            </span>
          ))}
      </td>
    </tr>
  );
}

export default memo(TransferPlayerRow);
