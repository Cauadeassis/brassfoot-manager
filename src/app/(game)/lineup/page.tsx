"use client";
import React, { useMemo } from "react";
import useGameStore from "../../../stores/useGameStore";
import SquadPlayerRow from "../../../components/rows/squadPlayer";
import FORMATIONS_DATA, {
  PlayerSlot,
  FormationType,
} from "../../../data/formations";
import { PlayStyle } from "../../../types/team";
import styles from "./lineup.module.css";
import { FiltersContainer, FormSelect } from "../../../filters/components";
import {
  formationOptions,
  playStyleOptions,
} from "../../../filters/selectOptions";
import SectionHeader from "../components/sectionHeader";
import { getSquad } from "../../../gameEngine/team";

interface PlayerProps {
  slot: PlayerSlot;
  name: string | null;
}

const Player = React.memo(({ slot, name }: PlayerProps) => (
  <div
    className={styles.player}
    style={{ top: `${slot.y}%`, left: `${slot.x}%` }}
  >
    <div className={styles.circle}>{slot.role || "?"}</div>
    <div className={styles.name}>{name ? name.split(" ")[0] : "—"}</div>
  </div>
));
Player.displayName = "Player";

export default function Lineup() {
  const userTeamId = useGameStore((state) => state.userTeamId);
  const changeTactics = useGameStore((state) => state.changeTactics);
  const userTeam = useGameStore((state) => state.teams[userTeamId!]);
  const playersMap = useGameStore((state) => state.players);
  const squad = useMemo(() => {
    if (!userTeam) return [];
    return getSquad({ team: userTeam, playersMap });
  }, [userTeam, playersMap]);
  const squadMap = useMemo(() => {
    return new Map(squad.map((player) => [player.id, player]));
  }, [squad]);
  const benchPlayers = useMemo(() => {
    if (!userTeam) return [];
    const startersSet = new Set(userTeam.squad.starterIds);
    return squad.filter((player) => !startersSet.has(player.id));
  }, [squad, userTeam?.squad.starterIds]);
  if (!userTeamId || !userTeam) {
    return <p>Carregando gerenciador tático...</p>;
  }
  const { formation, style: playStyle } = userTeam.tactics;
  const currentFormationConfig = FORMATIONS_DATA[formation];
  const currentSlots = currentFormationConfig.slots[playStyle];
  const handleFormationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newFormation = event.target.value as FormationType;
    changeTactics({ teamId: userTeamId, payload: { formation: newFormation } });
  };
  const handlePlayStyleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStyle = event.target.value as PlayStyle;
    changeTactics({ teamId: userTeamId, payload: { style: newStyle } });
  };
  return (
    <section className={styles.lineupSection}>
      <SectionHeader title="ESCALAÇÃO" meta={[` & TÁTICAS`]} />
      <FiltersContainer>
        <FormSelect
          value={formation}
          options={formationOptions}
          onChange={handleFormationChange}
        />
        <FormSelect
          value={playStyle}
          options={playStyleOptions}
          onChange={handlePlayStyleChange}
        />
      </FiltersContainer>
      <div className={styles.footballFieldContainer}>
        <img src="/FootballField.svg" alt="Campo de futebol" />
        {currentSlots.map((slot, index) => {
          const playerId = userTeam.squad.starterIds[index];
          const player = squadMap.get(playerId);

          return (
            <Player
              key={index}
              slot={slot}
              name={player ? player.name : null}
            />
          );
        })}
      </div>
      <h3>Reservas / Banco</h3>
      <div className="elenco-lista">
        {benchPlayers.length === 0 ? (
          <p className="text-muted">Nenhum jogador no banco.</p>
        ) : (
          benchPlayers.map((player) => (
            <SquadPlayerRow
              key={player.id}
              player={player}
              showAction={false}
            />
          ))
        )}
      </div>
    </section>
  );
}
