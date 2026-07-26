import React, { useMemo } from "react";
import useGameStore from "../../../../stores/useGameStore";
import { getStandings } from "../../../../gameEngine/managers/standings";
import StandingsRow from "../../../../components/rows/standings";

const MiniStandings = () => {
  const teams = Object.values(useGameStore((state) => state.teams));
  const topTeams = useMemo(() => {
    return getStandings({ teams }).slice(0, 6);
  }, [teams]);

  return (
    <section>
      <h3>Top 6 Classificação</h3>
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
              variant="mini"
            />
          ))}
        </tbody>
      </table>
    </section>
  );
};
export default React.memo(MiniStandings);
