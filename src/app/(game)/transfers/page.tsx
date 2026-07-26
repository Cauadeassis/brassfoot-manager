"use client";

import { useMemo } from "react";
import { useTableFilters } from "../../../hooks";
import useGameStore from "../../../stores/useGameStore";
import TransferPlayerRow, {
  MarketPlayer,
} from "../../../components/rows/transferPlayer";
import {
  FiltersContainer,
  FormSelect,
  FormInput,
} from "../../../filters/components";
import styles from "./transfers.module.css";
import {
  getTeamsOptions,
  getNationalityOptions,
  getPositionsOptions,
} from "../../../filters/selectOptions";
import getPositionsData from "../../../gameEngine/generators/positions";
import SectionHeader from "../components/sectionHeader";
import useFiltersStore, {
  TransferPlayerSortKey,
} from "../../../stores/useFilterStore";
import { Nationality } from "../../../data/nationalities";

export default function Transfers() {
  const userTeamId = useGameStore((state) => state.userTeamId);
  const teamsDict = useGameStore((state) => state.teams);
  const playersDict = useGameStore((state) => state.players);
  const modality = useGameStore((state) => state.modality);
  const notifications = useGameStore((state) => state.notifications);
  const acceptOffer = useGameStore((state) => state.acceptOffer);
  const rejectOffer = useGameStore((state) => state.rejectOffer);
  const season = useGameStore((state) => state.season);
  const setFilter = useFiltersStore((state) => state.setFilter);

  const userTeam = userTeamId ? teamsDict[userTeamId] : null;

  const {
    searchQuery,
    position,
    teamId,
    nationality,
    sortConfig,
    handlePositionChange,
    handleTeamChange,
    handleSort,
    getSortIcon,
  } = useTableFilters<TransferPlayerSortKey>({
    pageKey: "transferPage",
    userTeamId: userTeamId || "",
  });

  const POSITIONS_DATA = useMemo(
    () => (modality ? getPositionsData(modality) : null),
    [modality],
  );

  const positionsOptions = useMemo(
    () => getPositionsOptions({ modality }),
    [modality],
  );

  const simplifiedTeams = useMemo(
    () =>
      Object.values(teamsDict)
        .filter((t) => t.type === "club")
        .map(({ id, name }) => ({ id, name })),
    [teamsDict],
  );

  const filteredPlayers = useMemo(() => {
    if (!userTeam || !playersDict) return [];
    const availablePlayers: MarketPlayer[] = [];
    const queryLower = searchQuery.toLowerCase();
    const isClubUser = userTeam.type === "club";
    for (const player of Object.values(playersDict)) {
      if (position !== "all" && player.position !== position) continue;
      if (nationality !== "all" && player.nationality !== nationality) continue;
      if (queryLower && !player.name.toLowerCase().includes(queryLower))
        continue;
      const pTeamId = player.currentTeamId;
      const originTeam = pTeamId ? teamsDict[pTeamId] : null;

      if (teamId !== "all" && pTeamId !== teamId) continue;

      if (isClubUser) {
        if (!pTeamId) {
          availablePlayers.push({
            ...player,
            marketType: "free",
            originTeam: null,
          });
        } else if (pTeamId !== userTeamId && originTeam?.type === "club") {
          if (player.overall < 68 || player.age > 32) {
            availablePlayers.push({
              ...player,
              marketType: "club",
              originTeam,
            });
          }
        }
      } else {
        if (pTeamId && player.nationality === userTeam.nationality) {
          availablePlayers.push({ ...player, marketType: "club", originTeam });
        }
      }
    }
    return availablePlayers.slice(0, 20);
  }, [
    playersDict,
    teamsDict,
    userTeamId,
    userTeam,
    searchQuery,
    position,
    teamId,
    nationality,
    sortConfig,
    season,
  ]);

  if (!modality || !userTeamId || !POSITIONS_DATA) return null;

  return (
    <section className={styles.transfersSection}>
      <SectionHeader
        title="TRANSFERÊNCIAS"
        meta={[
          position !== "all"
            ? ` — ${POSITIONS_DATA[position as keyof typeof POSITIONS_DATA].label.plural}`
            : null,
          teamId !== "all" ? ` — ${teamsDict[teamId]?.name}` : null,
        ].filter(Boolean)}
      />

      <div>
        {notifications.map((notification, index) => (
          <div key={index} className={styles.notification}>
            <span className="icon">📬</span>
            <span>{notification.text}</span>
            <button className="green-button" onClick={() => acceptOffer(index)}>
              ACEITAR
            </button>
            <button
              className="outline-button"
              onClick={() => rejectOffer(index)}
            >
              RECUSAR
            </button>
          </div>
        ))}
      </div>

      <FiltersContainer>
        <FormInput
          placeholder="Buscar jogador..."
          value={searchQuery}
          onChange={(e) =>
            setFilter("transferPage", "searchQuery", e.target.value)
          }
        />
        <FormSelect
          value={position}
          options={positionsOptions}
          onChange={handlePositionChange}
        />
        <FormSelect
          value={teamId}
          options={getTeamsOptions({ teams: simplifiedTeams, userTeamId })}
          onChange={handleTeamChange}
        />
        <FormSelect
          value={nationality}
          options={getNationalityOptions({})}
          onChange={(e) =>
            setFilter(
              "transferPage",
              "nationality",
              e.target.value as "all" | Nationality,
            )
          }
        />
      </FiltersContainer>

      <table>
        <thead>
          <tr>
            <th>Jogador</th>
            <th>Pos</th>
            <th onClick={() => handleSort("age")} style={{ cursor: "pointer" }}>
              Idd{getSortIcon("age")}
            </th>
            <th>Nac</th>
            <th
              onClick={() => handleSort("overall")}
              style={{ cursor: "pointer" }}
            >
              Ovr{getSortIcon("overall")}
            </th>
            <th>Origem</th>
            <th
              onClick={() => handleSort("value")}
              style={{ cursor: "pointer" }}
            >
              Valor{getSortIcon("value")}
            </th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.message}>
                Não há jogadores à venda com estes filtros.
              </td>
            </tr>
          ) : (
            filteredPlayers.map((marketPlayer) => (
              <TransferPlayerRow
                key={marketPlayer.id}
                marketPlayer={marketPlayer}
                canAfford={
                  userTeam ? userTeam.money >= marketPlayer.value : false
                }
              />
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
