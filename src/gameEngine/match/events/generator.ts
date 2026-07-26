import {
  MatchEvent,
  EventType,
  MatchTeams,
  Shot,
  ShotLog,
  MatchSide,
  MatchTeamsNumbers,
} from "../../../types/match";
import { simulateOpportunities } from "../orchestrator";
import { getRandom } from "../../../utils";
import { getSquad } from "../../team";
import { Player } from "../../../types/player";

interface GenerateMinutesProperties {
  eventQuantity: number;
  minimumMinute: number;
  maximumMinute: number;
}

interface GenerateShotEventsProperties extends MatchTeams {
  possession: MatchTeamsNumbers;
  playersMap: Record<string, Player>;
}

interface MapToEventsProperties {
  logs: ShotLog[];
  side: MatchSide;
  shield: string;
}

export function generateMinutes({
  eventQuantity,
  minimumMinute,
  maximumMinute,
}: GenerateMinutesProperties): number[] {
  const minutesSet = new Set<number>();
  while (minutesSet.size < eventQuantity) {
    minutesSet.add(
      minimumMinute +
        Math.floor(Math.random() * (maximumMinute - minimumMinute)),
    );
  }
  return Array.from(minutesSet).sort((a, b) => a - b);
}

const EVENT_MAP: Record<Shot["type"], Record<string, EventType>> = {
  corner: {
    goal: "corner_goal",
    defended: "corner_defended",
    missed: "corner_missed",
  },
  open_play: {
    goal: "goal",
    defended: "shot_defended_caught",
    corner: "shot_defended_corner",
    missed: "shot_missed",
  },
};

const SUBSEQUENT_EVENT_TYPES = new Set(["corner", "penalty", "freeKick"]);

function mapToEvents({
  logs,
  side,
  shield,
}: MapToEventsProperties): MatchEvent[] {
  const baseEventsQuantity = logs.filter(
    (log) => !SUBSEQUENT_EVENT_TYPES.has(log.type),
  ).length;

  const baseMinutes = generateMinutes({
    eventQuantity: baseEventsQuantity,
    minimumMinute: 1,
    maximumMinute: 90,
  });

  const generatedEvents: MatchEvent[] = [];
  let baseMinuteIndex = 0;

  logs.forEach((log) => {
    const isSubsequentEvent =
      SUBSEQUENT_EVENT_TYPES.has(log.type) && generatedEvents.length > 0;
    const eventMinute = isSubsequentEvent
      ? generatedEvents[generatedEvents.length - 1].minute
      : (baseMinutes[baseMinuteIndex++] ?? 90);

    generatedEvents.push({
      minute: eventMinute,
      type: EVENT_MAP[log.type]?.[log.result] ?? "shot_missed",
      side,
      shield,
      shooter: log.shooter,
      ...(log.goalkeeper && { goalkeeper: log.goalkeeper }),
      ...(log.assistant && { assistant: log.assistant }),
    });
  });

  return generatedEvents;
}

function generateShotEvents({
  possession,
  homeTeam,
  awayTeam,
  playersMap,
}: GenerateShotEventsProperties): MatchEvent[] {
  const { homeShotLogs, awayShotLogs } = simulateOpportunities({
    matchPossession: possession,
    homeTeam,
    awayTeam,
    playersMap,
  });

  return [
    ...mapToEvents({
      logs: homeShotLogs,
      side: "home",
      shield: homeTeam.shield,
    }),
    ...mapToEvents({
      logs: awayShotLogs,
      side: "away",
      shield: awayTeam.shield,
    }),
  ];
}

interface GenerateCardEventsProps extends MatchTeams {
  playersMap: Record<string, Player>;
}

function generateCardEvents({
  homeTeam,
  awayTeam,
  playersMap,
}: GenerateCardEventsProps): MatchEvent[] {
  const homeSquad = getSquad({ team: homeTeam, playersMap }) || [];
  const awaySquad = getSquad({ team: awayTeam, playersMap }) || [];
  const allPlayers = [...homeSquad, ...awaySquad];
  const cardEvents: MatchEvent[] = [];

  generateMinutes({
    eventQuantity: Math.floor(1 + Math.random() * 3),
    minimumMinute: 1,
    maximumMinute: 90,
  }).forEach((minute) => {
    const penalizedPlayer = getRandom({ array: allPlayers });
    const side = homeSquad.includes(penalizedPlayer) ? "home" : "away";
    const shield = side === "home" ? homeTeam.shield : awayTeam.shield;

    cardEvents.push({
      minute,
      type: "yellow_card",
      side,
      shield,
      shooter: penalizedPlayer,
    });
  });

  if (Math.random() < 0.15) {
    const minute = generateMinutes({
      eventQuantity: 1,
      minimumMinute: 20,
      maximumMinute: 90,
    })[0];
    const penalizedPlayer = getRandom({ array: allPlayers });
    const side = homeSquad.includes(penalizedPlayer) ? "home" : "away";
    const shield = side === "home" ? homeTeam.shield : awayTeam.shield;

    cardEvents.push({
      minute,
      type: "red_card",
      side,
      shield,
      shooter: penalizedPlayer,
    });
  }

  return cardEvents;
}

function generateSubstitutionEvents({
  homeTeam,
  awayTeam,
  playersMap,
}: GenerateCardEventsProps): MatchEvent[] {
  const substitutionEvents: MatchEvent[] = [];
  const teamsData = [
    { team: homeTeam, side: "home" as const },
    { team: awayTeam, side: "away" as const },
  ];

  teamsData.forEach(({ team, side }) => {
    const squad = getSquad({ team, playersMap }) || [];
    [60, 65, 75]
      .filter(() => Math.random() < 0.7)
      .forEach((baseMinute) => {
        substitutionEvents.push({
          minute: baseMinute + Math.floor(Math.random() * 5),
          type: "substitution" as const,
          side,
          shield: team.shield,
          shooter: getRandom({ array: squad.slice(11) }),
        });
      });
  });

  return substitutionEvents;
}

interface GenerateEventsProps extends GenerateCardEventsProps {
  possession: MatchTeamsNumbers;
}
export function generateEvents({
  homeTeam,
  awayTeam,
  possession,
  playersMap,
}: GenerateEventsProps): MatchEvent[] {
  return [
    ...generateShotEvents({ possession, homeTeam, awayTeam, playersMap }),
    ...generateCardEvents({ homeTeam, awayTeam, playersMap }),
    ...generateSubstitutionEvents({ homeTeam, awayTeam, playersMap }),
  ].sort((a, b) => a.minute - b.minute);
}
