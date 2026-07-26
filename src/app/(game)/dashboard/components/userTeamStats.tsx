import React, { useMemo } from "react";
import useGameStore from "../../../../stores/useGameStore";
import { getTeamPosition } from "../../../../gameEngine/managers/standings";
import { overallLimits } from "../../../../utils";

import styles from "../dashboard.module.css";

const UserTeamStats = () => {
  const userTeamId = useGameStore((state) => state.userTeamId);
  const season = useGameStore((state) => state.season);
  const teams = useGameStore((state) => state.teams);
  const userTeam = teams[userTeamId!];
  const stats = useMemo(() => {
    if (!userTeam) return null;
    const goalDifference =
      userTeam.history[season].goalsFor - userTeam.history[season].goalsAgainst;
    const position = getTeamPosition({
      teams: Object.values(teams),
      teamId: userTeam.id,
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
      <div>
        <p>Posição</p>
        <span className={stats.positionColor}>{stats.position}°</span>
      </div>
      <div>
        <p>Pontos</p>
        <span className="green-color">{userTeam.history[season].points}</span>
      </div>
      <div>
        <p>Saldo Gols</p>
        <span
          className={stats.goalDifference >= 0 ? "green-color" : "red-color"}
        >
          {stats.goalDifference >= 0
            ? `+${stats.goalDifference}`
            : stats.goalDifference}
        </span>
      </div>
      <div>
        <p>Finanças</p>
        <span className={userTeam.money >= 0 ? "green-color" : "red-color"}>
          R$ {userTeam.money.toLocaleString("pt-BR")}
        </span>
      </div>
    </div>
  );
};
export default React.memo(UserTeamStats);
