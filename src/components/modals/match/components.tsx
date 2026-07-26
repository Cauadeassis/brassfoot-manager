import React from "react";
import parse from "html-react-parser";
import styles from "./match.module.css";
import { EventLog } from "../../../types/match";
import { Team } from "../../../types/team";
import { Icon } from "../../../app/components";
interface ScoreNumbersProps {
  homeGoals: number;
  awayGoals: number;
}
const ScoreNumbers = React.memo(
  ({ homeGoals, awayGoals }: ScoreNumbersProps) => (
    <div className={styles.scoreNumbers}>
      <span>{homeGoals}</span>
      <p>:</p>
      <span>{awayGoals}</span>
    </div>
  ),
);

interface TeamInfoProps {
  team: Team;
}

const TeamInfo = React.memo(({ team }: TeamInfoProps) => (
  <div className={styles.teamInfo}>
    <Icon name={team.shield} className={styles.shieldIcon} />
    <h2>{team.name}</h2>
  </div>
));

interface ScoreboardProps {
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  currentMinute: number;
}
export const Scoreboard = ({
  homeTeam,
  awayTeam,
  homeGoals,
  awayGoals,
  currentMinute,
}: ScoreboardProps) => (
  <header className={styles.scoreboard}>
    <div>
      <TeamInfo team={homeTeam} />
      <ScoreNumbers homeGoals={homeGoals} awayGoals={awayGoals} />
      <TeamInfo team={awayTeam} />
    </div>
    <p>{currentMinute}'</p>
  </header>
);

interface MatchStatsProps {
  homePossession: number;
  homeShots: number;
  awayShots: number;
}

export const MatchStats = React.memo(
  ({ homePossession, homeShots, awayShots }: MatchStatsProps) => {
    const homePossessionPercent = Math.round(homePossession * 100);
    return (
      <div className={styles.matchStats}>
        <div>
          <span>{homePossessionPercent}%</span>
          <p>POSSE</p>
          <span>{100 - homePossessionPercent}%</span>
        </div>
        <div>
          <span>{homeShots}</span>
          <p>CHUTES</p>
          <span>{awayShots}</span>
        </div>
      </div>
    );
  },
);

interface LogItemProps {
  log: EventLog;
}

export const LogItem = React.memo(({ log }: LogItemProps) => (
  <div className={styles.logItem}>
    <span className={styles.minutes}>{log.minute}'</span>
    {log.shield && <Icon name={log.shield} className={styles.shieldIcon} />}
    <span className={styles.icon}>{log.icon}</span>
    <span className={styles.text}>{parse(log.text)}</span>
  </div>
));
