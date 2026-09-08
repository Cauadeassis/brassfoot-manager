import React, { useMemo } from "react";
import useGameStore from "../../../../stores/useGameStore";
import { getTeamPosition } from "../../../../gameEngine/managers/standings";
import { formatMoney, overallLimits } from "../../../../utils";
import styles from "../dashboard.module.css";
import { DashBoardComponentProps } from "./miniStandings";
import { getTeamStats } from "../../../../gameEngine/team";
import { CompetitionId } from "../../../../types/competition";

const UserTeamStats = ({
  nationalLeagueName,
  historyKey,
}: DashBoardComponentProps) => {
  const userTeamId = useGameStore((state) => state.userTeamId);
  const teams = useGameStore((state) => state.teams);
  const userTeam = teams[userTeamId!];
  const stats = useMemo(() => {
    if (!userTeam) return null;
    const [season, nationalLeagueId] = historyKey.split("_");
    const teamStats = getTeamStats({
      team: userTeam,
      season: Number(season),
      competitionId: nationalLeagueId as CompetitionId,
    });
    const goalDifference = teamStats.goalsFor - teamStats.goalsAgainst;
    const position = getTeamPosition({
      teams: Object.values(teams),
      teamId: userTeam.id,
      competitionId: nationalLeagueId as CompetitionId,
      season: Number(season),
    });
    const positionColor = [1, 2, 3].includes(position)
      ? "green-color"
      : "yellow-color";
    const overallColor =
      overallLimits.find(({ min }) => userTeam.overall >= min)?.color || "";

    return {
      goalDifference,
      position,
      positionColor,
      overallColor,
    };
  }, [userTeam, teams]);
  if (!userTeam || !stats) return <p>Carregando dados do treinador...</p>;

  return (
    <div className={styles.userTeamStats}>
      <div>
        <p>Overall</p>
        <span className={stats.overallColor}>{userTeam.overall}</span>
      </div>

      {userTeam.type === "club" && (
        <div>
          <p>Posição ({nationalLeagueName})</p>
          <span className={stats.positionColor}>{stats.position}°</span>
        </div>
      )}
      <div>
        <p>Finanças</p>
        <span className={userTeam.money >= 0 ? "green-color" : "red-color"}>
          R$ {formatMoney(userTeam.money)}
        </span>
      </div>
    </div>
  );
};
export default React.memo(UserTeamStats);
