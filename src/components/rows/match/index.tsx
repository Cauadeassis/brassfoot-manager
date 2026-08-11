"use client";
import useGameStore from "../../../stores/useGameStore";
import { Match, Result } from "../../../types/match";
import styles from "./match.module.css";
import { getMatchResult } from "../../../gameEngine/match/progression";
import { getCompetition } from "../../../utils";
import { CompetitionRules } from "../../../types/competition";
import { getCompetitionName } from "../../../filters/labels";
import { TeamBadge } from "../../badges";
import { LayoutMode } from "../../../app/(game)/transfers/page";

interface MatchRowProps {
  match: Match;
  roundLabel: string;
  layoutMode?: LayoutMode;
}

const competitionsClassesMap: Partial<Record<string, string>> = {
  brasileirao: "gold",
  libertadores: "green",
  worldClubs: "gold",
  championsLeague: "red",
  nationsLeague: "red",
  worldCup: "green",
  european_cup: "gold",
};

interface GetRoundLabelProps {
  match: Match;
  rules: CompetitionRules;
  matchesInThisRoundCount: number;
}

const roundLabelByMatchesQuantityMap: Record<number, string> = {
  1: "final",
  2: "semifinal",
  4: "quartas",
  8: "oitavas",
  16: "16 avos",
};

export const getRoundLabel = ({
  match,
  rules,
  matchesInThisRoundCount,
}: GetRoundLabelProps): string => {
  if (rules.format === "league") return `ROD ${match.round}`;
  if (rules.format === "cup") {
    if (rules.hasGroupStage) {
      const groupStageTotalRounds = 3 * (rules.groupStageGamesPerRound || 1);
      if (match.round <= groupStageTotalRounds) {
        return `GRUPOS - ROD ${match.round}`;
      }
    }
    return roundLabelByMatchesQuantityMap[matchesInThisRoundCount];
  }

  return `ROD ${match.round}`;
};

interface GetResultClass {
  match: Match;
  teamId: string | null;
}
const getResultClass = ({ match, teamId }: GetResultClass) => {
  if (!match.simulated) return "";
  if (!teamId) return "";
  const result = getMatchResult({
    scoredGoals:
      match.homeTeamId === teamId ? match.goals.home : match.goals.away,
    concededGoals:
      match.homeTeamId === teamId ? match.goals.away : match.goals.home,
  });
  const classMap: Record<Result, string> = {
    win: "green-color",
    draw: "yellow-color",
    defeat: "red-color",
  };

  return classMap[result];
};
export default function MatchRow({
  match,
  roundLabel,
  layoutMode = "desktop",
}: MatchRowProps) {
  const homeTeam = useGameStore((state) => state.teams[match.homeTeamId]);
  const awayTeam = useGameStore((state) => state.teams[match.awayTeamId]);
  const isCompact = layoutMode !== "desktop";
  const userTeamId = useGameStore((state) => state.userTeamId);
  const matchCompetition = getCompetition(match.competitionId);
  if (!homeTeam || !awayTeam || !matchCompetition) return null;
  const isHome = match.homeTeamId === userTeamId;
  const isUserInvolved =
    match.homeTeamId === userTeamId || match.awayTeamId === userTeamId;
  const competitionColor = competitionsClassesMap[matchCompetition.id];
  const competitionClass = competitionColor ? competitionColor : "default";
  const [, month, day] = match.date.split("-");
  const formattedDate = `${day}/${month}`;
  const shouldShowRound = !isCompact;
  const shouldShowLocalTag = isUserInvolved && !isCompact;
  const shouldShowPending = !isCompact && !match.simulated;
  return (
    <div className={styles.matchRow}>
      <div className={styles.matchMeta}>
        <span className={`${styles.competition} ${styles[competitionClass]}`}>
          {getCompetitionName({ length: 1, key: matchCompetition.id })}
        </span>
        {shouldShowRound && <span className={styles.label}>{roundLabel}</span>}
      </div>
      <div
        className={`${styles.teamsContainer} ${getResultClass({ match, teamId: userTeamId })}`}
      >
        <TeamBadge
          teamShield={homeTeam.shield}
          teamName={homeTeam.name}
          isMobile={layoutMode === "card" ? true : false}
        />
        <p>
          {match.simulated ? `${match.goals.home} – ${match.goals.away}` : "×"}
        </p>
        <TeamBadge
          teamShield={awayTeam.shield}
          teamName={awayTeam.name}
          isMobile={layoutMode === "card" ? true : false}
        />
      </div>
      {shouldShowLocalTag && (
        <span
          className={`${styles.localTag} ${styles.label} ${isHome ? styles.home : ""}`}
        >
          {isHome ? "CASA" : "FORA"}
        </span>
      )}
      <span className={`${styles.label} ${styles.date}`}>{formattedDate}</span>
      {shouldShowPending && <span className={styles.label}>PENDENTE</span>}
    </div>
  );
}
