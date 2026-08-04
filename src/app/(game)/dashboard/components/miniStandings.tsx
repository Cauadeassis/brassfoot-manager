import React, { useMemo } from "react";
import useGameStore from "../../../../stores/useGameStore";
import { getStandings } from "../../../../gameEngine/managers/standings";
import StandingsRow from "../../../../components/rows/standings";
import { CompetitionId } from "../../../../types/competition";
import { HistoryKey } from "../../../../types/team";

export interface DashBoardComponentProps {
  nationalLeagueId: CompetitionId;
  nationalLeagueName: string;
  historyKey: HistoryKey;
}

const MiniStandings = ({
  nationalLeagueName,
  historyKey,
}: DashBoardComponentProps) => {
  const teams = Object.values(useGameStore((state) => state.teams));
  const [season, competitionId] = historyKey.split("_");
  const topTeams = useMemo(() => {
    return getStandings({ teams, season: Number(season), competitionId }).slice(
      0,
      6,
    );
  }, [teams, historyKey]);

  return (
    <section>
      <h3>
        Top {topTeams.length} ({nationalLeagueName})
      </h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Clube</th>
            <th>SG</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {topTeams.map((team, index) => (
            <StandingsRow
              key={team.id}
              team={team}
              index={index}
              historyKey={historyKey}
              variant="mini"
            />
          ))}
        </tbody>
      </table>
    </section>
  );
};
export default React.memo(MiniStandings);
