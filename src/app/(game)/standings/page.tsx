"use client";

import styles from "./standings.module.css";
import useGameStore from "../../../stores/useGameStore";
import StandingsRow from "../../../components/rows/standings";
import { getStandings } from "../../../gameEngine/standings";

export default function Standings() {
    const teams = useGameStore((state) => state.teams);
    const divisionAStandings = getStandings({ teams });
    return (
        <section className={styles.standingsSection}>
            <header>
                <h2>
                    CLASSIFICAÇÃO <span>— BRASILEIRÃO SÉRIE A</span>
                </h2>
            </header>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Clube</th>
                        <th>PJ</th>
                        <th>V</th>
                        <th>E</th>
                        <th>D</th>
                        <th>GP</th>
                        <th>GC</th>
                        <th>SG</th>
                        <th>PTS</th>
                    </tr>
                </thead>
                <tbody>
                    {divisionAStandings.length === 0 ? (
                        <tr>
                            <td colSpan={10}>Nenhum time cadastrado nesta divisão.</td>
                        </tr>
                    ) : (
                        divisionAStandings.map((team, index) => (
                            <StandingsRow
                                key={team.id}
                                team={team}
                                index={index}
                                variant="full"
                            />
                        ))
                    )}
                </tbody>
            </table>

            <div className="legenda-da-tabela">
                <p>
                    <span className="blue-color">■</span> Libertadores
                </p>
                <p>
                    <span className="red-color">■</span> Rebaixamento
                </p>
            </div>
        </section>
    );
}
