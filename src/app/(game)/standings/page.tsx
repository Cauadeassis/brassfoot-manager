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
import { HistoryKey } from "../../../types/team";
import { getCompetitionName } from "../../../filters/labels";
import { TargetCompetition } from "../../../types/competition";

export interface ZoneData {
  colorClass: string;
  rowClass: string;
  label: string;
}

export default function Standings() {
  const teams = useGameStore((state) => state.teams);
  const season = useGameStore((state) => state.season);
  const competitionId = useFiltersStore(
    (state) => state.globalFilters.generalCompetitionId,
  );
  const competition = COMPETITIONS.find((c) => c.id === competitionId);
  const filteredTeams = useMemo(() => {
    const allTeams = Object.values(teams);
    if (!competition) return allTeams;
    return allTeams.filter((team) =>
      isEligible({ team, eligibility: competition.eligibility }),
    );
  }, [teams, competition]);
  const divisionAStandings = useMemo(() => {
    if (!competitionId) return [];
    return getStandings({
      teams: filteredTeams,
      season,
      competitionId,
    });
  }, [filteredTeams, season, competitionId]);
  const { rowZones, legendItems } = useMemo(() => {
    const zones: Record<number, ZoneData> = {};
    const legend: ZoneData[] = [];
    const outputs: TargetCompetition[] = competition?.output || [];
    let topIdx = 0;
    let topColorIndex = 0;
    const TOP_COLORS = ["blue-color", "green-color"];
    outputs.forEach((targetCompetition) => {
      const label = getCompetitionName({ key: targetCompetition.id });
      const colorClass = TOP_COLORS[topColorIndex++ % TOP_COLORS.length];
      const rowClass = "greenHighlight";
      const startIdx = topIdx;
      const endIdx = startIdx + targetCompetition.slots;

      for (let i = startIdx; i < endIdx; i++) {
        zones[i] = { colorClass, rowClass, label };
      }
      legend.push({ colorClass, rowClass, label });
      topIdx += targetCompetition.slots;
    });

    return { rowZones: zones, legendItems: legend };
  }, [competition]);
  if (!competitionId) {
    return (
      <div>
        <p>Selecione uma competição, por favor.</p>
      </div>
    );
  }

  const historyKey = `${season}_${competitionId}` as HistoryKey;
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
              <td colSpan={9}>Nenhum time cadastrado nesta divisão.</td>
            </tr>
          ) : (
            divisionAStandings.map((team, index) => (
              <StandingsRow
                key={team.id}
                team={team}
                index={index}
                historyKey={historyKey}
                variant="full"
                zone={rowZones[index]}
              />
            ))
          )}
        </tbody>
      </table>

      {legendItems.length > 0 && (
        <div className="legenda-da-tabela">
          {legendItems.map((item, idx) => (
            <p key={`${item.label}-${idx}`}>
              <span className={item.colorClass}>■</span> {item.label}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
