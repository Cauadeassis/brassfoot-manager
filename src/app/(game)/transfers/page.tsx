"use client";

import { useState, useMemo } from "react";
import useGameStore from "../../../stores/useGameStore";
import TransferPlayerRow, {
  MarketPlayer,
} from "../../../components/rows/transferPlayer";
import POSITIONS_DATA from "../../../data/positions";
import styles from "./transfers.module.css";
import type { Position } from "../../../types";

export default function Transfers() {
  const freeAgents = useGameStore((state) => state.freeAgents);
  const notifications = useGameStore((state) => state.notifications);
  const acceptOffer = useGameStore((state) => state.acceptOffer);
  const rejectOffer = useGameStore((state) => state.rejectOffer);
  const userTeamId = useGameStore((state) => state.userTeamId);
  const teams = useGameStore((state) => state.teams);

  const userTeam = teams.find((team) => team.id === userTeamId);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState<number | "">("");
  const [priceOrder, setPriceOrder] = useState("");
  const filteredPlayers = useMemo(() => {
    if (!userTeam) return [];
    const available: MarketPlayer[] = freeAgents.map((player) => ({
      ...player,
      marketType: "free",
    }));
    teams.forEach((team) => {
      if (team.id === userTeamId) return;
      team.squad.forEach((player) => {
        if (player.overall < 68 || player.age > 32) {
          available.push({
            ...player,
            marketType: "club",
            originTeam: team,
          });
        }
      });
    });

    return available
      .filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter((player) => !positionFilter || player.position === positionFilter)
      .filter(
        (player) => teamFilter === "" || player.originTeam?.id === teamFilter,
      )
      .sort((a, b) => {
        if (priceOrder === "ascending") return a.value - b.value;
        if (priceOrder === "descending") return b.value - a.value;
        return b.overall - a.overall;
      })
      .slice(0, 20);
  }, [
    teams,
    freeAgents,
    userTeamId,
    searchTerm,
    positionFilter,
    teamFilter,
    priceOrder,
    userTeam,
  ]);

  return (
    <section className={styles.transfersSection}>
      <header>
        <h2>
          MERCADO <span>— TRANSFERÊNCIAS</span>
        </h2>
      </header>
      <div>
        {notifications.map((notification, index) => (
          <div key={index} className={styles.notification}>
            <span className="icon">📬</span>
            <span>{notification.text}</span>
            <button className="green-button" onClick={() => acceptOffer(index)}>
              ACCEPT
            </button>
            <button
              className="outline-button"
              onClick={() => rejectOffer(index)}
            >
              REJECT
            </button>
          </div>
        ))}
      </div>
      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar jogador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        >
          <option value="">Todas as Posições</option>
          {(Object.keys(POSITIONS_DATA) as Position[]).map((position) => (
            <option key={position} value={position}>
              {POSITIONS_DATA[position].label} ({position})
            </option>
          ))}
        </select>

        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(Number(e.target.value) || "")}
        >
          <option value="">Todos os Times</option>
          {teams
            .filter((t) => t.id !== userTeamId)
            .map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
        </select>

        <select
          value={priceOrder}
          onChange={(e) => setPriceOrder(e.target.value)}
        >
          <option value="">Ordenar por preço</option>
          <option value="ascending">Menor preço</option>
          <option value="descending">Maior preço</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Jogador</th>
            <th>Pos</th>
            <th>Ide</th>
            <th>Nac</th>
            <th>Ovr</th>
            <th>Origem</th>
            <th>Valor</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="message"
                style={{ textAlign: "center", padding: "20px" }}
              >
                Não há jogadores à venda com estes filtros.
              </td>
            </tr>
          ) : (
            filteredPlayers.map((player) => (
              <TransferPlayerRow
                key={player.id}
                player={player}
                canAfford={userTeam ? userTeam.money >= player.value : false}
              />
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
