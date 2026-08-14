import React, { useMemo } from "react";
import useGameStore from "../../../../stores/useGameStore";
import MatchRow, { getRoundLabel } from "../../../../components/rows/match";
import { getUpcomingMatches } from "../../../../gameEngine/match/state";
import { getCompetition } from "../../../../utils";
import { useWindowWidth } from "../../../../hooks";
import { LayoutMode } from "../../transfers/page";

interface MatchListProps {
  type: "upcoming" | "results";
}

interface GetLayoutModeProps {
  cardWidth?: number;
  compactWidth?: number
}

export const getLayoutMode = ({ cardWidth = 500, compactWidth = 768 }: GetLayoutModeProps): LayoutMode => {
  const width = useWindowWidth();
  return width <= cardWidth ? "card" : width <= compactWidth ? "compact" : "desktop";
};

const MatchList = ({ type }: MatchListProps) => {
  const userTeamId = useGameStore((state) => state.userTeamId);
  const calendar = useGameStore((state) => state.calendar);
  const results = useGameStore((state) => state.results);
  const activeCompetitions = useGameStore((state) => state.competitions);
  const layoutMode = getLayoutMode({});
  console.log(layoutMode)
  const matches = useMemo(() => {
    if (!userTeamId) return [];
    const upcomingMatches = getUpcomingMatches({
      calendar,
      targetTeamId: userTeamId,
      desiredQuantity: 3,
    });

    if (type === "upcoming") {
      return upcomingMatches;
    }

    if (type === "results") {
      const opponentIds = upcomingMatches.map((m) =>
        m.homeTeamId === userTeamId ? m.awayTeamId : m.homeTeamId,
      );

      const opponentsRecentMatches = opponentIds
        .map((opponentId) => {
          for (let i = results.length - 1; i >= 0; i--) {
            const match = results[i];
            if (
              match.homeTeamId === opponentId ||
              match.awayTeamId === opponentId
            ) {
              return match;
            }
          }
          return null;
        })
        .filter((match) => match !== null);
      const uniqueMatches = opponentsRecentMatches.filter(
        (match, index, self) =>
          index === self.findIndex((m) => m.id === match?.id),
      );

      return uniqueMatches;
    }

    return [];
  }, [type, calendar, results, userTeamId]);

  return (
    <article>
      <h3>
        {type === "upcoming" ? "Próximos Jogos" : "Resultados dos adversários"}
      </h3>
      <ul>
        {matches.length === 0 ? (
          <div className="text-muted">
            {type === "upcoming"
              ? "Temporada encerrada!"
              : "Nenhum resultado ainda."}
          </div>
        ) : (
          matches.map((match) => {
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
            return (
              <MatchRow
                key={match.id}
                match={match}
                roundLabel={label}
                layoutMode={layoutMode === "desktop" ? "compact" : layoutMode}
              />
            );
          })
        )}
      </ul>
    </article>
  );
};

export default React.memo(MatchList);
