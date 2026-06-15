"use client";

import { useMemo } from "react";
import useGameStore from "../../../stores/useGameStore";
import TopScorerRow from "../../../components/rows/topScorerPlayer";
import styles from "./topScorers.module.css";
export default function TopScorers() {
    const teams = useGameStore((state) => state.teams);

    const top20Scorers = useMemo(() => {
        const allScorers = teams.flatMap((team) =>
            team.squad
                .filter((player) => player.statistics.goals > 0)
                .map((player) => ({
                    ...player,
                    teamName: team.name,
                    teamShield: team.shield,
                })),
        );
        return allScorers
            .sort((a, b) => b.statistics.goals - a.statistics.goals)
            .slice(0, 20);
    }, [teams]);

    return (
        <section>
            <header>
                <h2>
                    ARTILHARIA <span>— TEMPORADA</span>
                </h2>
            </header>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Jogador</th>
                        <th>Clube</th>
                        <th>Posição</th>
                        <th>Gols</th>
                    </tr>
                </thead>
                <tbody>
                    {top20Scorers.length === 0 ? (
                        <tr>
                            <td colSpan={5} className={styles.message}>
                                Nenhum gol marcado ainda.
                            </td>
                        </tr>
                    ) : (
                        top20Scorers.map((player, index) => (
                            <TopScorerRow key={player.id} player={player} index={index} />
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
}
