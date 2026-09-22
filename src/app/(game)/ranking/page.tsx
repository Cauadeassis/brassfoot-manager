"use client";

import React, { useMemo } from "react";
import useGameStore from "../../../stores/useGameStore";
import { TeamBadge } from "../../../components/badges";
import { Team } from "../../../types/team";
import styles from "./ranking.module.css";
import { getLastMatches } from "../../../gameEngine/match/state";
import { getMatchResult } from "../../../gameEngine/match/progression";
import { Result } from "../../../types/match";
import SectionHeader from "../_components/sectionHeader";
import LastMatches from "../../../components/lastMatches";

interface RankingTeamRowProps {
  team: Team;
  position: number;
  lastMatchesResults: Result[];
}

interface RankingTeam extends Team {
  lastMatchesResults: Result[];
}

function RankingTeamRow({
  team,
  position,
  lastMatchesResults,
}: RankingTeamRowProps) {
  return (
    <tr className={styles.rankingTeamRow}>
      <td>{position}</td>
      <td>
        <TeamBadge teamShield={team.shield} teamName={team.name} />
      </td>
      <td className={styles.score}>{Math.round(team.rankingScore)}</td>
      <td>
        <LastMatches results={lastMatchesResults} />
      </td>
    </tr>
  );
}

export default function Ranking() {
  const calendar = useGameStore((state) => state.calendar);
  const teams = Object.values(useGameStore((state) => state.teams));
  const rankedTeams = useMemo(() => {
    return [...teams]
      .sort((a, b) => b.rankingScore - a.rankingScore)
      .map((team) => ({
        ...team,
        lastMatchesResults: getLastMatches({
          calendar,
          targetTeamId: team.id,
        }).map((match) =>
          getMatchResult({
            scoredGoals:
              match.homeTeamId === team.id
                ? match.goals.home
                : match.goals.away,
            concededGoals:
              match.homeTeamId === team.id
                ? match.goals.away
                : match.goals.home,
          }),
        ),
      }));
  }, [teams, calendar]) as unknown as RankingTeam[];
  return (
    <section>
      <SectionHeader title="RANKING" meta={[` — MELHORES TIMES `]} />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
            <th>Pontos</th>
            <th>Últimas Partidas</th>
          </tr>
        </thead>
        <tbody>
          {rankedTeams.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.message}>
                Nenhum time encontrado.
              </td>
            </tr>
          ) : (
            rankedTeams.map((team, index) => (
              <RankingTeamRow
                key={team.id}
                team={team}
                position={index + 1}
                lastMatchesResults={team.lastMatchesResults}
              />
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
