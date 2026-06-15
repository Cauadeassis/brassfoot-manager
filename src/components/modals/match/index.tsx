"use client";

import { useEffect, useState, useRef } from "react";
import useGameStore from "../../../stores/useGameStore";
import type { SimulationState, MatchEvent } from "../../../types";
import { GameStore } from "../../../stores/useGameStore";
import { createSimulationState } from "../../../gameEngine/matchSimulator";
import {
    generateEvents,
    processEvent,
} from "../../../gameEngine/matchEvents";
interface EventLog {
    id: string;
    html: string;
}

export default function MatchModal() {
    const activeMatch = useGameStore((state) => state.activeMatch);
    const teams = useGameStore((state) => state.teams);
    const closeMatchModal = useGameStore((state) => state.closeMatchModal);
    const finishMatch = useGameStore((state) => state.finishMatch);
    const [stats, setStats] = useState<SimulationState | null>(null);
    const [logs, setLogs] = useState<EventLog[]>([]);
    const [isAccelerated, setIsAccelerated] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const simStateRef = useRef<SimulationState | null>(null);
    const eventsRef = useRef<MatchEvent[]>([]);
    const homeTeam = teams.find((team) => team.id === activeMatch?.homeTeamId);
    const awayTeam = teams.find((team) => team.id === activeMatch?.awayTeamId);
    useEffect(() => {
        if (!activeMatch || !homeTeam || !awayTeam) return;
        setLogs([]);
        setIsAccelerated(false);
        setIsFinished(false);
        setResultMessage("");
        const initialState = createSimulationState({
            homeTeamId: activeMatch.homeTeamId,
            awayTeamId: activeMatch.awayTeamId,
        });

        simStateRef.current = initialState;
        eventsRef.current = generateEvents({ homeTeam, awayTeam });
        setStats({ ...initialState });
        const tickRate = isAccelerated ? 30 : 120;

        const interval = setInterval(() => {
            const state = simStateRef.current;
            if (!state) return;

            const tickStep = isAccelerated ? 5 : 1;
            let newLogs: EventLog[] = [];

            for (let tick = 0; tick < tickStep && state.currentMinute < 90; tick++) {
                state.currentMinute++;
                const currentEvents = eventsRef.current.filter(
                    (e) => e.minute === state.currentMinute,
                );

                currentEvents.forEach((event) => {
                    const htmlOutput = processEvent({
                        event,
                        state,
                        homeShield: homeTeam.shield,
                        awayShield: awayTeam.shield,
                    });

                    if (htmlOutput)
                        newLogs.push({
                            id: Math.random().toString(36).substr(2, 9),
                            html: htmlOutput,
                        });
                });
            }
            if (newLogs.length > 0) {
                setLogs((prev) => [...newLogs, ...prev]);
            }
            const visualVariance = (Math.random() - 0.5) * 0.12;
            state.homePossession = Math.max(
                0,
                Math.min(1, state.homePossession + visualVariance),
            );
            setStats({ ...state });
            if (state.currentMinute >= 90) {
                clearInterval(interval);
                setIsFinished(true);
                const msg =
                    state.homeGoals === state.awayGoals
                        ? `Empate, de ${state.homeGoals} a ${state.awayGoals}!`
                        : state.homeGoals > state.awayGoals
                            ? `${homeTeam.name} vence de ${state.homeGoals} a ${state.awayGoals}!`
                            : `${awayTeam.name} vence fora de casa!`;

                setResultMessage(msg);
                finishMatch({
                    matchId: activeMatch.id,
                    homeGoals: state.homeGoals,
                    awayGoals: state.awayGoals,
                });
            }
        }, tickRate);

        return () => clearInterval(interval);
    }, [activeMatch, isAccelerated]);
    if (!activeMatch || !homeTeam || !awayTeam || !stats) return null;

    const homePossessionPercent = Math.round(stats.homePossession * 100);

    return (
        <section
            id="match-modal"
            className="aberto"
            role="dialog"
            aria-modal="true"
        >
            <article className="modal-box">
                <header>
                    <div className="placar-container">
                        <div className="team-container">
                            <img src={homeTeam.shield} alt="Mandante" />
                            <h2>{homeTeam.name}</h2>
                        </div>
                        <div className="score-container">
                            <span>{stats.homeGoals}</span>
                            <p>:</p>
                            <span>{stats.awayGoals}</span>
                        </div>
                        <div className="team-container">
                            <img src={awayTeam.shield} alt="Visitante" />
                            <h2>{awayTeam.name}</h2>
                        </div>
                    </div>
                    <p id="minutes-container">{stats.currentMinute}'</p>
                </header>

                <div className="statistics-container">
                    <div>
                        <span>{homePossessionPercent}%</span>
                        <p>POSSE</p>
                        <span>{100 - homePossessionPercent}%</span>
                    </div>
                    <div>
                        <span>{stats.homeShots}</span>
                        <p>CHUTES</p>
                        <span>{stats.awayShots}</span>
                    </div>
                </div>
                <output
                    id="log-partida"
                    style={{ overflowY: "auto", maxHeight: "250px" }}
                >
                    {isFinished && (
                        <div className="log-evento opacity">
                            <span className="minutes">90'</span>
                            <span className="icon">🏁</span>
                            <span className="text">
                                <strong>Fim da partida — {resultMessage}</strong>
                            </span>
                        </div>
                    )}
                    {logs.map((log) => (
                        <div key={log.id} dangerouslySetInnerHTML={{ __html: log.html }} />
                    ))}
                </output>

                <div className="partida-acoes">
                    {!isFinished ? (
                        <button
                            className="green-button"
                            onClick={() => setIsAccelerated(true)}
                            style={{ display: isAccelerated ? "none" : "inline-block" }}
                        >
                            ⏩ ACELERAR
                        </button>
                    ) : (
                        <button className="outline-button" onClick={closeMatchModal}>
                            ✓ FECHAR
                        </button>
                    )}
                </div>
            </article>
        </section>
    );
}
