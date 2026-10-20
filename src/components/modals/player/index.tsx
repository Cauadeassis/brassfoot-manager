"use client";

import { useEffect, useRef } from "react";
import useGameStore from "../../../stores/useGameStore";
import useUIStore from "../../../stores/useUIStore";
import { getDefaultUniformDesign } from "../../../data/uniforms";
import { getCompetitionName } from "../../../filters/labels";
import { isContractActive } from "../../../gameEngine/contracts";
import { Skill } from "../../../types/player";
import { CompetitionId } from "../../../types/competition";
import { formatMoney } from "../../../utils";
import { PositionBadge, NationalityBadge, OverallBadge } from "../../badges";
import ShirtIcon from "../../football-badges/shirts";
import { getLayoutMode } from "../../../app/(game)/dashboard/_components/matchList";
import styles from "./player.module.css";

const SKILL_LABELS: Record<Skill, string> = {
  shooting: "Finalização",
  vision: "Visão",
  physical: "Físico",
  dribbling: "Drible",
  defense: "Defesa",
  reflexes: "Reflexos",
};

function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function getCompetitionLabel(competitionId: string): string {
  try {
    return getCompetitionName({ key: competitionId as CompetitionId });
  } catch {
    return competitionId;
  }
}

export default function PlayerModal() {
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const playerId = useUIStore((state) => state.activePlayerId);
  const closePlayerModal = useUIStore((state) => state.closePlayerModal);
  const player = useGameStore((state) =>
    playerId ? state.players[playerId] : undefined,
  );
  const teams = useGameStore((state) => state.teams);
  const currentDate = useGameStore((state) => state.currentDate);
  const layoutMode = getLayoutMode({ cardWidth: 480, compactWidth: 760 });

  useEffect(() => {
    if (!playerId) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePlayerModal();
    };
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [playerId, closePlayerModal]);

  if (!playerId || !player) return null;

  const team = player.currentTeamId ? teams[player.currentTeamId] : undefined;
  const shirtNumber = team?.squad.playerShirts[player.id];
  const uniform =
    team?.uniformDesign ?? getDefaultUniformDesign(player.nationality);
  const position = player.position;
  const historyEntries = Object.entries(player.history ?? {}).sort(
    ([first], [second]) => second.localeCompare(first),
  );
  const trophyEntries = Object.entries(player.trophies ?? {})
    .filter(([, years]) => years && years.length > 0)
    .sort(([first], [second]) => first.localeCompare(second));

  return (
    <section
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-modal-title"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePlayerModal();
      }}
    >
      <article className={styles.modal} data-layout={layoutMode} ref={modalRef}>
        <header>
          <ShirtIcon
            label={shirtNumber === undefined ? "—" : String(shirtNumber)}
            uniform={uniform}
            size={48}
          />
          <div className={styles.identity}>
            <div className={styles.identityTitle}>
              <h2 id="player-modal-title">{player.name}</h2>
              <span
                className={styles.identityFlag}
                role="img"
                aria-label={`Nacionalidade: ${player.nationality}`}
              >
                <NationalityBadge nationality={player.nationality} />
              </span>
              <span
                className={styles.identityOverall}
                aria-label={`Overall ${player.overall}`}
              >
                <OverallBadge overall={player.overall} />
              </span>
            </div>
            <div className={styles.identityMeta}>
              <PositionBadge position={position} />
              <strong>N° {shirtNumber ?? "—"}</strong>
              <strong>{team?.name ?? "Time"}</strong>
            </div>
          </div>
          <button
            type="button"
            ref={closeButtonRef}
            onClick={closePlayerModal}
            aria-label="Fechar visualização do jogador"
            title="Fechar"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <main>
          <section className={styles.overview} aria-label="Dados do jogador">
            <div>
              <span>Idade</span>
              <strong>{player.age} anos</strong>
            </div>
            <div>
              <span>Valor estimado</span>
              <strong>R$ {formatMoney(player.value)}</strong>
            </div>
            <div>
              <span>Stamina</span>
              <strong>{Math.round(player.stamina)}%</strong>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="skills-title">
            <div className={styles.skillList}>
              {(Object.entries(player.currentSkills) as [Skill, number][]).map(
                ([skill, currentValue]) => {
                  const potentialValue =
                    player.potentialSkills[
                      skill as keyof typeof player.potentialSkills
                    ] ?? currentValue;
                  const current = Math.max(0, Math.min(100, currentValue));
                  const potential = Math.max(0, Math.min(100, potentialValue));

                  return (
                    <div className={styles.skillRow} key={skill}>
                      <span className={styles.skillName}>
                        {SKILL_LABELS[skill]}
                      </span>
                      <div
                        className={styles.skillTrack}
                        role="img"
                        aria-label={`${SKILL_LABELS[skill]}: atual ${currentValue}, potencial ${potentialValue}`}
                      >
                        <span
                          className={styles.skillPotential}
                          style={{
                            bottom: `${current}%`,
                            height: `${Math.max(0, potential - current)}%`,
                          }}
                        />
                        <span
                          className={styles.skillCurrent}
                          style={{ height: `${current}%` }}
                        />
                      </div>
                      <span className={styles.skillValues}>
                        {currentValue}
                        <span aria-hidden="true"> / {potentialValue}</span>
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </section>

          {historyEntries.length > 0 && (
            <section className={styles.section} aria-labelledby="history-title">
              <h3 id="history-title">Histórico</h3>
              <div className={styles.recordList}>
                {historyEntries.map(([historyKey, stats]) => {
                  const separator = historyKey.indexOf("_");
                  const season = historyKey.slice(0, separator);
                  const competitionId = historyKey.slice(separator + 1);
                  const contributions =
                    stats.role === "attacker"
                      ? `${stats.goals} gols · ${stats.assists} assistências`
                      : `${stats.defenses} defesas`;

                  return (
                    <div className={styles.recordRow} key={historyKey}>
                      <strong>
                        {season} · {getCompetitionLabel(competitionId)}
                      </strong>
                      <span>
                        {stats.matchesPlayed} jogos · {contributions} ·{" "}
                        {stats.yellowCards} amarelos · {stats.redCards}{" "}
                        vermelhos
                      </span>
                      {teams[stats.teamId] && (
                        <small>{teams[stats.teamId].name}</small>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {trophyEntries.length > 0 && (
            <section
              className={styles.section}
              aria-labelledby="trophies-title"
            >
              <h3 id="trophies-title">Troféus</h3>
              <div className={styles.recordList}>
                {trophyEntries.map(([competitionId, years]) => (
                  <div className={styles.recordRow} key={competitionId}>
                    <strong>{getCompetitionLabel(competitionId)}</strong>
                    <span>
                      {years
                        ?.slice()
                        .sort((a, b) => b - a)
                        .join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
        <footer aria-labelledby="contract-title">
          <div className={styles.flexDiv}>
            <h3 id="contract-title">Contrato:</h3>
            <strong
              className={
                isContractActive(player.contract, currentDate)
                  ? styles.activeContract
                  : styles.inactiveContract
              }
            >
              {isContractActive(player.contract, currentDate)
                ? "Ativo"
                : currentDate < player.contract.startDate
                  ? "A iniciar"
                  : "Expirado"}
            </strong>
          </div>
          {player.contract ? (
            <div className={styles.contractDetails}>
              <span>
                {formatDate(player.contract.startDate)} –{" "}
                {formatDate(player.contract.endDate)}
              </span>
              <span>Salário: R$ {formatMoney(player.contract.salary)}</span>
            </div>
          ) : (
            <p className={styles.emptyMessage}>Sem contrato registrado.</p>
          )}
        </footer>
      </article>
    </section>
  );
}
