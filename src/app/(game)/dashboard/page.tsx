"use client";

import useGameStore from "../../../stores/useGameStore";
import UserTeamStats from "./components/userTeamStats";
import MatchList from "./components/matchList";
import MiniStandings from "./components/miniStandings";
import styles from "./dashboard.module.css";
import SectionHeader from "../components/sectionHeader";
import { MatchSimulationError } from "../../../errors";
import { toast } from "../../../stores/useToastStore";
import { useMemo } from "react";
import { getCompetitionName } from "../../../filters/labels";
import { CompetitionId } from "../../../types/competition";
import { HistoryKey } from "../../../types/team";

export default function Dashboard() {
  const season = useGameStore((state) => state.season);
  const calendar = useGameStore((state) => state.calendar);
  const currentDate = useGameStore((state) => state.currentDate);
  const userTeamId = useGameStore((state) => state.userTeamId);
  const userTeam = useGameStore((state) => state.teams[userTeamId!]);
  const simulateNextMatch = useGameStore((state) => state.simulateNextMatch);
  const advanceDay = useGameStore((state) => state.advanceDay);
  const hasMatchToday = useMemo(() => {
    const todaySchedule = calendar.find((day) => day.date === currentDate);
    if (!todaySchedule) return false;
    return todaySchedule.matches.some(
      (m) =>
        !m.simulated &&
        (m.homeTeamId === userTeamId || m.awayTeamId === userTeamId),
    );
  }, [calendar, currentDate, userTeamId]);

  function handleSimulateNextMatch() {
    try {
      simulateNextMatch();
    } catch (error) {
      if (error instanceof MatchSimulationError) {
        toast({ message: error.message, type: "error" });
      } else {
        console.error("Unexpected internal error:", error);
        toast({
          message: "Ocorreu um erro inesperado ao tentar simular a partida.",
          type: "error",
        });
      }
    }
  }

  function handleAdvanceDay() {
    try {
      advanceDay();
      toast({ message: "Dia avançado!", type: "ok" });
    } catch (error) {
      console.error(error);
      toast({ message: "Erro ao avançar o dia.", type: "error" });
    }
  }

  if (!userTeam) {
    return (
      <div className={styles.dashboard}>
        <p>Carregando dados do time...</p>
      </div>
    );
  }

  const nationalLeagueId = `${userTeam.nationality}_league` as CompetitionId;
  const historyKey = `${season}_${nationalLeagueId}` as HistoryKey;
  const getNationalLeagueName = () => {
    try {
      return getCompetitionName({ length: 1, key: nationalLeagueId });
    } catch (error) {
      console.error(error);
      return "Liga Nacional";
    }
  }
  const nationalLeagueName = getNationalLeagueName()
  return (
    <section className={styles.dashboard}>
      <SectionHeader title="DASHBOARD" meta={[` — ${season}`]} />
      <UserTeamStats
        nationalLeagueId={nationalLeagueId}
        historyKey={historyKey}
        nationalLeagueName={nationalLeagueName}
      />
      <div className={styles.articlesContainer}>
        <MatchList type="upcoming" />
        <MatchList type="results" />
      </div>

      {hasMatchToday ? (
        <button className="green-button" onClick={handleSimulateNextMatch}>
          JOGAR
        </button>
      ) : (
        <button className="green-button" onClick={handleAdvanceDay}>
          AVANÇAR DIA
        </button>
      )}

      {userTeam.type === "club" &&
        <MiniStandings
          nationalLeagueId={nationalLeagueId}
          historyKey={historyKey}
          nationalLeagueName={nationalLeagueName}
        />
      }
    </section>
  );
}
