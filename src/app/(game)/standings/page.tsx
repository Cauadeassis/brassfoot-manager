"use client";

import styles from "./standings.module.css";
import useGameStore from "../../../stores/useGameStore";
import StandingsRow from "../../../components/rows/standings";
import { getStandings } from "../../../gameEngine/managers/standings";
import SectionHeader from "../components/sectionHeader";
import useFiltersStore from "../../../stores/useFilterStore";
import COMPETITIONS from "../../../data/competitions";
import { useMemo } from "react";
import { isEligible } from "../../../gameEngine/generators/season";

export default function Standings() {
  const teams = useGameStore((state) => state.teams);
  const competitionId = useFiltersStore(
    (state) => state.globalFilters.generalCompetitionId,
  );
  const competition = COMPETITIONS.find((c) => c.id === competitionId);
  const filteredTeams = useMemo(() => {
    let eligibleTeams = Object.values(teams);
    if (competitionId !== null) {
      if (competition) {
        eligibleTeams = eligibleTeams.filter((team) =>
          isEligible({ team, eligibility: competition.eligibility }),
        );
      }
    }
    return eligibleTeams;
  }, [teams, competitionId]);
  const divisionAStandings = getStandings({ teams: filteredTeams });
  return (
    <section className={styles.standingsSection}>
      <SectionHeader title="CLASSIFICAÇÕES" />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
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
