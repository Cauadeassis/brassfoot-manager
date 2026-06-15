"use client";

import { useState, useMemo } from "react";
import useGameStore from "../../../stores/useGameStore";
import SquadPlayerRow from "../../../components/rows/squadPlayer";
import type { Player } from "../../../types";
const POSITION_ORDER = ["GOL", "ZAG", "LD", "LE", "VOL", "MEI", "ATA"];

const squadSorters: Record<string, (a: Player, b: Player) => number> = {
  position: (a, b) =>
    POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position),
  overall: (a, b) => b.overall - a.overall,
  age: (a, b) => a.age - a.age,
};

export default function Squad() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("position");
  const userTeamId = useGameStore((state) => state.userTeamId);
  const teams = useGameStore((state) => state.teams);

  const userTeam = teams.find((team) => team.id === userTeamId);
  const squad = userTeam?.squad || [];
  const filteredAndSortedSquad = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return [...squad]
      .filter((player) => player.name.toLowerCase().includes(searchLower))
      .sort(squadSorters[sortCriteria] || squadSorters.position);
  }, [squad, searchQuery, sortCriteria]);

  if (!userTeam) return <p>Carregando elenco do clube...</p>;

  const starters = new Set(userTeam.startersId);

  return (
    <section>
      <header>
        <h2>
          ELENCO <span>— {userTeam.name.toUpperCase()}</span>
        </h2>
      </header>
      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar jogador..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="overall">Por Overall</option>
          <option value="position">Por Posição</option>
          <option value="age">Por Idade</option>
        </select>
      </div>
      <h3>Elenco ({squad.length} Jogadores)</h3>
      <ul className="elenco-lista">
        {filteredAndSortedSquad.length === 0 ? (
          <p className="text-muted">
            Nenhum jogador encontrado com esses filtros.
          </p>
        ) : (
          filteredAndSortedSquad.map((player) => (
            <SquadPlayerRow
              key={player.id}
              player={player}
              isStarter={starters.has(player.id)}
              showAction={true}
            />
          ))
        )}
      </ul>
    </section>
  );
}
