"use client";

import useGameStore from "../../../stores/useGameStore";
import MatchRow, { getRoundLabel } from "../../../components/rows/match";
import { useMemo } from "react";
import { FiltersContainer, FormSelect } from "../../../filters/components";

import COMPETITIONS from "../../../data/competitions";
import { getTeamsOptions, monthsOptions } from "../../../filters/selectOptions";
import SectionHeader from "../components/sectionHeader";
import useFiltersStore from "../../../stores/useFilterStore";
import { isEligible } from "../../../gameEngine/generators/season";
import { getCompetition } from "../../../utils";
import { getCompetitionName } from "../../../filters/labels";
import { useIsMobile } from "../../../hooks";
import styles from "./matches.module.css"

export default function Calendar() {
  const calendar = useGameStore((state) => state.calendar);
  const teamsDict = useGameStore((state) => state.teams);
  const userTeamId = useGameStore((state) => state.userTeamId);
  const activeCompetitions = useGameStore((state) => state.competitions);
  const { month, teamId } = useFiltersStore((state) => state.calendarPage);
  const { generalCompetitionId: competitionId } = useFiltersStore(
    (state) => state.globalFilters,
  );
  const setFilter = useFiltersStore((state) => state.setFilter);
  const allMatches = useMemo(() => {
    return calendar.flatMap((day) => day.matches);
  }, [calendar]);
  const filteredMatches = useMemo(() => {
    return allMatches.filter((match) => {
      const matchMonth = parseInt(match.date.split("-")[1], 10) - 1;
      const isMonthMatch = month === "all" || matchMonth === month;
      const isCompetitionMatch = match.competitionId === competitionId;
      const isTeamMatch =
        teamId === "all" ||
        match.homeTeamId === teamId ||
        match.awayTeamId === teamId;
      return isMonthMatch && isCompetitionMatch && isTeamMatch;
    });
  }, [allMatches, month, competitionId, teamId]);
  const simplifiedTeams = useMemo(() => {
    let eligibleTeams = Object.values(teamsDict);
    if (competitionId !== null) {
      const competition = COMPETITIONS.find((c) => c.id === competitionId);
      if (competition) {
        eligibleTeams = eligibleTeams.filter((team) =>
          isEligible({ team, eligibility: competition.eligibility }),
        );
      }
    }

    return eligibleTeams
      .map((team) => ({ id: team.id, name: team.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [teamsDict, competitionId]);
  if (!userTeamId) return null;
  if (!calendar || calendar.length === 0) {
    return <p>Carregando calendário do campeonato...</p>;
  }

  const competitionName = useMemo(() => {
    if (!competitionId) return "Nenhuma competição selecionada";
    try {
      return getCompetitionName({ length: 1, key: competitionId });
    } catch (error) {
      console.error(error);
    }
  }, [competitionId]);

  const isMobile = useIsMobile(450);

  if (!competitionId) return (
    <div>
      <p>Selecione uma competição, por favor.</p>
    </div>
  )

  return (
    <section>
      <SectionHeader
        title="JOGOS"
        meta={[
          ` — ${competitionName}`,
          teamId !== "all" ? ` — ${teamsDict[teamId]?.name}` : null,
        ].filter(Boolean)}
      />

      <FiltersContainer>
        <FormSelect
          value={month}
          options={monthsOptions}
          onChange={(event) => {
            const val = event.target.value;
            setFilter(
              "calendarPage",
              "month",
              val === "all" ? "all" : Number(val),
            );
          }}
        />

        <FormSelect
          value={teamId}
          options={getTeamsOptions({ teams: simplifiedTeams, userTeamId })}
          onChange={(event) => {
            setFilter("calendarPage", "teamId", event.target.value);
          }}
        />
      </FiltersContainer>

      <div className={styles.matchesContainer}>
        {filteredMatches.length === 0 ? (
          <div className="text-muted">
            Nenhum jogo encontrado para estes filtros.
          </div>
        ) : (
          filteredMatches.map((match) => {
            const matchCompetition = getCompetition(match.competitionId);
            const matchCompetitionState = activeCompetitions?.find(
              (c) => c.id === match.competitionId,
            );
            const matchesInThisRoundCount =
              matchCompetitionState?.matches[match.round - 1]?.length || 0;

            const label = getRoundLabel({
              match,
              rules: matchCompetition!.rules,
              matchesInThisRoundCount,
            });

            return <MatchRow key={match.id} match={match} roundLabel={label} compact={isMobile} widthThatNameDisappears={724} />;
          })
        )}
      </div>
    </section>
  );
}
