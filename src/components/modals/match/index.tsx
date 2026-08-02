"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import useGameStore from "../../../stores/useGameStore";
import useUIStore from "../../../stores/useUIStore";
import styles from "./match.module.css";
import MatchEngine from "../../../gameEngine/match/MatchEngine";
import { MatchStats, LogItem, Scoreboard } from "./components";
import { EventLog, MatchState } from "../../../types/match";

export default function MatchModal() {
  const activeMatch = useUIStore((state) => state.activeMatch);
  const closeMatchModal = useUIStore((state) => state.closeMatchModal);
  const processMatchResults = useGameStore((state) => state.finishMatch);
  const homeTeam = useGameStore((state) =>
    activeMatch ? state.teams[activeMatch.homeTeamId] : null,
  );
  const awayTeam = useGameStore((state) =>
    activeMatch ? state.teams[activeMatch.awayTeamId] : null,
  );
  const initialMatchState = {
    statistics: {
      currentMinute: 0,
      goals: {
        home: 0,
        away: 0,
      },
      shots: {
        home: 0,
        away: 0,
      },
      possession: {
        home: 0.5,
        away: 0.5,
      },
    },
    events: [],
  };
  const [state, setState] = useState<MatchState>(initialMatchState);

  const [logs, setLogs] = useState<EventLog[]>([]);
  const [status, setStatus] = useState({
    isFinished: false,
    message: "",
    isAccelerated: false,
  });
  const engineRef = useRef<MatchEngine | null>(null);
  useEffect(() => {
    if (status.isFinished || !activeMatch || !homeTeam || !awayTeam) return;
    const engine = new MatchEngine(homeTeam, awayTeam, {
      onTick: (newState) => setState(newState),
      onLog: (newLog) => setLogs((prev) => [newLog, ...prev]),
      onFinish: (finalState, msg, events) => {
        setState(finalState);
        setStatus({ isFinished: true, message: msg, isAccelerated: false });
        processMatchResults({
          matchId: activeMatch.id,
          homeGoals: finalState.statistics.goals.home,
          awayGoals: finalState.statistics.goals.away,
          events,
        });
      },
    });

    engineRef.current = engine;
    engine.start();
    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, [activeMatch, homeTeam, awayTeam, processMatchResults, status.isFinished]);
  useEffect(() => {
    setState(initialMatchState);
    setLogs([]);
    setStatus({
      isFinished: false,
      message: "",
      isAccelerated: false,
    });
  }, [activeMatch]);

  if (!activeMatch || !homeTeam || !awayTeam) return null;

  const handleAccelerate = () => {
    engineRef.current?.accelerate();
    setStatus((prev) => ({ ...prev, isAccelerated: true }));
  };

  const { goals, possession, shots, currentMinute } = state.statistics;

  return (
    <section className={styles.matchModal} role="dialog" aria-modal="true">
      <article className={styles.modalBox}>
        <Scoreboard
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeGoals={goals.home}
          awayGoals={goals.away}
          currentMinute={currentMinute}
        />
        <MatchStats
          homeShots={shots.home}
          awayShots={shots.away}
          homePossession={possession.home}
        />
        <output>
          {status.isFinished && (
            <div className={`opacity ${styles.logItem}`}>
              <span className={styles.minutes}>90'</span>
              <span className={styles.icon}>🏁</span>
              <span className={styles.text}>
                <strong>Fim da partida — {status.message}</strong>
              </span>
            </div>
          )}
          {logs.map((log) => (
            <LogItem key={log.id} log={log} />
          ))}
        </output>
        <div className={styles.partidaAcoes}>
          {!status.isFinished && !status.isAccelerated && (
            <button className="green-button" onClick={handleAccelerate}>
              ⏩ ACELERAR
            </button>
          )}

          {status.isFinished && (
            <button className="outline-button" onClick={closeMatchModal}>
              ✓ FECHAR
            </button>
          )}
        </div>
      </article>
    </section>
  );
}
