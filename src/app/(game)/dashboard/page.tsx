"use client";

import useGameStore from "../../../stores/useGameStore";
import UserTeamStats from "./components/userTeamStats";
import MatchList from "./components/matchList";
import MiniStandings from "./components/miniStandings";
import styles from "./dashboard.module.css";
import SectionHeader from "../components/sectionHeader";

export default function Dashboard() {
  const season = useGameStore((state) => state.season);
  const simulateNextMatch = useGameStore((state) => state.simulateNextMatch);
  return (
    <section className={styles.dashboard}>
      <SectionHeader title="DASHBOARD" meta={[` — ${season}`]} />
      <UserTeamStats />
      <div className={styles.articlesContainer}>
        <MatchList type="upcoming" />
        <MatchList type="results" />
      </div>
      <button className="green-button" onClick={simulateNextMatch}>
        ▶ SIMULAR JOGO
      </button>
      <MiniStandings />
    </section>
  );
}
