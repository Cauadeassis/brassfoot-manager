import { getTeam, getRandom } from "../utils";
import type {
    SimulationState,
    PlayStyle,
    AttackerSkills,
    GoalkeeperSkills,
    Player,
    Team,
    GameState,
    Match,
} from "../types";

import { ATTACKERS, CORNER_HEADERS, CORNER_TAKERS } from "../data/positions";
import {
    filterPlayersByPosition,
    getStarters,
    getPlayer,
    getGK,
} from "../utils";
import type {
    Possession,
    MatchTeamsId,
    SimulateOpportunitiesProps,
    MatchTeams,
    SimulateShotProps,
    MakeShotsForTeamProps,
    ShotResult,
    ProcessTeamShotsProps,
    ShotLog,
    SimulateCornerProps,
} from "../components/modals/match/types";

function simulateShot({
    shooterShooting,
    goalkeeperReflexes,
    isPenalty = false,
}: SimulateShotProps): ShotResult {
    const shotOnTargetChance = isPenalty
        ? 0.9
        : Math.min(0.8, Math.max(0.1, (shooterShooting * 0.5) / 100));
    if (Math.random() > shotOnTargetChance) return "missed";
    const base = isPenalty
        ? 50 + 25 + (shooterShooting - goalkeeperReflexes)
        : 50 + (shooterShooting - goalkeeperReflexes);
    const goalChance = Math.min(90, Math.max(10, base)) / 100;
    if (Math.random() < goalChance) return "goal";
    if (!isPenalty && Math.random() < 0.3) return "corner";
    return "defended";
}

export function simulateCorner({
    taker,
    header,
    goalkeeper,
}: SimulateCornerProps): ShotResult {
    const takerSkills = taker!.skills as AttackerSkills;
    const cornerQuality = Math.min(
        0.9,
        Math.max(
            0.1,
            (takerSkills.vision * 0.65 + takerSkills.shooting * 0.35) / 100,
        ),
    );
    if (Math.random() > cornerQuality) return "missed";
    const goalkeeperSkills = goalkeeper.skills as GoalkeeperSkills;

    const result = simulateShot({
        shooterShooting: header.skills.shooting,
        goalkeeperReflexes: goalkeeperSkills.reflexes,
    });
    return result === "corner" ? "defended" : result;
}

export function calculatePossession({
    homeTeamId,
    awayTeamId,
}: MatchTeamsId): Possession {
    const homeOverall = Number(getTeam(homeTeamId)?.overall ?? 70);
    const awayOverall = Number(getTeam(awayTeamId)?.overall ?? 70);
    const rawDifference = homeOverall + 3 - awayOverall;
    const clampedDifference = Math.max(-40, Math.min(rawDifference, 40));
    const home = 0.5 + clampedDifference / 100;
    return { home, away: 1 - home };
}

export function createSimulationState({
    homeTeamId,
    awayTeamId,
}: MatchTeamsId): SimulationState {
    const possession = calculatePossession({ homeTeamId, awayTeamId });
    return {
        currentMinute: 0,
        homeGoals: 0,
        awayGoals: 0,
        homeShots: 0,
        awayShots: 0,
        homePossession: possession.home,
        events: [],
    };
}

function processTeamShots({
    shots,
    starters,
    goalkeeper,
    predefinedCornerTaker,
    predefinedPenaltiTaker,
    predefinedFreeKickTaker,
}: ProcessTeamShotsProps): ShotLog[] {
    const logs: ShotLog[] = [];
    const idealAttackers = filterPlayersByPosition({
        starters,
        array: ATTACKERS,
    });

    const attackers = idealAttackers.length ? idealAttackers : starters;
    for (let index = 0; index < shots; index++) {
        const attacker = getRandom({ array: attackers })!;
        const goalkeeperSkills = goalkeeper.skills as GoalkeeperSkills;
        const result = simulateShot({
            shooterShooting: attacker.skills.shooting,
            goalkeeperReflexes: goalkeeperSkills.reflexes,
        });

        logs.push(openPlayLog({ result, shooter: attacker, goalkeeper }));
        if (result === "corner") {
            const idealHeaders = filterPlayersByPosition({
                starters,
                array: CORNER_HEADERS,
            });
            const headers = idealHeaders.length ? idealHeaders : starters;
            const header = getRandom({ array: headers })!;
            let taker: Player;
            const hasPredefinedTaker =
                predefinedCornerTaker &&
                starters.some((player) => player.id === predefinedCornerTaker.id);
            if (hasPredefinedTaker) taker = predefinedCornerTaker!;
            else {
                const cornerTakers = filterPlayersByPosition({
                    starters,
                    array: CORNER_TAKERS,
                });
                const takers = cornerTakers.length ? cornerTakers : starters;
                taker = getRandom({ array: takers })!;
            }
            const cornerResult = simulateCorner({ taker, header, goalkeeper });
            logs.push(
                cornerLog({
                    result: cornerResult,
                    assistant: taker,
                    shooter: header,
                    goalkeeper,
                }),
            );
        }
    }

    return logs;
}

interface OpenPlayLogProps {
    result: ShotResult;
    shooter: Player;
    goalkeeper: Player;
}

const openPlayLog = ({
    result,
    shooter,
    goalkeeper,
}: OpenPlayLogProps): ShotLog => ({
    type: "open_play",
    result,
    shooter,
    goalkeeper,
});

interface CornerLogProps extends OpenPlayLogProps {
    assistant: Player;
}

const cornerLog = ({
    result,
    shooter,
    assistant,
    goalkeeper,
}: CornerLogProps): ShotLog => ({
    type: "corner",
    result,
    assistant,
    shooter,
    goalkeeper,
});

type TeamModifier = "homeShotsModifier" | "awayShotsModifier";

const playStyleModifierMap: Record<PlayStyle, Record<TeamModifier, number>> = {
    balanced: { homeShotsModifier: 0, awayShotsModifier: 0 },
    offensive: { homeShotsModifier: 0.1, awayShotsModifier: 0.05 },
    defensive: { homeShotsModifier: -0.05, awayShotsModifier: -0.1 },
};

function getTeamsModifiers({ homeTeam, awayTeam }: MatchTeams) {
    const homeTeamPlayStyle = homeTeam.tactics.style || "balanced";
    const awayTeamPlayStyle = awayTeam.tactics.style || "balanced";
    const homeTactics = playStyleModifierMap[homeTeamPlayStyle];
    const awayTactics = playStyleModifierMap[awayTeamPlayStyle];
    const homeModifier =
        homeTactics.homeShotsModifier + awayTactics.homeShotsModifier;
    const awayModifier =
        homeTactics.awayShotsModifier + awayTactics.awayShotsModifier;
    return { homeModifier, awayModifier };
}

function MakeShotsForTeam({ possession, modifier }: MakeShotsForTeamProps) {
    const variance = () => Math.floor(Math.random() * 5) - 2;
    return Math.max(1, Math.round(possession * 10 * (1 + modifier)) + variance());
}

export function simulateOpportunities({
    possession,
    homeTeam,
    awayTeam,
}: SimulateOpportunitiesProps) {
    const { homeModifier, awayModifier } = getTeamsModifiers({
        homeTeam,
        awayTeam,
    });
    const homeGK = getGK(getStarters(homeTeam));
    const awayGK = getGK(getStarters(awayTeam));
    const homeResult = simulateTeamOpportunities({
        team: homeTeam,
        possession: possession.home,
        modifier: homeModifier,
        defendingGoalkeeper: awayGK,
    });
    const awayResult = simulateTeamOpportunities({
        team: awayTeam,
        possession: possession.away,
        modifier: awayModifier,
        defendingGoalkeeper: homeGK,
    });
    return {
        homeGoals: homeResult.goals,
        awayGoals: awayResult.goals,
        homeShots: homeResult.shots,
        awayShots: awayResult.shots,
        homeShotLogs: homeResult.shotLogs,
        awayShotLogs: awayResult.shotLogs,
    };
}

interface SimulateTeamOpportunitiesProps {
    team: Team;
    possession: number;
    modifier: number;
    defendingGoalkeeper: Player;
}

function simulateTeamOpportunities({
    team,
    possession,
    modifier,
    defendingGoalkeeper,
}: SimulateTeamOpportunitiesProps) {
    const shots = MakeShotsForTeam({ possession, modifier });
    const starters = getStarters(team);
    const { cornerTaker, penaltyTaker, freeKickTaker } = getTeamTakers({
        takers: team.tactics.takers,
        teamId: team.id,
    });
    const shotLogs = processTeamShots({
        shots,
        starters,
        goalkeeper: defendingGoalkeeper,
        predefinedCornerTaker: cornerTaker,
        predefinedPenaltiTaker: penaltyTaker,
        predefinedFreeKickTaker: freeKickTaker,
    });
    const goals = shotLogs.filter((log) => log.result === "goal").length;
    return { shots, shotLogs, goals };
}

interface GetTeamTakers {
    takers: Team["tactics"]["takers"];
    teamId: number;
}

export function getTeamTakers({ takers, teamId }: GetTeamTakers) {
    const getTaker = (id: string | null) =>
        id ? getPlayer({ playerId: id, teamId }) : undefined;
    return {
        cornerTaker: getTaker(takers.corner),
        penaltyTaker: getTaker(takers.penalty),
        freeKickTaker: getTaker(takers.freeKick),
    };
}
interface GetNextMatches {
    state: GameState;
    number: number;
}
export const getNextMatches = ({ state, number }: GetNextMatches): Match[] => {
    const upcoming: Match[] = [];

    for (const round of state.calendar) {
        for (const match of round.matches) {
            if (
                !match.simulated &&
                (match.homeTeamId === state.userTeamId ||
                    match.awayTeamId === state.userTeamId)
            ) {
                upcoming.push(match);
                if (upcoming.length >= number) return upcoming;
            }
        }
    }
    return upcoming;
};
