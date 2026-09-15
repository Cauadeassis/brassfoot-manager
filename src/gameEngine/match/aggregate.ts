import { Match } from "../../types/match";

export const getAggregateScore = ({
  match,
  competitionMatches,
}: {
  match: Match;
  competitionMatches: Match[];
}): Match["goals"] => {
  const otherLeg = competitionMatches.find(
    (candidate) =>
      candidate.id !== match.id &&
      Math.abs(candidate.round - match.round) === 1 &&
      candidate.homeTeamId === match.awayTeamId &&
      candidate.awayTeamId === match.homeTeamId,
  );

  if (!otherLeg) return match.goals;

  return {
    home: match.goals.home + otherLeg.goals.away,
    away: match.goals.away + otherLeg.goals.home,
  };
};
