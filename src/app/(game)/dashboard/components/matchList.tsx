import React, { useMemo } from "react";
import useGameStore from "../../../../stores/useGameStore";
import MatchRow, { getRoundLabel } from "../../../../components/rows/match";
import { getUpcomingMatches } from "../../../../gameEngine/match/state";
import { getCompetition } from "../../../../utils";

interface MatchListProps {
  type: "upcoming" | "results";
}

const MatchList = ({ type }: MatchListProps) => {
  const userTeamId = useGameStore((state) => state.userTeamId);
  const calendar = useGameStore((state) => state.calendar);
  const results = useGameStore((state) => state.results);

  const matches = useMemo(() => {
    if (type === "upcoming" && userTeamId) {
      const gameState = useGameStore.getState();
      return getUpcomingMatches({
        calendar: gameState.calendar,
        targetTeamId: userTeamId,
        desiredQuantity: 3,
      });
    }
    return [...results].slice(-4).reverse();
  }, [type, calendar, results, userTeamId]);
  const activeCompetitions = useGameStore((state) => state.competitions);
  return (
    <article>
      <h3>{type === "upcoming" ? "Próximos Jogos" : "Últimos Resultados"}</h3>
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
            return <MatchRow key={match.id} match={match} roundLabel={label} />;
          })
        )}
      </ul>
    </article>
  );
};

export default React.memo(MatchList);
