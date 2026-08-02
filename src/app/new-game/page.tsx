"use client";
import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import useUIStore from "../../stores/useUIStore";
import NATIONALITIES_DATA, { Nationality } from "../../data/nationalities";
import useGameStore from "../../stores/useGameStore";
import generateSeason from "../../gameEngine/generators/season";
import { Team } from "../../types/team";
import TeamCard from "../components";
import styles from "./selector.module.css";
import TEAMS from "../../data/teams";
import {
  FiltersContainer,
  FormButton,
  FormSelect,
} from "../../filters/components";
import {
  getNationalityOptions,
  regionOptions,
} from "../../filters/selectOptions";
import { Region } from "../../types/competition";
import useFiltersStore from "../../stores/useFilterStore";
import { Player } from "../../types/player";
import {
  generateSquad,
  generateTeam,
  setStarters,
} from "../../gameEngine/team";
import { GameState } from "../../types/state";
import { VirtuosoGrid } from "react-virtuoso";
const modalityMap = {
  feminine: { icon: "♀️", label: "Feminino" },
  masculine: { icon: "♂️", label: "Masculino" },
};

const teamTypeMap = {
  club: "Clubes",
  national: "Seleções",
};

export default function NewGame() {
  const router = useRouter();
  const openModal = useUIStore((state) => state.openCardModal);
  const modality = useGameStore((state) => state.modality);
  const loadState = useGameStore((state) => state.loadState);
  const setModality = useGameStore((state) => state.setModality);
  const handleOpenModalityModal = useCallback(() => {
    openModal([
      {
        name: "Futebol Masculino",
        icon: modalityMap.masculine.icon,
        description:
          "Assuma o comando dos maiores clubes e seleções do mundo na modalidade masculina.",
        canCancel: true,
        onConfirm: () => setModality({ modality: "masculine" }),
      },
      {
        name: "Futebol Feminino",
        icon: modalityMap.feminine.icon,
        description:
          "Escreva a história do futebol e construa a sua dinastia na modalidade feminina.",
        canCancel: true,
        onConfirm: () => setModality({ modality: "feminine" }),
      },
    ]);
  }, [modality, openModal, setModality]);

  const teams = useMemo(() => {
    return Object.values(TEAMS).reduce(
      (acc, rawTeam) => {
        const team = generateTeam({ baseData: rawTeam, modality });
        acc[team.id] = team;
        return acc;
      },
      {} as Record<string, Team>,
    );
  }, [modality]);
  const { teamType, region, nationality, division } = useFiltersStore(
    (state) => state.startGamePage,
  );
  const setFilter = useFiltersStore((state) => state.setFilter);
  const handleChangeTeamType = () => {
    const nextType = teamType === "club" ? "national" : "club";
    setFilter("startGamePage", "teamType", nextType);
    setFilter("startGamePage", "nationality", "all");
    if (nextType === "national") setFilter("startGamePage", "division", "A");
  };

  const handleChangeDivision = () => {
    const nextDivision = division === "A" ? "B" : "A";
    setFilter("startGamePage", "division", nextDivision);
  };

  const handleChangeRegion = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = event.target.value as "all" | Region;
    setFilter("startGamePage", "region", newRegion);
    setFilter("startGamePage", "nationality", "all");
  };

  const filteredTeams = useMemo(() => {
    return Object.values(teams)
      .sort((a, b) => b.overall - a.overall)
      .filter((team) => {
        if (team.type !== teamType) return false;
        if (teamType === "club" && team.division !== division) return false;
        if (nationality !== "all") {
          if (team.nationality !== nationality) return false;
        } else if (region !== "all") {
          const teamRegion =
            NATIONALITIES_DATA[team.nationality as Nationality]?.region;
          if (teamRegion !== region) return false;
        }

        return true;
      });
  }, [teams, teamType, division, region, nationality]);
  const startGame = useCallback(
    async (chosenTeam: Team) => {
      if (!modality) return;
      const teamsRecord: Record<string, Team> = {};
      const playersRecord: Record<string, Player> = {};
      const teamValues = Object.values(teams);
      for (const team of teamValues) {
        const result = await generateSquad({ team, modality });
        if (!result) continue;
        const { updatedTeam, squad } = result;
        squad.forEach((player) => {
          playersRecord[player.id] = player;
        });
        teamsRecord[updatedTeam.id] = updatedTeam;
      }
      Object.values(teamsRecord).forEach((team) => {
        teamsRecord[team.id] = setStarters({
          team,
          playersMap: playersRecord,
        });
      });

      const { calendar, competitions } = generateSeason({
        teams: Object.values(teamsRecord),
        season: 2026,
      });

      const state: GameState = {
        currentDate: "2026-01-01",
        modality,
        season: 2026,
        status: "IDLE",
        teams: teamsRecord,
        players: playersRecord,
        userTeamId: chosenTeam.id,
        competitions,
        calendar,
        notifications: [],
        results: [],
        activeMatch: null,
      };

      loadState({ state });
    },
    [modality, teams, loadState],
  );
  const handleTeamClick = useCallback(
    (chosenTeam: Team) => {
      openModal([
        {
          name: chosenTeam.name,
          shield: chosenTeam.shield,
          description: chosenTeam.description,
          trophies: chosenTeam.trophies,
          onConfirm: () => {
            startGame(chosenTeam);
            router.push("/dashboard");
          },
          canCancel: true,
        },
      ]);
    },
    [openModal, router, startGame],
  );

  if (!modality) return null;

  return (
    <section className={`${styles.selectContainer} ${styles.teamSelector}`}>
      <header>
        <h1>
          BRASFOOT <strong>MANAGER</strong>
        </h1>
        <p>Configure os filtros e escolha sua equipe para iniciar a carreira</p>
        <button
          className={styles.modalitySwitcher}
          onClick={handleOpenModalityModal}
        >
          {modalityMap[modality]?.label}
        </button>
      </header>

      <FiltersContainer ariaLabel="Filtros de Equipe">
        <FormButton isActive={true} onClick={handleChangeTeamType}>
          {teamTypeMap[teamType]}
        </FormButton>

        <FormSelect
          value={region}
          options={regionOptions}
          onChange={handleChangeRegion}
        />

        {teamType === "club" && (
          <>
            <FormSelect
              value={nationality}
              options={getNationalityOptions({ region })}
              onChange={(event) => {
                const newNationality = event.target.value as
                  "all" | Nationality;
                setFilter("startGamePage", "nationality", newNationality);
              }}
            />
            <FormButton isActive={true} onClick={handleChangeDivision}>
              Série {division}
            </FormButton>
          </>
        )}
      </FiltersContainer>
      <div className={styles.grid}>
        {filteredTeams.map((team) => (
          <TeamCard key={team.id} team={team} onClick={handleTeamClick} />
        ))}
        {filteredTeams.length === 0 && (
          <div className={styles.messageContainer}>
            <p>Nenhuma equipe disponível para esta combinação de filtros.</p>
          </div>
        )}
      </div>
    </section>
  );
}
