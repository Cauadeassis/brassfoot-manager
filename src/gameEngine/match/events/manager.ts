import {
  MatchEvent,
  MatchState,
  EventType,
  Intensity,
  IntensityMessages,
  EventLog,
} from "../../../types/match";
import {
  PlayerRole,
  PlayerStatistic,
  PlayerStatistics,
} from "../../../types/player";
import eventMessages from "../../../data/eventMessages";

interface ProcessEventProperties {
  event: MatchEvent;
  state: MatchState;
}

type NewEventHandler = (event: MatchEvent) => EventLog;

interface EventDefinition {
  handler: NewEventHandler;
  stats?: Partial<Record<PlayerRole, PlayerStatistic>>;
}

interface EventsBuilderProperties {
  event: MatchEvent;
  icon: string;
  text: string;
}

interface GetRandomMessageProperties {
  messages: IntensityMessages | string[];
  assistant?: string;
  shooter: string;
  goalkeeper?: string;
  intensity?: Intensity;
}

function buildEventLog({
  event,
  icon,
  text,
}: EventsBuilderProperties): EventLog {
  return {
    id: crypto.randomUUID(),
    minute: event.minute,
    shield: event.shield || null,
    icon,
    text,
  };
}

function getRandomIntensity(): Intensity {
  const intensityRoll = Math.random();
  if (intensityRoll < 0.4) return "low";
  if (intensityRoll < 0.75) return "medium";
  return "high";
}

function getRandomMessage({
  messages,
  shooter,
  assistant,
  goalkeeper,
  intensity,
}: GetRandomMessageProperties): string {
  const messagePool = Array.isArray(messages)
    ? messages
    : messages[intensity ?? getRandomIntensity()];

  const selectedMessage =
    messagePool[Math.floor(Math.random() * messagePool.length)];

  return selectedMessage
    .replaceAll("{shooter}", `<strong>${shooter}</strong>`)
    .replaceAll(
      "{assistant}",
      assistant ? `<strong>${assistant}</strong>` : "{assistant}",
    )
    .replaceAll(
      "{goalkeeper}",
      goalkeeper ? `<strong>${goalkeeper}</strong>` : "{goalkeeper}",
    );
}

function createEventHandler(
  messageKey: EventType,
  icon: string,
): NewEventHandler {
  return function handleEvent(event) {
    const intensity = getRandomIntensity();
    return buildEventLog({
      event,
      icon,
      text: getRandomMessage({
        messages: eventMessages[messageKey],
        shooter: event.shooter?.name ?? "Jogador",
        ...(event.goalkeeper && { goalkeeper: event.goalkeeper.name }),
        ...(event.assistant && { assistant: event.assistant.name }),
        intensity,
      }),
    });
  };
}

export const EVENT_CONFIG: Record<EventType, EventDefinition> = {
  goal: {
    handler: createEventHandler("goal", "⚽"),
    stats: { shooter: "goals", assistant: "assists" },
  },
  corner_goal: {
    handler: createEventHandler("corner_goal", "⚽"),
    stats: { shooter: "goals", assistant: "assists" },
  },
  shot_missed: { handler: createEventHandler("shot_missed", "❌") },
  corner_missed: { handler: createEventHandler("corner_missed", "❌") },
  corner_defended: {
    handler: createEventHandler("corner_defended", "🧤"),
    stats: { goalkeeper: "defenses" },
  },
  yellow_card: {
    handler: createEventHandler("yellow_card", "🟨"),
    stats: { shooter: "yellowCards" },
  },
  red_card: {
    handler: createEventHandler("red_card", "🟥"),
    stats: { shooter: "redCards" },
  },
  shot_defended_corner: {
    handler: createEventHandler("shot_defended_corner", "🧤"),
    stats: { goalkeeper: "defenses" },
  },
  shot_defended_caught: {
    handler: createEventHandler("shot_defended_caught", "🧤"),
    stats: { goalkeeper: "defenses" },
  },
  substitution: {
    handler: createEventHandler("substitution", "🔄"),
  },
};

function incrementShot(event: MatchEvent, state: MatchState) {
  if (event.side === "home") state.statistics.shots.home++;
  else state.statistics.shots.away++;
}

function incrementGoal(event: MatchEvent, state: MatchState) {
  if (event.side === "home") state.statistics.goals.home++;
  else state.statistics.goals.away++;
}

const eventProcessors: Partial<
  Record<EventType, (event: MatchEvent, state: MatchState) => void>
> = {
  shot_defended_caught: incrementShot,
  shot_defended_corner: incrementShot,
  corner_defended: incrementShot,
  shot_missed: incrementShot,
  corner_missed: incrementShot,
  goal: (event, state) => {
    incrementShot(event, state);
    incrementGoal(event, state);
  },
  corner_goal: (event, state) => {
    incrementShot(event, state);
    incrementGoal(event, state);
  },
};

export function processEvent({
  event,
  state,
  homeShield,
  awayShield,
}: ProcessEventProperties & {
  homeShield?: string;
  awayShield?: string;
}): EventLog | null {
  eventProcessors[event.type]?.(event, state);
  const shield = event.side === "home" ? homeShield : awayShield;
  const eventWithShield = Object.assign({}, event, { shield });

  const handler = EVENT_CONFIG[event.type]?.handler;
  return handler ? handler(eventWithShield) : null;
}
