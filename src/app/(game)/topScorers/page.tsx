"use client";

import { useMemo } from "react";
import getPositionsData from "../../../gameEngine/generators/positions";
import useGameStore from "../../../stores/useGameStore";
import TopScorerRow from "../../../components/rows/topScorerPlayer";
import styles from "./topScorers.module.css";
import { Player, PlayerStatistics } from "../../../types/player";
import {
  FiltersContainer,
  FormInput,
  FormSelect,
  FormButton,
} from "../../../filters/components";
import {
  getPositionsOptions,
  getTeamsOptions,
} from "../../../filters/selectOptions";
import { useTableFilters } from "../../../hooks";
import SectionHeader from "../components/sectionHeader";
import useFiltersStore, { ScorerSortKey } from "../../../stores/useFilterStore";
import { getSquad } from "../../../gameEngine/team";
import { getCompetitionName } from "../../../filters/labels";
import { getLayoutMode } from "../dashboard/components/matchList";
import { getPlayerStats } from "../../../gameEngine/player";
import { CompetitionId } from "../../../types/competition";

export interface ScorerPlayer extends Player {
  teamName: string;
  teamShield: string;
  activeStats: PlayerStatistics;
}
export default function TopScorers() {
  const teamsDict = useGameStore((state) => state.teams);
  const userTeamId = useGameStore((state) => state.userTeamId);
  const season = useGameStore((state) => state.season);
  const modality = useGameStore((state) => state.modality);
  const playersMap = useGameStore((state) => state.players);
  const competitionsDict = useGameStore((state) => state.competitions) || {};
  const setFilter = useFiltersStore((state) => state.setFilter);
  const layoutMode = getLayoutMode({ cardWidth: 550, compactWidth: 950 });
  const competitionId = useFiltersStore(
    (state) => state.topScorersPage.competitionId || "all"
  );

  const {
    searchQuery,
    position,
    isUserTeamSelected,
    teamId,
    sortConfig,
    handlePositionChange,
    handleToggleTeamFilter,
    handleTeamChange,
    handleSort,
    getSortIcon,
  } = useTableFilters<ScorerSortKey>({
    pageKey: "topScorersPage",
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
    () => Object.values(teamsDict).map(({ id, name }) => ({ id, name })),
    [teamsDict],
  );
  const competitionOptions = useMemo(() => {
    const opts = Object.values(competitionsDict).map((c) => ({
      value: c.id,
      label: getCompetitionName({ length: 1, key: c.id })
    }));
    return [{ value: "all", label: "Todas as Competições" }, ...opts];
  }, [competitionsDict]);
  const top20Scorers = useMemo(() => {
    const queryLower = searchQuery.toLowerCase();
    const filtered: ScorerPlayer[] = [];
    for (const team of Object.values(teamsDict)) {
      if (teamId !== "all" && team.id !== teamId) continue;
      for (const player of getSquad({ team, playersMap })) {
        if (position !== "all" && player.position !== position) continue;
        if (position !== "GK" && player.position === "GK") continue;
        if (queryLower && !player.name.toLowerCase().includes(queryLower)) continue;
        const aggregatedStats = getPlayerStats({ player, season, competitionId });
        const isRelevant =
          aggregatedStats.role === "attacker"
            ? aggregatedStats.goals > 0 || aggregatedStats.assists > 0
            : aggregatedStats.defenses > 0;
        if (!isRelevant) continue;
        filtered.push({
          ...player,
          teamName: team.name,
          teamShield: team.shield,
          activeStats: aggregatedStats,
        });
      }
    }

    const { key, direction } = sortConfig;
    const multiplier = direction === "asc" ? 1 : -1;
    const statKeys = ["goals", "assists", "matchesPlayed", "defenses"];

    return filtered
      .sort((a, b) => {
        const isStat = statKeys.includes(key);
        const valA = isStat ? (a.activeStats as any)[key] : (a as any)[key];
        const valB = isStat ? (b.activeStats as any)[key] : (b as any)[key];
        return ((valA ?? 0) - (valB ?? 0)) * multiplier;
      })
      .slice(0, 20);
  }, [
    teamsDict,
    searchQuery,
    position,
    teamId,
    sortConfig,
    season,
    competitionId,
    playersMap,
  ]);

  if (!modality || !userTeamId || !POSITIONS_DATA) return null;

  const competitionName = useMemo(() => {
    if (competitionId === "all") return "Geral";
    try {
      return getCompetitionName({ length: 1, key: competitionId });
    } catch (error) {
      return "Competição desconhecida";
    }
  }, [competitionId]);

  const emptyMessage = position === "GK" ? "Nenhuma defesa registrada ainda." : "Nenhum gol marcado ainda.";

  return (
    <section>
      <SectionHeader
        title="ARTILHARIA"
        meta={[
          ` — ${competitionName}`,
          position !== "all" ? ` — ${POSITIONS_DATA[position].label.plural}` : null,
          teamId !== "all" ? ` — ${teamsDict[teamId]?.name}` : null,
        ].filter(Boolean)}
        defaultMeta=" — top 20"
      />

      <FiltersContainer>
        <FormInput
          placeholder="Buscar jogador..."
          value={searchQuery}
          onChange={(e) => setFilter("topScorersPage", "searchQuery", e.target.value)}
        />
        <FormSelect
          value={position}
          options={positionsOptions}
          onChange={handlePositionChange}
        />
        <FormSelect
          value={teamId}
          options={getTeamsOptions({ teams: simplifiedTeams })}
          onChange={handleTeamChange}
        />
        <FormSelect
          value={competitionId}
          options={competitionOptions}
          onChange={(e) => setFilter("topScorersPage", "competitionId", e.target.value as CompetitionId | "all")}
        />
        <FormButton isActive={isUserTeamSelected} onClick={handleToggleTeamFilter}>
          {isUserTeamSelected ? "Todos os times" : "Meu time"}
        </FormButton>
      </FiltersContainer>
      {layoutMode === "card" ? (
        <div className={styles?.mobileList || "mobile-scorers-list"}>
          {top20Scorers.length === 0 ? (
            <p className={styles?.message || "text-muted"}>{emptyMessage}</p>
          ) : (
            top20Scorers.map((scorerPlayer, index) => (
              <TopScorerRow
                key={scorerPlayer.id}
                scorerPlayer={scorerPlayer}
                index={index}
                layoutMode={layoutMode}
              />
            ))
          )}
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Jogador</th>
              <th>Time</th>
              <th>Posição</th>
              <th onClick={() => handleSort("matchesPlayed")} style={{ cursor: "pointer" }}>
                Partidas {getSortIcon("matchesPlayed")}
              </th>
              {position === "GK" ? (
                <th onClick={() => handleSort("defenses")} style={{ cursor: "pointer" }}>
                  Defesas {getSortIcon("defenses")}
                </th>
              ) : (
                <>
                  <th onClick={() => handleSort("goals")} style={{ cursor: "pointer" }}>
                    Gols {getSortIcon("goals")}
                  </th>
                  <th onClick={() => handleSort("assists")} style={{ cursor: "pointer" }}>
                    Assistências {getSortIcon("assists")}
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {top20Scorers.length === 0 ? (
              <tr>
                <td colSpan={position === "GK" ? 6 : 7} className={styles?.message || "text-muted"}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              top20Scorers.map((scorerPlayer, index) => (
                <TopScorerRow
                  key={scorerPlayer.id}
                  scorerPlayer={scorerPlayer}
                  index={index}
                  layoutMode={layoutMode}
                />
              ))
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
