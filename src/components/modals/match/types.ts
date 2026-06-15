import type {
    Team,
    Player,
    Match,
    MatchEvent,
    SimulationState,
    MatchSide,
} from "../../../types";

export interface GenerateMinutesProps {
    eventQuantity: number;
    min: number;
    max: number;
}

export interface ProcessTeamShotsProps {
    shots: number;
    starters: Player[];
    goalkeeper: Player;
    predefinedCornerTaker?: Player;
    predefinedPenaltiTaker?: Player;
    predefinedFreeKickTaker?: Player;
}
export interface ShotLog {
    type: "open_play" | "corner";
    result: ShotResult;
    assistant?: Player;
    shooter: Player;
    goalkeeper?: Player;
}
export type ShotResult = "missed" | "defended" | "goal" | "corner";

export interface SimulateCornerProps {
    taker: Player;
    header: Player;
    goalkeeper: Player;
}

export interface MapToEventsProps {
    logs: ShotLog[];
    side: MatchSide;
    shield: string;
}

export interface MakeShotsForTeamProps {
    possession: number;
    modifier: number;
}

export interface SimulateShotProps {
    shooterShooting: number;
    goalkeeperReflexes: number;
    isPenalty?: boolean;
    isFromCorner?: boolean;
}

export interface Possession {
    home: number;
    away: number;
}

export interface MatchTeams {
    homeTeam: Team;
    awayTeam: Team;
}

export interface MatchTeamsId {
    homeTeamId: number;
    awayTeamId: number;
}

export interface GenerateShotEventsProps extends MatchTeams {
    possession: Possession;
}

export interface SimulateOpportunitiesProps {
    homeTeam: Team;
    awayTeam: Team;
    possession: Possession;
}

export interface SimulateOpportunitiesResult {
    homeGoals: number;
    awayGoals: number;
    homeShots: number;
    awayShots: number;
    homeConversion: number;
    awayConversion: number;
}

export interface ProcessEventProps {
    event: MatchEvent;
    state: SimulationState;
}

export interface UpdateTeamStatsProps {
    teamId: number;
    goalsScored: number;
    goalsConceded: number;
}

export interface GetMatchResultProps {
    homeGoals: number;
    awayGoals: number;
    homeName: string;
    awayName: string;
}

export interface FinishMatchProps extends MatchTeams {
    match: Match;
    simulationState: SimulationState;
}

export type EventHandler = (event: MatchEvent) => string;
export type Style =
    | "green-color"
    | "yellow-color"
    | "red-color"
    | "blue-color"
    | "none";
export type Intensity = "low" | "medium" | "high";

export interface EventsBuilderProps {
    event: MatchEvent;
    icon: string;
    text: string;
    intensity?: Intensity;
}

export interface IntensityMessages {
    low: string[];
    medium: string[];
    high: string[];
}

export interface GetRandomMessageProps {
    messages: IntensityMessages | string[];
    assistant?: string;
    shooter: string;
    goalkeeper?: string;
    intensity?: Intensity;
}
