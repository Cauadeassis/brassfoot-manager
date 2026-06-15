"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useModalStore } from "../../stores/useModalStore";
import ChosenOptionModal from "../../components/modals/chosenOption";
import COMPETITIONS from "../../data/competitions";
import TEAMS from "../../data/teams";
import NATIONALITIES_DATA from "../../data/nationalities";
import FORMATIONS from "../../data/formations";
import { organizeSquad, generateSquad } from "../../gameEngine/teamManager";
import useGameStore from "../../stores/useGameStore";
import type { Competition, Team } from "../../types";
import { OverallBadge, SerieBadge } from "../../components/badges";

import styles from "./selector.module.css";

export default function NewGame() {
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const setInitialState = useGameStore((state) => state.setInitialState);

  const [step, setStep] = useState<"competition" | "team">("competition");
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<
    string | null
  >(null);
  const [activeDivision, setActiveDivision] = useState<"all" | "A" | "B">(
    "all",
  );

  const sortedCompetitions = useMemo(
    () => [...COMPETITIONS].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const { totalEligibleTeams, filteredTeams } = useMemo(() => {
    if (!selectedCompetitionId)
      return { totalEligibleTeams: [], filteredTeams: [] };

    const activeCompetition = COMPETITIONS.find(
      (competition) => competition.id === selectedCompetitionId,
    );
    if (!activeCompetition)
      return { totalEligibleTeams: [], filteredTeams: [] };

    const eligible = TEAMS.filter((team) => {
      const { region, teamType, nationality, minimumOverall } =
        activeCompetition.eligibility;
      if (teamType && team.type !== teamType) return false;
      if (nationality && team.nationality !== nationality) return false;
      if (region) {
        const teamRegion =
          NATIONALITIES_DATA[
            team.nationality as keyof typeof NATIONALITIES_DATA
          ]?.region;
        if (teamRegion !== region) return false;
      }
      return !(minimumOverall && team.overall < minimumOverall);
    });

    const sortedEligible = [...eligible].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    const filtered =
      activeDivision === "all"
        ? sortedEligible
        : sortedEligible.filter((team) => team.division === activeDivision);

    return { totalEligibleTeams: sortedEligible, filteredTeams: filtered };
  }, [selectedCompetitionId, activeDivision]);

  const handleCompetitionClick = (competition: Competition) => {
    openModal({
      name: competition.name,
      shield: competition.shield,
      description: competition.description || "Sem descrição",
      onConfirm: () => {
        setSelectedCompetitionId(competition.id);
        setStep("team");
      },
    });
  };

  const handleTeamClick = (chosenTeam: Team) => {
    openModal({
      name: chosenTeam.name,
      shield: chosenTeam.shield,
      description:
        (selectedCompetitionId &&
          chosenTeam.competitionDescriptions?.[selectedCompetitionId]) ||
        "Sem descrição",
      onConfirm: () => {
        const teamsWithSquads = totalEligibleTeams.map((team) => {
          const squad = generateSquad(team);
          return {
            ...team,
            squad,
            startersId: organizeSquad({
              squad,
              positions: FORMATIONS[team.tactics.formation].positions,
            }),
          };
        });
        setInitialState({
          competitionId: selectedCompetitionId,
          userTeamId: chosenTeam.id,
          teams: teamsWithSquads,
          calendar: [],
          season: 2026,
          currentRound: 1,
          freeAgents: [],
          notifications: [],
          results: [],
          activeMatch: null,
        });
        useGameStore.getState().generateCalendar();
        router.push("/dashboard");
      },
    });
  };

  const handleBack = () => {
    setSelectedCompetitionId(null);
    setActiveDivision("all");
    setStep("competition");
  };

  return (
    <div>
      {step === "competition" && (
        <section
          className={`${styles.selectContainer} ${styles.competitionSelector}`}
        >
          <header>
            <h1>
              BRASFOOT <strong>MANAGER</strong>
            </h1>
            <p>Escolha a competição para iniciar sua carreira</p>
          </header>

          <div className={styles.grid}>
            {sortedCompetitions.map((competition) => (
              <button
                key={competition.id}
                className={styles.card}
                onClick={() => handleCompetitionClick(competition)}
              >
                <img src={competition.shield} alt={competition.name} />
                <h2>{competition.name}</h2>
              </button>
            ))}
          </div>
        </section>
      )}
      {step === "team" && (
        <section className={`${styles.selectContainer} ${styles.teamSelector}`}>
          <header>
            <button onClick={handleBack}>← Voltar</button>
            <h1>
              BRASFOOT <strong>MANAGER</strong>
            </h1>
            <p>Escolha seu clube para iniciar a carreira</p>
          </header>

          <nav
            className={styles.filtersContainer}
            aria-label="Filtro de Divisões"
          >
            <button
              className={activeDivision === "all" ? "ativo" : ""}
              onClick={() => setActiveDivision("all")}
            >
              Todos
            </button>
            <button
              className={activeDivision === "A" ? "ativo" : ""}
              onClick={() => setActiveDivision("A")}
            >
              Série A
            </button>
            <button
              className={activeDivision === "B" ? "ativo" : ""}
              onClick={() => setActiveDivision("B")}
            >
              Série B
            </button>
          </nav>

          <div className={styles.grid}>
            {filteredTeams.map((team) => (
              <button
                key={team.id}
                className={styles.card}
                onClick={() => handleTeamClick(team)}
              >
                <img src={team.shield} alt={team.name} />
                <h2>{team.name}</h2>
                <OverallBadge overall={team.overall} />
                {team.type === "club" && <SerieBadge serie={team.division} />}
              </button>
            ))}
            {filteredTeams.length === 0 && (
              <div className={styles.messageContainer}>
                <p>Nenhum time disponível nesta divisão.</p>
              </div>
            )}
          </div>
        </section>
      )}
      <ChosenOptionModal />
    </div>
  );
}
