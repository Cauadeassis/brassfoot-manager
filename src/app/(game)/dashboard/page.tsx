"use client";

"use client";

import useGameStore from "../../../stores/useGameStore";
import { overallLimits } from "../../../utils";
import styles from "./dashboard.module.css";
import MatchRow from "../../../components/rows/match";
import StandingsRow from "../../../components/rows/standings";
import { getStandings, getTeamPosition } from "../../../gameEngine/standings";

export default function Dashboard() {
  console.log("Dashboard renderizado!")
  const { season, teams, calendar, results, simulateNextMatch } =
    useGameStore();
  const userTeamId = useGameStore((state) => state.userTeamId);
  const userTeam = teams.find((team) => team.id === userTeamId);
  if (!userTeam) return <p>Carregando dados do treinador...</p>;
  const goalDifference =
    userTeam.statistics.goalsFor - userTeam.statistics.goalsAgainst;
  const position = getTeamPosition({ teams, teamId: userTeam.id });
  const positionColor = [1, 2, 3].includes(position)
    ? "green-color"
    : "yellow-color";
  const overallColor =
    overallLimits.find(({ min }) => userTeam.overall >= min)?.color || "";
  const upcomingMatches = calendar
    .flatMap((round) => round.matches)
    .filter(
      (m) =>
        !m.simulated &&
        (m.homeTeamId === userTeamId || m.awayTeamId === userTeamId),
    )
    .slice(0, 3);

  const latestResults = [...results].slice(-4).reverse();
  const topTeams = getStandings({ teams }).slice(0, 6);
  const isSeasonOver = upcomingMatches.length === 0;

  return (
    <section className={styles.dashboard}>
      <header>
        <h2>
          DASHBOARD — <span>{season}</span>
        </h2>
      </header>

      <div className={styles.dashCards}>
        <div>
          <p>Overall</p>
          <span className={overallColor}>{userTeam.overall}</span>
        </div>
        <div>
          <p>Posição</p>
          <span className={positionColor}>{position}°</span>
        </div>
        <div>
          <p>Pontos</p>
          <span className="green-color">{userTeam.statistics.points}</span>
        </div>
        <div>
          <p>Saldo Gols</p>
          <span className={goalDifference >= 0 ? "green-color" : "red-color"}>
            {goalDifference >= 0 ? `+${goalDifference}` : goalDifference}
          </span>
        </div>
        <div>
          <p>Finanças</p>
          <span className={userTeam.money >= 0 ? "green-color" : "red-color"}>
            R$ {userTeam.money.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>

      <div className={styles.articlesContainer}>
        <article>
          <h3>Próximos Jogos</h3>
          <ul>
            {isSeasonOver ? (
              <div className="text-muted">Temporada encerrada!</div>
            ) : (
              upcomingMatches.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))
            )}
          </ul>
          <button className="green-button" onClick={simulateNextMatch}>
            {isSeasonOver ? "🔄 NOVA TEMPORADA" : "▶ SIMULAR JOGO"}
          </button>
        </article>

        <article>
          <h3>Últimos Resultados</h3>
          <ul>
            {latestResults.length === 0 ? (
              <div className="text-muted">Nenhum resultado ainda.</div>
            ) : (
              latestResults.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))
            )}
          </ul>
        </article>
      </div>

      <section>
        <h3>Top 6 Classificação</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Clube</th>
              <th>PJ</th>
              <th>SG</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>
            {topTeams.map((team, index) => (
              <StandingsRow
                key={team.id}
                team={team}
                index={index}
                variant="mini"
              />
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}
