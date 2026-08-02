"use client";

import { useState, useMemo } from "react";
import useGameStore from "../../../stores/useGameStore";
import SquadPlayerRow from "../../../components/rows/squadPlayer";
import { Position } from "../../../types/player";
import { Player } from "../../../types/player";
import { positionGroupOptions } from "../../../filters/selectOptions";
import { GROUP_LABELS } from "../../../filters/labels";
import {
  FormButton,
  FormInput,
  FormSelect,
  FiltersContainer,
} from "../../../filters/components";
import { playerSortOptions } from "../../../filters/selectOptions";
import SectionHeader from "../components/sectionHeader";
import useFiltersStore from "../../../stores/useFilterStore";
import { getSquad } from "../../../gameEngine/team";
const POSITION_ORDER = ["GOL", "ZAG", "LD", "LE", "VOL", "MEI", "ATA"];
const POSITION_GROUPS: Record<PositionGroup, Position[]> = {
  attackers: ["CA", "PE", "PD"],
  goalkeepers: ["GK"],
  defenders: ["ZA", "LE", "LD"],
  midfielders: ["MC", "MD", "ME", "MA", "VOL"],
};

export type PositionGroup =
  "attackers" | "goalkeepers" | "defenders" | "midfielders";

const squadSorters: Record<string, (a: Player, b: Player) => number> = {
  position: (a, b) =>
    POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position),
  overall: (a, b) => b.overall - a.overall,
  age: (a, b) => a.age - b.age,
};

export type LineupType = "all" | "starters" | "reserves";
const LINEUP_LABELS: Record<LineupType, string> = {
  all: "Todos",
  starters: "Titulares",
  reserves: "Reservas",
};
const LINEUP_MODES = Object.keys(LINEUP_LABELS) as LineupType[];

export default function Squad() {
  const userTeamId = useGameStore((state) => state.userTeamId);
  if (!userTeamId) return;
  const userTeam = useGameStore((state) => state.teams[userTeamId]);
  const { searchQuery, playerSort, positionGroup, lineupStatus } =
    useFiltersStore((state) => state.squadPage);
  const setFilter = useFiltersStore((state) => state.setFilter);
  const playersMap = useGameStore((state) => state.players);
  const squad = getSquad({ team: userTeam, playersMap }) || [];
  const startersId = useMemo(
    () => new Set(userTeam?.squad.starterIds || []),
    [userTeam?.squad.starterIds],
  );

  const filteredAndSortedSquad = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return [...squad]
      .filter((player) => {
        const matchesName = player.name.toLowerCase().includes(searchLower);
        const isStarter = startersId.has(player.id);
        const matchesStatus =
          lineupStatus === "all"
            ? true
            : lineupStatus === "starters"
              ? isStarter
              : !isStarter;
        const matchesGroup =
          positionGroup === "all"
            ? true
            : POSITION_GROUPS[positionGroup]?.includes(player.position);

        return matchesName && matchesStatus && matchesGroup;
      })
      .sort(squadSorters[playerSort] || squadSorters.position);
  }, [squad, searchQuery, playerSort, lineupStatus, positionGroup, startersId]);
  const handleCycleLineupFilter = () => {
    const currentIndex = LINEUP_MODES.indexOf(lineupStatus);
    const nextIndex = (currentIndex + 1) % LINEUP_MODES.length;
    setFilter("squadPage", "lineupStatus", LINEUP_MODES[nextIndex]);
  };
  if (!userTeam) return <p>Carregando elenco do clube...</p>;
  const numbersHelper =
    positionGroup === "all" ? "jogadores" : GROUP_LABELS[positionGroup];
  const additionalH3 = `${filteredAndSortedSquad.length} ${numbersHelper}`;

  return (
    <section>
      <SectionHeader
        title="ELENCO"
        meta={[
          positionGroup !== "all" ? ` — ${GROUP_LABELS[positionGroup]}` : null,
          lineupStatus !== "all" ? ` — ${LINEUP_LABELS[lineupStatus]}` : null,
        ]}
      />

      <FiltersContainer>
        <FormInput
          placeholder="Buscar jogador..."
          value={searchQuery}
          onChange={(event) =>
            setFilter("squadPage", "searchQuery", event.target.value)
          }
        />

        <FormSelect
          value={playerSort}
          options={playerSortOptions}
          onChange={(event) =>
            setFilter(
              "squadPage",
              "playerSort",
              event.target.value as "overall" | "position" | "age",
            )
          }
        />

        <FormSelect
          value={positionGroup}
          options={positionGroupOptions}
          onChange={(event) => {
            setFilter(
              "squadPage",
              "positionGroup",
              event.target.value as PositionGroup | "all",
            );
          }}
        />

        <FormButton type="button" onClick={handleCycleLineupFilter}>
          {LINEUP_LABELS[lineupStatus]}
        </FormButton>
      </FiltersContainer>
      <h3>{additionalH3}</h3>
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
              isStarter={startersId.has(player.id)}
              showAction={true}
            />
          ))
        )}
      </ul>
    </section>
  );
}
