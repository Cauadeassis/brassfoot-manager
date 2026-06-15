"use client";

import useGameStore from "../../../stores/useGameStore";
import MatchRow from "../../../components/rows/match";

export default function Calendar() {
  const userTeamId = useGameStore((state) => state.userTeamId);
  const calendar = useGameStore((state) => state.calendar);
  if (!userTeamId) return <p>Carregando calendário do campeonato...</p>;
  const userMatches = calendar
    .flatMap((round) => round.matches)
    .filter(
      (match) =>
        match.homeTeamId === userTeamId || match.awayTeamId === userTeamId,
    )
    .slice(0, 20);
  return (
    <section>
      <header>
        <h2>
          CALENDÁRIO <span>— RODADAS</span>
        </h2>
      </header>
      <div>
        {userMatches.length === 0 ? (
          <div className="text-muted">
            Nenhum jogo agendado para esta temporada.
          </div>
        ) : (
          userMatches.map((match) => (
            <MatchRow
              key={`${match.roundNumber}-${match.homeTeamId}-${match.awayTeamId}`}
              match={match}
            />
          ))
        )}
      </div>
    </section>
  );
}
