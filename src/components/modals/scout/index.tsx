"use client";

import { useMemo } from "react";
import useGameStore from "../../../stores/useGameStore";
import useUIStore from "../../../stores/useUIStore";
import { getTeamBaseModifiers } from "../../../gameEngine/match/orchestrator";
import { getLastMatches } from "../../../gameEngine/match/state";
import { getTeamPosition } from "../../../gameEngine/managers/standings";
import { getMatchResult } from "../../../gameEngine/match/progression";
import { CompetitionId } from "../../../types/competition";
import { getCompetitionName } from "../../../filters/labels";
import LastMatches from "../../lastMatches";
import TacticsPanel from "../../tacticsPanel";
import FootballField from "../../footballField";
import { useWindowWidth } from "../../../hooks";
import styles from "./scout.module.css";
import tacticsStyles from "../../tacticsPanel/tacticsPanel.module.css";

const getLayoutMode = ({
  cardWidth = 700,
  compactWidth = 960,
}: {
  cardWidth?: number;
  compactWidth?: number;
} = {}) => {
  const width = useWindowWidth();

  if (width <= cardWidth) return "card";
  if (width <= compactWidth) return "compact";
  return "desktop";
};

export default function ScoutModal() {
  const activeScoutTeamId = useUIStore((state) => state.activeScoutTeamId);
  const closeScoutModal = useUIStore((state) => state.closeScoutModal);
  const calendar = useGameStore((state) => state.calendar);
  const season = useGameStore((state) => state.season);
  const teams = useGameStore((state) => state.teams);
  const players = useGameStore((state) => state.players);
  const layoutMode = getLayoutMode({ cardWidth: 500, compactWidth: 700 });
  const isCardLayout = layoutMode === "card";
  const team = activeScoutTeamId ? teams[activeScoutTeamId] : null;
  const allTeams = useMemo(() => Object.values(teams), [teams]);

  const modifiers = useMemo(() => {
    if (!team) return null;
    return getTeamBaseModifiers({
      formation: team.tactics.formation,
      style: team.tactics.style,
    });
  }, [team]);
  const lastMatchesResults = useMemo(() => {
    if (!team) return [];
    return getLastMatches({
      calendar,
      targetTeamId: team.id,
      desiredQuantity: 5,
    }).map((match) =>
      getMatchResult({
        scoredGoals:
          match.homeTeamId === team.id ? match.goals.home : match.goals.away,
        concededGoals:
          match.homeTeamId === team.id ? match.goals.away : match.goals.home,
      }),
    );
  }, [calendar, team]);

  if (!activeScoutTeamId || !team || !modifiers) return null;

  const competitionId =
    `${team.nationality}_league_${team.division}` as CompetitionId;
  const position = getTeamPosition({
    teams: allTeams,
    teamId: team.id,
    competitionId,
    season,
    division: team.division,
  });
  const nationalLeagueName = (() => {
    try {
      return getCompetitionName({ length: 1, key: competitionId });
    } catch (error) {
      console.error(error);
      return "Liga Nacional";
    }
  })();

  const rankingLabel = isCardLayout ? "Pontuação" : "Pontuação no Ranking";

  return (
    <section
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scout-title"
      onClick={closeScoutModal}
    >
      <article
        className={styles.modalBox}
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <div className={styles.teamInformation}>
            <h2 id="scout-title">{team.name}</h2>
            <div className={styles.teamMeta}>
              <p>
                {position > 0
                  ? `${position}º (${nationalLeagueName})`
                  : `Sem posição (${nationalLeagueName})`}
              </p>
              <p>
                {rankingLabel}: {Math.round(team.rankingScore)}
              </p>
            </div>
            {isCardLayout && (
              <LastMatches
                results={lastMatchesResults}
                size="large"
                showLabels
              />
            )}
          </div>
          <button
            type="button"
            onClick={closeScoutModal}
            aria-label="Fechar scout"
            className={styles.closeButton}
            title="Fechar"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6.75 6.75 17.25 17.25M17.25 6.75 6.75 17.25" />
            </svg>
          </button>
        </header>

        <main>
          <div>
            <FootballField team={team} playersMap={players} mode="mini" />
          </div>
          <aside>
            <TacticsPanel
              modifiers={modifiers}
              className={tacticsStyles.scoutTacticsPanel}
            />
            {!isCardLayout && (
              <section className={styles.formSection}>
                <h3>Últimas partidas</h3>
                <LastMatches
                  results={lastMatchesResults}
                  size="large"
                  showLabels
                />
              </section>
            )}
          </aside>
        </main>
      </article>
    </section>
  );
}
