"use client";
import useGameStore from "../../../stores/useGameStore";
import type { Match } from "../../../types";
import styles from "./match.module.css";
interface MatchRowProps {
    match: Match;
}
export default function MatchRow({ match }: MatchRowProps) {
    const teams = useGameStore((state) => state.teams);
    const userTeamId = useGameStore((state) => state.userTeamId);
    const homeTeam = teams.find((team) => team.id === match.homeTeamId);
    const awayTeam = teams.find((team) => team.id === match.awayTeamId);
    if (!homeTeam || !awayTeam) return null;
    const isHome = match.homeTeamId === userTeamId;
    const isUserInvolved =
        match.homeTeamId === userTeamId || match.awayTeamId === userTeamId;
    const getResultClass = (): string => {
        if (!match.simulated) return "";
        if (!userTeamId || !isUserInvolved) return "dim-color";
        if (match.homeGoals === match.awayGoals) return "yellow-color";
        const didHomeWin = match.homeGoals > match.awayGoals;
        const didUserWin = isHome ? didHomeWin : !didHomeWin;
        return didUserWin ? "green-color" : "red-color";
    };
    return (
        <div className={styles.matchRow}>
            <span>ROD {match.roundNumber}</span>
            <div className={`${styles.teamsContainer} ${getResultClass()}`}>
                <span>
                    <img src={homeTeam.shield} alt={homeTeam.name} />
                    <p>{homeTeam.name}</p>
                </span>
                <p>
                    {match.simulated ? `${match.homeGoals} – ${match.awayGoals}` : "×"}
                </p>
                <span>
                    <img src={awayTeam.shield} alt={awayTeam.name} />
                    <p>{awayTeam.name}</p>
                </span>
            </div>
            {isUserInvolved && (
                <span className={`${styles.localTag} ${isHome ? styles.home : ""}`}>
                    {isHome ? "CASA" : "FORA"}
                </span>
            )}
            {!match.simulated && <span>PENDENTE</span>}
        </div>
    );
}
