"use client";
import React, { useMemo } from "react";
import useGameStore from "../../../stores/useGameStore";
import SquadPlayerRow from "../../../components/rows/squadPlayer";
import { FormationType } from "../../../data/formations";
import { PlayStyle } from "../../../types/team";
import styles from "./lineup.module.css";
import { FiltersContainer, FormSelect } from "../../../filters/components";
import {
  formationOptions,
  playStyleOptions,
} from "../../../filters/selectOptions";
import SectionHeader from "../_components/sectionHeader";
import { getSquad } from "../../../gameEngine/team";
import { getTeamBaseModifiers } from "../../../gameEngine/match/orchestrator";
import { SubstitutionLog } from "./components";
import FootballField from "../../../components/footballField";
import useFootballFieldData from "../../../components/footballField/useFootballFieldData";
import TacticsPanel from "../../../components/tacticsPanel";
import { getLayoutMode } from "../dashboard/_components/matchList";
export default function Lineup() {
  const userTeamId = useGameStore((state) => state.userTeamId);
  const changeTactics = useGameStore((state) => state.changeTactics);
  const userTeam = useGameStore((state) => state.teams[userTeamId!]);
  const playersMap = useGameStore((state) => state.players);
  const squad = useMemo(() => {
    if (!userTeam) return [];
    return getSquad({ team: userTeam, playersMap });
  }, [userTeam, playersMap]);
  const benchPlayers = useMemo(() => {
    if (!userTeam) return [];
    const startersSet = new Set(userTeam.squad.starterIds);
    return squad.filter((player) => !startersSet.has(player.id));
  }, [squad, userTeam?.squad.starterIds]);
  const modifiers = useMemo(() => {
    if (!userTeam) return null;
    return getTeamBaseModifiers({
      formation: userTeam.tactics.formation,
      style: userTeam.tactics.style,
    });
  }, [userTeam?.tactics.formation, userTeam?.tactics.style]);
  const layoutMode = getLayoutMode({ cardWidth: 300 });
  const { substitutionEvents } = useFootballFieldData({
    team: userTeam,
    playersMap,
  });
  if (!userTeamId || !userTeam || !modifiers) {
    return <p>Carregando gerenciador tático...</p>;
  }

  const { formation, style: playStyle } = userTeam.tactics;
  const handleFormationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newFormation = event.target.value as FormationType;
    changeTactics({
      teamId: userTeamId,
      payload: { formation: newFormation },
    });
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
      <div className={styles.fieldRow}>
        <aside>
          <TacticsPanel modifiers={modifiers} />
          <SubstitutionLog events={substitutionEvents} />
        </aside>
        <FootballField
          team={userTeam}
          playersMap={playersMap}
        />
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
              layoutMode={layoutMode}
            />
          ))
        )}
      </div>
    </section>
  );
}
