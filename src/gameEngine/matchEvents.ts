import type {
    EventHandler,
    MatchTeams,
    Intensity,
    EventsBuilderProps,
    GenerateShotEventsProps,
    GenerateMinutesProps,
    ProcessEventProps,
    MapToEventsProps,
    GetRandomMessageProps,
} from "../components/modals/match/types";
import { calculatePossession, simulateOpportunities } from "./matchSimulator";
import type {
    MatchEvent,
    MatchEventType,
    SimulationState,
    Team,
} from "../types";
import { getSquad, getRandom } from "../utils";

import eventMessages from "../data/eventMessages";

export function generateMinutes({
    eventQuantity,
    min,
    max,
}: GenerateMinutesProps): number[] {
    return Array.from(
        { length: eventQuantity },
        () => min + Math.floor(Math.random() * (max - min)),
    ).sort((firstMinute, secondMinute) => firstMinute - secondMinute);
}

function eventsBuilder({ event, icon, text }: EventsBuilderProps): string {
    const shield = (event as MatchEvent).shield;
    const shieldHtml = shield
        ? `<img src="${shield}" class="team-shield-icon" style="width: 16px; height: 16px; margin-right: 6px; vertical-align: middle; object-fit: contain;" />`
        : "";
    return `<div class="log-evento">
        <span class="minutes">${event.minute}'</span>
        ${shieldHtml}
        <span class="icon">${icon}</span>
        <span class="text">${text}</span>
    </div>`;
}

function getRandomIntensity(): Intensity {
    const roll = Math.random();
    if (roll < 0.4) return "low";
    if (roll < 0.75) return "medium";
    return "high";
}

function getRandomMessage({
    messages,
    shooter,
    assistant,
    goalkeeper,
    intensity,
}: GetRandomMessageProps): string {
    const pool = Array.isArray(messages)
        ? messages
        : messages[intensity ?? getRandomIntensity()];
    const selected = pool[Math.floor(Math.random() * pool.length)];
    return selected
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
    messageKey: MatchEventType,
    icon: string,
): EventHandler {
    return function handleEvent(event) {
        const intensity = getRandomIntensity();
        return eventsBuilder({
            event,
            icon,
            text: getRandomMessage({
                messages: eventMessages[messageKey],
                shooter: event.shooter.name,
                ...(event.goalkeeper && { goalkeeper: event.goalkeeper.name }),
                ...(event.assistant && { assistant: event.assistant.name }),
                intensity,
            }),
            intensity,
        });
    };
}

export const eventHandlers: Record<string, EventHandler> = {
    goal: createEventHandler("goal", "⚽"),
    corner_goal: createEventHandler("corner_goal", "⚽"),
    corner_defended: createEventHandler("corner_defended", "🧤"),
    corner_missed: createEventHandler("corner_missed", "❌"),
    shot_defended_caught: createEventHandler("shot_defended_caught", "🧤"),
    shot_defended_corner: createEventHandler("shot_defended_corner", "🚩"),
    shot_missed: createEventHandler("shot_missed", "❌"),
    yellow_card: createEventHandler("yellow_card", "🟨"),
    red_card: createEventHandler("red_card", "🟥"),
    substitution: createEventHandler("substitution", "🔄"),
};

export function generateEvents({
    homeTeam,
    awayTeam,
}: MatchTeams): MatchEvent[] {
    const possession = calculatePossession({
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
    });

    return [
        ...generateShotEvents({ possession, homeTeam, awayTeam }),
        ...generateCardEvents({ homeTeam, awayTeam }),
        ...generateSubstitutionEvents({ homeTeam, awayTeam }),
    ].sort((a, b) => a.minute - b.minute);
}

const EVENT_MAP: Record<string, Record<string, MatchEventType>> = {
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

function generateShotEvents({
    possession,
    homeTeam,
    awayTeam,
}: GenerateShotEventsProps): MatchEvent[] {
    const { homeShotLogs, awayShotLogs } = simulateOpportunities({
        possession,
        homeTeam,
        awayTeam,
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
const SUBSEQUENT_EVENTS = new Set(["corner", "penalty", "freeKick"]);
function mapToEvents({ logs, side, shield }: MapToEventsProps) {
    const baseEvents = logs.filter((log) => !SUBSEQUENT_EVENTS.has(log.type));
    const count = baseEvents.length;
    const blockSize = Math.floor(90 / count);

    const baseMinutes: number[] = [];
    for (let index = 0; index < count; index++) {
        const start = index * blockSize + 1;
        const end = (index + 1) * blockSize;
        const minute = Math.floor(Math.random() * (end - start + 1)) + start;
        baseMinutes.push(minute);
    }
    baseMinutes.sort((a, b) => a - b);

    const events: MatchEvent[] = [];
    let baseMinuteIndex = 0;

    for (let index = 0; index < logs.length; index++) {
        const log = logs[index];
        const isSubsequent = SUBSEQUENT_EVENTS.has(log.type) && events.length > 0;
        const minute = isSubsequent
            ? events[events.length - 1].minute
            : (baseMinutes[baseMinuteIndex++] ?? 90);
        events.push({
            minute,
            type: EVENT_MAP[log.type]?.[log.result] ?? "shot_missed",
            side,
            shield,
            shooter: log.shooter,
            ...(log.goalkeeper && { goalkeeper: log.goalkeeper }),
            ...(log.assistant && { assistant: log.assistant }),
        });
    }

    return events;
}
function generateCardEvents({ homeTeam, awayTeam }: MatchTeams): MatchEvent[] {
    const homeSquad = getSquad(homeTeam.id) || [];
    const awaySquad = getSquad(awayTeam.id) || [];
    const allPlayers = [...homeSquad, ...awaySquad];
    const events: MatchEvent[] = [];

    generateMinutes({
        eventQuantity: Math.floor(1 + Math.random() * 3),
        min: 1,
        max: 90,
    }).forEach((minute) => {
        const player = getRandom({ array: allPlayers });
        const side = homeSquad.includes(player) ? "home" : "away";
        const shield = side === "home" ? homeTeam.shield : awayTeam.shield;
        events.push({
            minute,
            type: "yellow_card",
            side,
            shield,
            shooter: player,
        });
    });

    if (Math.random() < 0.15) {
        const minute = generateMinutes({ eventQuantity: 1, min: 20, max: 90 })[0];
        const player = getRandom({ array: allPlayers });
        const side = homeSquad.includes(player) ? "home" : "away";
        const shield = side === "home" ? homeTeam.shield : awayTeam.shield;
        events.push({
            minute,
            type: "red_card",
            side,
            shield,
            shooter: player,
        });
    }

    return events;
}

function generateSubstitutionEvents({
    homeTeam,
    awayTeam,
}: MatchTeams): MatchEvent[] {
    const events: MatchEvent[] = [];
    const teamsData = [
        { team: homeTeam, side: "home" as const },
        { team: awayTeam, side: "away" as const },
    ];
    teamsData.forEach(({ team, side }) => {
        const squad = getSquad(team.id) || [];
        [60, 65, 75]
            .filter(() => Math.random() < 0.7)
            .forEach((baseMinute) => {
                events.push({
                    minute: baseMinute + Math.floor(Math.random() * 5),
                    type: "substitution" as const,
                    side,
                    shield: team.shield,
                    shooter: getRandom({ array: squad.slice(11) }),
                });
            });
    });

    return events;
}
const sideKeys = {
    home: { shots: "homeShots" as const, goals: "homeGoals" as const },
    away: { shots: "awayShots" as const, goals: "awayGoals" as const },
};

const eventProcessor: Record<
    string,
    (event: MatchEvent, state: SimulationState) => void
> = {
    shot_defended_caught: (event, state) => {
        const keys = sideKeys[event.side];
        state[keys.shots]++;
    },
    shot_defended_corner: (event, state) => {
        const keys = sideKeys[event.side];
        state[keys.shots]++;
    },
    corner_goal: (event, state) => {
        const keys = sideKeys[event.side];
        state[keys.goals]++;
        state[keys.shots]++;
    },
    corner_defended: (event, state) => {
        const keys = sideKeys[event.side];
        state[keys.shots]++;
    },
    shot_missed: (event, state) => {
        const keys = sideKeys[event.side];
        state[keys.shots]++;
    },

    goal: (event, state) => {
        const keys = sideKeys[event.side];
        state[keys.shots]++;
        state[keys.goals]++;
        if (event.shooter) event.shooter.statistics.goals++;
    },
};

export function processEvent({
    event,
    state,
    homeShield,
    awayShield,
}: ProcessEventProps & { homeShield?: string; awayShield?: string }): string {
    eventProcessor[event.type]?.(event, state);
    const shield = event.side === "home" ? homeShield : awayShield;
    const eventWithShield = Object.assign({}, event, { shield });
    const handler = eventHandlers[event.type];
    return handler ? handler(eventWithShield) : "";
}
