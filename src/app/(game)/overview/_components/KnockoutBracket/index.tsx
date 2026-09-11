"use client";

import { useMemo } from "react";
import styles from "./knockout.module.css";
import useGameStore from "../../../../../stores/useGameStore";
import useFiltersStore from "../../../../../stores/useFilterStore";
import SectionHeader from "../../../_components/sectionHeader";
import { Match } from "../../../../../types/match";

interface TeamLike {
  name: string;
  shield: string;
}

function getPhaseName(matchCount: number) {
  switch (matchCount) {
    case 16:
      return "16avos";
    case 8:
      return "Oitavas";
    case 4:
      return "Quartas";
    case 2:
      return "Semifinal";
    case 1:
      return "Final";
    default:
      return "Mata-Mata";
  }
}

interface BracketColumn {
  key: string;
  phaseName: string;
  matches: (Match | null)[];
  depth: number;
  side: "left" | "right";
}

export default function KnockoutBracket() {
  const calendar = useGameStore((state) => state.calendar);
  const teamsDict = useGameStore((state) => state.teams) as Record<
    string,
    TeamLike
  >;
  const competitionId = useFiltersStore(
    (state) => state.globalFilters.generalCompetitionId,
  );
  const competitionMatches = useMemo(() => {
    if (!competitionId) return [];
    return calendar
      .flatMap((day) => day.matches)
      .filter((match) => match.competitionId === competitionId);
  }, [calendar, competitionId]);
  const bracket = useMemo(() => {
    if (!competitionMatches || competitionMatches.length === 0) return null;
    const groupedByRound = competitionMatches.reduce(
      (acc, match) => {
        const round = match.round;
        if (!acc[round]) acc[round] = [];
        acc[round].push(match);
        return acc;
      },
      {} as Record<number, Match[]>,
    );
    const roundKeys = Object.keys(groupedByRound)
      .map(Number)
      .sort((a, b) => a - b);
    if (roundKeys.length === 0) return null;
    const firstRoundMatches = groupedByRound[roundKeys[0]];
    const baseMatchesCount =
      [16, 8, 4, 2].find((n) => n <= firstRoundMatches.length) || 2;
    const depthCount = Math.log2(baseMatchesCount) + 1;
    const phaseTargets = Array.from(
      { length: depthCount },
      (_, d) => baseMatchesCount / 2 ** d,
    );
    const phaseMatchesMap: Record<number, Match[]> = {};
    roundKeys.forEach((rk) => {
      const matchesInRound = groupedByRound[rk];
      const count = matchesInRound.length;
      const phaseIdx = phaseTargets.findIndex((target, idx) => {
        const nextTarget = phaseTargets[idx + 1] || 0;
        return count <= target && count > nextTarget;
      });
      if (phaseIdx !== -1) phaseMatchesMap[phaseIdx] = matchesInRound;
    });
    const leftColumns: BracketColumn[] = [];
    const rightColumns: BracketColumn[] = [];
    for (let d = 0; d < depthCount - 1; d++) {
      const expectedMatchesTotal = phaseTargets[d];
      const expectedPerSide = expectedMatchesTotal / 2;
      const actualMatches = phaseMatchesMap[d] || [];
      const sideMatches = Array.from({ length: expectedMatchesTotal }).map(
        (_, i) => actualMatches[i] || null,
      );
      const phaseName = getPhaseName(expectedMatchesTotal);
      leftColumns.push({
        key: `L-${d}`,
        phaseName,
        matches: sideMatches.slice(0, expectedPerSide),
        depth: d,
        side: "left",
      });
      rightColumns.push({
        key: `R-${d}`,
        phaseName,
        matches: sideMatches.slice(expectedPerSide),
        depth: d,
        side: "right",
      });
    }
    rightColumns.reverse();
    const finalActualMatches = phaseMatchesMap[depthCount - 1] || [];
    const finalMatch = finalActualMatches[0] || null;
    const rowCount = baseMatchesCount / 2;
    const totalColumns = leftColumns.length * 2 + 1;
    return {
      leftColumns,
      rightColumns,
      finalMatch,
      finalPhaseName: getPhaseName(1),
      rowCount,
      totalColumns,
    };
  }, [competitionMatches]);
  if (!bracket) {
    return (
      <div className={styles.emptyState}>
        <p>Nenhum confronto eliminatório encontrado.</p>
      </div>
    );
  }
  const {
    leftColumns,
    rightColumns,
    finalMatch,
    finalPhaseName,
    rowCount,
    totalColumns,
  } = bracket;
  const finalColumnIndex = leftColumns.length + 1;
  return (
    <section className={styles.bracketSection}>
      <SectionHeader title="CHAVEAMENTO" meta={[" — Mata-Mata"]} />
      <div className={styles.scroll}>
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${totalColumns}, max-content)`,
            gridTemplateRows: `auto repeat(${rowCount}, minmax(50px, 1fr))`,
          }}
        >
          {leftColumns.map((column, colIdx) => (
            <BracketColumnView
              key={column.key}
              column={column}
              columnIndex={colIdx + 1}
              teamsDict={teamsDict}
            />
          ))}

          <FinalMatchCard
            match={finalMatch}
            teamsDict={teamsDict}
            gridColumn={finalColumnIndex}
            rowCount={rowCount}
          />

          {rightColumns.map((column, colIdx) => (
            <BracketColumnView
              key={column.key}
              column={column}
              columnIndex={finalColumnIndex + 1 + colIdx}
              teamsDict={teamsDict}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BracketColumnView({
  column,
  columnIndex,
  teamsDict,
}: {
  column: BracketColumn;
  columnIndex: number;
  teamsDict: Record<string, TeamLike>;
}) {
  const span = 2 ** column.depth;
  const isSemi = column.matches.length === 1;

  return (
    <>
      {column.matches.map((match, i) => {
        const isTopOfPair = i % 2 === 0;
        const rowStart = i * span + 2;

        return (
          <div
            key={match?.id || `empty-${i}`}
            className={styles.match}
            style={{
              gridColumn: columnIndex,
              gridRow: `${rowStart} / span ${span}`,
            }}
          >
            <MatchCard match={match} teamsDict={teamsDict} />
            <span
              aria-hidden="true"
              className={[
                styles.connector,
                styles[column.side],
                isSemi
                  ? styles.straight
                  : isTopOfPair
                    ? styles.topOfPair
                    : styles.bottomOfPair,
              ].join(" ")}
            />
          </div>
        );
      })}
    </>
  );
}

interface TeamRowProps {
  shield?: string;
  score?: string;
  isWinner?: boolean;
}

function TeamRow({
  shield = "/BlankShield.svg",
  score = "-",
  isWinner = false,
}: TeamRowProps) {
  const winnerStyle = isWinner ? "styles.winner" : "";
  return (
    <div className={`${styles.teamRow} ${winnerStyle}`}>
      <img src={shield} alt="" className={styles.shield} />
      <span className={styles.score}>{score}</span>
    </div>
  );
}

function MatchCard({
  match,
  teamsDict,
}: {
  match: Match | null;
  teamsDict: Record<string, TeamLike>;
}) {
  if (!match) {
    return (
      <div className={styles.matchCard}>
        <TeamRow />
        <TeamRow />
      </div>
    );
  }

  const homeTeam = teamsDict[match.homeTeamId];
  const awayTeam = teamsDict[match.awayTeamId];
  const homeWon = match.goals.home > match.goals.away;
  const awayWon = match.goals.away > match.goals.home;

  return (
    <div className={styles.matchCard}>
      <TeamRow
        shield={homeTeam?.shield}
        score={match.goals.home.toString()}
        isWinner={homeWon}
      />
      <TeamRow
        shield={awayTeam?.shield}
        score={match.goals.away.toString()}
        isWinner={awayWon}
      />
    </div>
  );
}

function FinalMatchCard({
  match,
  teamsDict,
  gridColumn,
  rowCount,
}: {
  match: Match | null;
  teamsDict: Record<string, TeamLike>;
  gridColumn: number;
  rowCount: number;
}) {
  if (!match) {
    return (
      <div
        className={styles.finalWrapper}
        style={{ gridColumn, gridRow: `2 / span ${rowCount}` }}
      >
        <div className={styles.finalCard}>
          <TeamRow />
          <span>×</span>
          <TeamRow />
        </div>
      </div>
    );
  }

  const homeTeam = teamsDict[match.homeTeamId];
  const awayTeam = teamsDict[match.awayTeamId];
  const homeWon = match.goals.home > match.goals.away;
  const awayWon = match.goals.away > match.goals.home;

  return (
    <div
      className={styles.finalWrapper}
      style={{ gridColumn, gridRow: `2 / span ${rowCount}` }}
    >
      <div className={styles.finalCard}>
        <TeamRow
          shield={homeTeam?.shield}
          score={match.goals.home.toString()}
          isWinner={homeWon}
        />
        <span>×</span>
        <TeamRow
          shield={awayTeam?.shield}
          score={match.goals.away.toString()}
          isWinner={awayWon}
        />
      </div>
    </div>
  );
}
