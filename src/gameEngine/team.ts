import { FormationType, getPositionsByFormation } from "../data/formations";
import {
  Division,
  Modality,
  PlayStyle,
  TeamStatistics,
  TeamType,
} from "../types/team";
import { getCompatiblePositions, getRandom } from "../utils";
import { Player } from "../types/player";
import { Team, RawTeamData } from "../types/team";
import getPositionsData, { POSITIONS } from "./generators/positions";
import { Position } from "../types/player";
import { PositionData } from "../data/positions";
import { getDefaultUniformDesign } from "../data/uniforms";
import NATIONALITIES_DATA, { Nationality } from "../data/nationalities";
import { CompetitionId, Region } from "../types/competition";
import TEMPLATES from "../data/descriptions";
import { generatePlayer } from "./player";
import { GeneralTeamData } from "../types/team";
import { TeamGenerationError } from "../errors";
import { GameState } from "../types/state";

interface GetSquadProps {
  team: Team;
  playersMap: Record<string, Player>;
  modality?: Modality;
}

interface GetTeamDescriptionProps {
  type: TeamType;
  region: Region;
  nationality: Nationality;
}

export const EMPTY_TEAM_STATISTICS: TeamStatistics = {
  points: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  matchesPlayed: 0,
};

interface GetStatsProps {
  team: Team;
  season?: number;
  competitionId?: CompetitionId;
}

export const getTeamStats = ({
  team,
  season,
  competitionId,
}: GetStatsProps): TeamStatistics => {
  const entries = Object.entries(team.history ?? {});

  const filteredStats = entries
    .filter(([historyKey]) => {
      const matchesSeason =
        season === undefined || historyKey.startsWith(`${season}_`);
      const matchesCompetition =
        !competitionId ||
        historyKey === competitionId ||
        historyKey.endsWith(`_${competitionId}`) ||
        historyKey.includes(`_${competitionId}_`);

      return matchesSeason && matchesCompetition;
    })
    .map(([, stats]) => stats);

  return filteredStats.reduce<TeamStatistics>(
    (acc, curr) => ({
      points: acc.points + (curr.points || 0),
      wins: acc.wins + (curr.wins || 0),
      draws: acc.draws + (curr.draws || 0),
      losses: acc.losses + (curr.losses || 0),
      goalsFor: acc.goalsFor + (curr.goalsFor || 0),
      goalsAgainst: acc.goalsAgainst + (curr.goalsAgainst || 0),
      matchesPlayed: acc.matchesPlayed + (curr.matchesPlayed || 0),
    }),
    { ...EMPTY_TEAM_STATISTICS },
  );
};
interface MovePlayerProps {
  team: Team;
  playerId: string;
}
interface GenerateSquadProps {
  team: Team;
  modality: Modality;
}

export const initialTeamStatistics: TeamStatistics = {
  points: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  matchesPlayed: 0,
};

export function getTeamDescription({
  type,
  region,
  nationality,
}: GetTeamDescriptionProps): string {
  const templateType = TEMPLATES[type];
  if (!templateType) {
    throw TeamGenerationError.missingTemplate(type);
  }

  const specific = templateType?.[region]?.[nationality];
  if (specific) return specific;

  const regionalDefault = templateType?.[region]?.default;
  if (regionalDefault) return regionalDefault;

  return templateType.default;
}

export const getSquad = ({ team, playersMap }: GetSquadProps): Player[] => {
  return team.squad.playerIds
    .map((id) => playersMap[id])
    .filter(Boolean) as Player[];
};

export const getStarters = ({ team, playersMap }: GetSquadProps): Player[] => {
  return team.squad.starterIds
    .map((id) => playersMap[id])
    .filter(Boolean) as Player[];
};

export const getGoalkeeper = ({ team, playersMap }: GetSquadProps): Player => {
  const starters = getStarters({ team, playersMap });
  const goalkeeper = starters.find((p) => p.position === "GK");
  if (!goalkeeper) {
    throw TeamGenerationError.missingGoalkeeper(team.name);
  }
  return goalkeeper;
};

export const addPlayer = ({ team, playerId }: MovePlayerProps): Team => {
  if (team.squad.playerIds.includes(playerId)) return team;
  return {
    ...team,
    squad: {
      ...team.squad,
      playerIds: [...team.squad.playerIds, playerId],
    },
  };
};

export const removePlayer = ({ team, playerId }: MovePlayerProps): Team => {
  const newPlayerShirts = { ...team.squad.playerShirts };
  delete newPlayerShirts[playerId];

  return {
    ...team,
    squad: {
      ...team.squad,
      playerIds: team.squad.playerIds.filter((id) => id !== playerId),
      starterIds: team.squad.starterIds.filter((id) => id !== playerId),
      playerShirts: newPlayerShirts,
    },
    tactics: {
      ...team.tactics,
      captainId:
        team.tactics.captainId === playerId ? null : team.tactics.captainId,
      takers: {
        corner:
          team.tactics.takers.corner === playerId
            ? null
            : team.tactics.takers.corner,
        penalty:
          team.tactics.takers.penalty === playerId
            ? null
            : team.tactics.takers.penalty,
        freeKick:
          team.tactics.takers.freeKick === playerId
            ? null
            : team.tactics.takers.freeKick,
      },
    },
  };
};

export const updateOverall = ({ team, playersMap }: GetSquadProps): Team => {
  if (team.squad.starterIds.length === 0) {
    return { ...team, overall: 0, rankingScore: 0 };
  }

  let totalOverall = 0;
  let starterCount = 0;

  for (const id of team.squad.starterIds) {
    const player = playersMap[id];
    if (player) {
      totalOverall += player.overall;
      starterCount++;
    }
  }

  const overall = starterCount > 0 ? Math.round(totalOverall / 11) : 0;
  const rankingScore = Math.pow(overall, 2) / 5;

  return { ...team, overall, rankingScore };
};

export const resetTakersForStarters = ({
  team,
  starterIds,
}: {
  team: Team;
  starterIds: string[];
}): Team => {
  const startersSet = new Set(starterIds);

  return {
    ...team,
    tactics: {
      ...team.tactics,
      takers: {
        penalty: startersSet.has(team.tactics.takers.penalty ?? "")
          ? team.tactics.takers.penalty
          : null,
        freeKick: startersSet.has(team.tactics.takers.freeKick ?? "")
          ? team.tactics.takers.freeKick
          : null,
        corner: startersSet.has(team.tactics.takers.corner ?? "")
          ? team.tactics.takers.corner
          : null,
      },
    },
  };
};

export const setStarters = ({
  team,
  playersMap,
  modality = "masculine",
}: GetSquadProps): Team => {
  const squadPlayers = team.squad.playerIds
    .map((id) => playersMap[id])
    .filter((p): p is Player => p !== undefined);

  const positions = getPositionsByFormation({
    formation: team.tactics.formation,
    playStyle: team.tactics.style,
  });

  const candidates = positions.flatMap((targetPosition, slotIndex) =>
    getCompatiblePositions(targetPosition).flatMap((compatiblePosition) =>
      squadPlayers
        .filter((player) => player.position === compatiblePosition)
        .map((player) => ({
          player,
          slotIndex,
          score:
            player.overall * 10 +
            (player.position === targetPosition ? 100 : 0),
        })),
    ),
  );

  candidates.sort((a, b) => b.score - a.score || a.player.age - b.player.age);

  const selectedPlayerIds = new Set<string>();
  const result = new Array(positions.length).fill(null);

  for (const { player, slotIndex } of candidates) {
    if (!selectedPlayerIds.has(player.id) && result[slotIndex] === null) {
      selectedPlayerIds.add(player.id);
      result[slotIndex] = player.id;
    }
  }

  const teamWithStarters = {
    ...team,
    squad: {
      ...team.squad,
      starterIds: result.filter((id): id is string => id !== null),
    },
  };

  const teamWithValidatedTakers = resetTakersForStarters({
    team: teamWithStarters,
    starterIds: teamWithStarters.squad.starterIds,
  });

  const teamWithOverall = updateOverall({
    team: teamWithValidatedTakers,
    playersMap,
  });

  return {
    ...teamWithOverall,
    squad: {
      ...teamWithOverall.squad,
      playerShirts: assignShirtNumbers({
        playerIds: teamWithOverall.squad.playerIds,
        starterIds: teamWithOverall.squad.starterIds,
        players: playersMap,
        modality,
      }),
    },
  };
};

interface ProcessTransferProps extends GetSquadProps {
  playerId: string;
  value: number;
  role: "buyer" | "seller";
}

export const processTransfer = ({
  team,
  playerId,
  value,
  role,
  playersMap,
  modality = "masculine",
}: ProcessTransferProps): Team => {
  let updatedTeam = {
    ...team,
    money: team.money + (role === "seller" ? value : -value),
  };

  updatedTeam =
    role === "seller"
      ? removePlayer({ team: updatedTeam, playerId })
      : addPlayer({ team: updatedTeam, playerId });

  return setStarters({ team: updatedTeam, playersMap, modality });
};

interface CreateTeamProps {
  baseData: GeneralTeamData;
  modality: Modality;
}

export const createBaseTeam = (raw: RawTeamData): GeneralTeamData => {
  const {
    nationality,
    type,
    name,
    shield,
    division,
    overall,
    money,
    uniformDesign,
    trophies,
    description,
  } = raw;
  const nationalityData = NATIONALITIES_DATA[nationality];
  if (!nationalityData) {
    throw TeamGenerationError.invalidNationality({ nationality, name });
  }

  const region = nationalityData.region;

  return {
    id: crypto.randomUUID(),
    name,
    type,
    nationality,
    shield,
    division,
    overall,
    money,
    uniformDesign: uniformDesign ?? getDefaultUniformDesign(nationality),
    description:
      description ||
      getTeamDescription({
        type,
        region,
        nationality,
      }),
    trophies: trophies ?? {},
    history: {},
    squad: { playerIds: [], starterIds: [], playerShirts: {} },
    tactics: {
      formation: getRandom({ array: formations }),
      style: getRandom({ array: styles }),
      captainId: null,
      takers: { penalty: null, freeKick: null, corner: null },
    },
  };
};
const formations = ["4-4-2", "4-2-3-1", "4-3-3"] as FormationType[];
const styles = ["offensive", "balanced", "defensive"] as PlayStyle[];
export const generateTeam = ({ baseData, modality }: CreateTeamProps): Team => {
  const overall = baseData.overall[modality];
  return {
    ...baseData,
    division: baseData.division[modality],
    overall,
    rankingScore: Math.pow(overall, 2) / 5,
  };
};
export const generateSquad = async ({
  team,
  modality,
}: GenerateSquadProps): Promise<{ updatedTeam: Team; squad: Player[] }> => {
  const POSITIONS_DATA = getPositionsData(modality);
  if (!POSITIONS_DATA) throw TeamGenerationError.missingPositionsData(modality);
  const generatedPlayers: Player[] = [];
  let currentTeamState = team;
  const entries = Object.entries(POSITIONS_DATA) as [Position, PositionData][];
  for (const [positionKey, data] of entries) {
    for (let i = 0; i < data.max; i++) {
      const newPlayer = await generatePlayer({
        position: positionKey as Position,
        team: currentTeamState,
        modality,
      });
      currentTeamState = addPlayer({
        team: currentTeamState,
        playerId: newPlayer.id,
      });
      generatedPlayers.push(newPlayer);
    }
  }

  const generatedPlayersMap = Object.fromEntries(
    generatedPlayers.map((player) => [player.id, player]),
  ) as Record<string, Player>;

  currentTeamState = setStarters({
    team: currentTeamState,
    playersMap: generatedPlayersMap,
    modality,
  });

  return { updatedTeam: currentTeamState, squad: generatedPlayers };
};

interface AssignShirtNumbersProps
  extends
    Pick<Team["squad"], "playerIds" | "starterIds">,
    Pick<GameState, "players"> {
  modality?: Modality;
}

export function assignShirtToPlayer({
  player,
  starterIds,
  usedNumbers,
  modality = "masculine",
}: {
  player: Player;
  starterIds: string[];
  usedNumbers: Set<number>;
  modality?: Modality;
}): number {
  const positionData = getPositionsData(modality);
  const positionOptions = positionData[player.position]?.shirtNumber ?? [10];
  const isStarter = starterIds.includes(player.id);
  const preferredOrder = isStarter
    ? positionOptions
    : [...positionOptions].reverse();
  const selectedNumber = isStarter
    ? (positionOptions.find(
        (shirtNumber) => shirtNumber <= 11 && !usedNumbers.has(shirtNumber),
      ) ??
      Array.from({ length: 11 }, (_, index) => index + 1).find(
        (shirtNumber) => !usedNumbers.has(shirtNumber),
      ) ??
      preferredOrder.find((shirtNumber) => !usedNumbers.has(shirtNumber)))
    : preferredOrder.find((shirtNumber) => !usedNumbers.has(shirtNumber));

  if (selectedNumber !== undefined) {
    usedNumbers.add(selectedNumber);
    return selectedNumber;
  }

  let fallbackNumber = 1;
  while (usedNumbers.has(fallbackNumber)) {
    fallbackNumber += 1;
  }

  usedNumbers.add(fallbackNumber);
  return fallbackNumber;
}

export function assignShirtNumbers({
  playerIds,
  starterIds,
  players,
  modality = "masculine",
}: AssignShirtNumbersProps): Record<string, number> {
  const shirtNumbers: Record<string, number> = {};
  const usedNumbers = new Set<number>();
  const starterSet = new Set(starterIds);
  const orderedPlayerIds = [
    ...starterIds.filter((playerId) => playerIds.includes(playerId)),
    ...playerIds.filter((playerId) => !starterSet.has(playerId)),
  ];

  for (const playerId of orderedPlayerIds) {
    const player = players[playerId];
    if (!player) continue;

    const selectedNumber = assignShirtToPlayer({
      player,
      starterIds,
      usedNumbers,
      modality,
    });

    shirtNumbers[playerId] = selectedNumber;
  }

  return shirtNumbers;
}
