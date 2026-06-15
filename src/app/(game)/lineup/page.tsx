"use client";

import useGameStore from "../../../stores/useGameStore";
import SquadPlayerRow from "../../../components/rows/squadPlayer";
import FORMATIONS from "../../../data/formations";
import { organizeSquad } from "../../../gameEngine/tactics";
import type { FormationType, GameState, PlayStyle } from "../../../types";
import styles from "./lineup.module.css";
export default function Lineup() {
  const userTeamId = useGameStore((state) => state.userTeamId);
  const teams = useGameStore((state) => state.teams);
  const userTeam = teams.find((team) => team.id === userTeamId);
  const squad = userTeam?.squad || [];

  if (!userTeam) return <p>Carregando gerenciador tático...</p>;

  const { formation, style } = userTeam.tactics;
  const currentFormationConfig = FORMATIONS[formation];
  const handleFormationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newFormation = event.target.value as FormationType;
    const newStartersId = organizeSquad({
      squad,
      positions: FORMATIONS[newFormation].positions,
    });
    useGameStore.setState((state: GameState) => {
      const team = state.teams.find((t) => t.id === userTeamId);
      if (team) {
        team.tactics.formation = newFormation;
        team.startersId = newStartersId;
      }
    });
  };

  const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyle = event.target.value as PlayStyle;
    useGameStore.setState((state: GameState) => {
      const team = state.teams.find((t) => t.id === userTeamId);
      if (team) team.tactics.style = newStyle;
    });
  };

  const handleSave = () => alert("✓ Escalação e táticas salvas com sucesso!");
  let currentStarterOffset = 0;
  const linesWithOffsets = currentFormationConfig.lines.map((line) => {
    const playersInLine = line[0] as number;
    const positions = line.slice(1) as string[];
    const startIdx = currentStarterOffset;
    currentStarterOffset += playersInLine;
    return { playersInLine, positions, startIdx };
  });
  const startersSet = new Set(userTeam.startersId);
  const benchPlayers = squad.filter((player) => !startersSet.has(player.id));

  return (
    <section className={styles.lineupSection}>
      <header>
        <h2>
          ESCALAÇÃO <span>& TÁTICAS</span>
        </h2>
      </header>
      <div className="flex-row mb16">
        <label>FORMAÇÃO</label>
        <select value={formation} onChange={handleFormationChange}>
          <option value="4-3-3">4-3-3</option>
          <option value="4-4-2">4-4-2</option>
          <option value="4-2-3-1">4-2-3-1</option>
        </select>

        <label>ESTILO</label>
        <select value={style} onChange={handleStyleChange}>
          <option value="balanced">Equilibrado</option>
          <option value="offensive">Ofensivo</option>
          <option value="defensive">Defensivo</option>
        </select>

        <button className="green-button" onClick={handleSave}>
          ✓ SALVAR
        </button>
      </div>
      <div className={styles.campoVisual}>
        {linesWithOffsets.map((lineData, lineIndex) => {
          const percentY =
            85 - (lineIndex / (currentFormationConfig.lines.length - 1)) * 70;
          return (
            <div
              key={lineIndex}
              className={styles.linhaDaFormacao}
              style={{ top: `${percentY}%` }}
            >
              {Array.from({ length: lineData.playersInLine }).map((_, i) => {
                const absoluteIndex = lineData.startIdx + i;
                const playerId = userTeam.startersId[absoluteIndex];
                const player = playerId
                  ? squad.find((p) => p.id === playerId)
                  : null;

                return (
                  <div key={i} className={styles.jogador}>
                    <div className={styles.circuloDoJogador}>
                      {lineData.positions[i] || "?"}
                    </div>
                    <div className={styles.nomeDoJogador}>
                      {player ? player.name.split(" ")[0] : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
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
