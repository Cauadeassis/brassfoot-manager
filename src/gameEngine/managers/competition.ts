import { CompetitionId } from "../../types/competition";
import { Team } from "../../types/team";

interface AddTrophyProps {
  team: Team;
  competitionId: CompetitionId;
  season: number;
}

export const addTrophy = ({
  team,
  competitionId,
  season,
}: AddTrophyProps): Team => {
  const currentTrophies = team.trophies[competitionId] || [];
  return {
    ...team,
    trophies: {
      ...team.trophies,
      [competitionId]: [...currentTrophies, season],
    },
  };
};
