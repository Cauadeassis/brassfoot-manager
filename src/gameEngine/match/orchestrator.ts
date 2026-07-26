import { simulateShot, simulateCorner, calculateTotalShots } from "./simulator";
import { GoalkeeperSkills } from "../../types/player";
import {
  MatchTeams,
  ShotLog,
  Match,
  MatchEvent,
  MatchTeamsNumbers,
} from "../../types/match";
import { PlayStyle } from "../../types/team";
import { Player } from "../../types/player";
import { Team } from "../../types/team";
import { FormationType } from "../../data/formations";
import { filterPlayersByPosition, getRandom } from "../../utils";
import {
  ATTACKERS,
  CORNER_HEADERS,
  CORNER_TAKERS,
} from "../generators/positions";
import { getTeamTakers } from "./state";
import MatchEngine from "./MatchEngine";
import { GameState } from "../../types/state";
import { getGoalkeeper, getStarters } from "../team";

interface ProcessTeamShotsProps {
  totalShots: number;
  starters: Player[];
  defendingGoalkeeper: Player;
  predefinedCornerTaker?: Player;
}

interface SimulateOpportunitiesProps extends MatchTeams {
  matchPossession: MatchTeamsNumbers;
  playersMap: Record<string, Player>;
}

export interface Modifiers {
  ownShots: number;
  opponentShots: number;
  ownPossession: number;
}

const playStyleModifiers: Record<PlayStyle, Partial<Modifiers>> = {
  balanced: {},
  offensive: { ownShots: 0.1, opponentShots: 0.1 },
  defensive: { ownShots: -0.1, opponentShots: -0.1 },
};

const formationsModifiers: Record<FormationType, Partial<Modifiers>> = {
  "4-3-3": {
    ownShots: 0.1,
    opponentShots: 0.1,
  },
  "4-4-2": {
    ownShots: -0.1,
    opponentShots: -0.1,
  },
  "4-2-3-1": {
    ownPossession: 0.1,
    ownShots: -0.2,
  },
};

const DEFAULT_MODIFIERS: Modifiers = {
  ownShots: 0,
  opponentShots: 0,
  ownPossession: 0,
};

function getTeamBaseModifiers(team: Team): Modifiers {
  const style = team.tactics.style;
  const formation = team.tactics.formation;
  const styleModifiers = playStyleModifiers[style];
  const formationModifiers = formationsModifiers[formation];
  const combined = { ...DEFAULT_MODIFIERS };
  [styleModifiers, formationModifiers].forEach((modifierSource) => {
    if (!modifierSource) return;
    (Object.keys(combined) as Array<keyof Modifiers>).forEach((key) => {
      combined[key] += modifierSource[key] || 0;
    });
  });

  return combined;
}

export function getTeamsModifiers({ homeTeam, awayTeam }: MatchTeams) {
  console.log(
    `${homeTeam.name} joga de ${homeTeam.tactics.formation} e ${homeTeam.tactics.style}`,
  );
  console.log(
    `${awayTeam.name} joga de ${awayTeam.tactics.formation} e ${awayTeam.tactics.style}`,
  );
  const homeBase = getTeamBaseModifiers(homeTeam);
  console.log("modificadores do time de casa:", homeBase);
  const awayBase = getTeamBaseModifiers(awayTeam);
  console.log("modificadores do time de fora:", awayBase);
  return {
    homeModifiers: {
      shotsModifier: homeBase.ownShots + awayBase.opponentShots,
      possessionModifier: homeBase.ownPossession - awayBase.ownPossession,
    },
    awayModifiers: {
      shotsModifier: awayBase.ownShots + homeBase.opponentShots,
      possessionModifier: awayBase.ownPossession - homeBase.ownPossession,
    },
  };
}

function selectSetPieceTaker(
  predefinedTaker: Player | undefined,
  starters: Player[],
  idealCandidates: Player[],
): Player {
  const isPredefinedTakerOnPitch =
    predefinedTaker &&
    starters.some((player) => player.id === predefinedTaker.id);

  if (isPredefinedTakerOnPitch) return predefinedTaker;

  const availableCandidates =
    idealCandidates.length > 0 ? idealCandidates : starters;
  return getRandom({ array: availableCandidates }) as Player;
}

function processTeamShots({
  totalShots,
  starters,
  defendingGoalkeeper,
  predefinedCornerTaker,
}: ProcessTeamShotsProps): ShotLog[] {
  const shotLogs: ShotLog[] = [];

  const idealAttackers = filterPlayersByPosition({
    starters,
    positions: ATTACKERS,
  });
  const idealHeaders = filterPlayersByPosition({
    starters,
    positions: CORNER_HEADERS,
  });
  const idealCornerTakers = filterPlayersByPosition({
    starters,
    positions: CORNER_TAKERS,
  });

  const attackers = idealAttackers.length > 0 ? idealAttackers : starters;
  const goalkeeperSkills =
    defendingGoalkeeper.currentSkills as GoalkeeperSkills;

  for (let currentShot = 0; currentShot < totalShots; currentShot++) {
    const attacker = getRandom({ array: attackers }) as Player;

    const shotResult = simulateShot({
      shooterShootingAttribute: attacker.currentSkills.shooting,
      goalkeeperReflexesAttribute: goalkeeperSkills.reflexes,
    });

    shotLogs.push({
      type: "open_play",
      result: shotResult,
      shooter: attacker,
      goalkeeper: defendingGoalkeeper,
    });

    if (shotResult === "corner") {
      const cornerTaker = selectSetPieceTaker(
        predefinedCornerTaker,
        starters,
        idealCornerTakers,
      );
      const headerPlayer = selectSetPieceTaker(
        undefined,
        starters,
        idealHeaders,
      );

      const cornerResult = simulateCorner({
        cornerTaker,
        headerPlayer,
        goalkeeper: defendingGoalkeeper,
      });

      shotLogs.push({
        type: "corner",
        result: cornerResult,
        assistant: cornerTaker,
        shooter: headerPlayer,
        goalkeeper: defendingGoalkeeper,
      });
    }
  }

  return shotLogs;
}

export function simulateOpportunities({
  matchPossession,
  homeTeam,
  awayTeam,
  playersMap,
}: SimulateOpportunitiesProps) {
  const { homeModifiers, awayModifiers } = getTeamsModifiers({
    homeTeam,
    awayTeam,
  });

  const homeGoalkeeper = getGoalkeeper({ team: homeTeam, playersMap });
  const awayGoalkeeper = getGoalkeeper({ team: awayTeam, playersMap });
  const homeShotLogs = simulateTeamOpportunities({
    team: homeTeam,
    possessionPercentage: matchPossession.home,
    tacticalModifier: homeModifiers.shotsModifier,
    defendingGoalkeeper: awayGoalkeeper,
    playersMap,
  });

  const awayShotLogs = simulateTeamOpportunities({
    team: awayTeam,
    possessionPercentage: matchPossession.away,
    tacticalModifier: awayModifiers.shotsModifier,
    defendingGoalkeeper: homeGoalkeeper,
    playersMap,
  });

  return { homeShotLogs, awayShotLogs };
}

interface SimulateTeamOpportunitiesProps {
  team: Team;
  playersMap: Record<string, Player>;
  possessionPercentage: number;
  tacticalModifier: number;
  defendingGoalkeeper: Player;
}

function simulateTeamOpportunities({
  team,
  possessionPercentage,
  tacticalModifier,
  defendingGoalkeeper,
  playersMap,
}: SimulateTeamOpportunitiesProps): ShotLog[] {
  const totalShots = calculateTotalShots(
    possessionPercentage,
    tacticalModifier,
  );
  const starters = getStarters({ team, playersMap });
  const teamTakers = getTeamTakers({
    setPieceTakers: team.tactics.takers,
    teamId: team.id,
  });

  return processTeamShots({
    totalShots,
    starters,
    defendingGoalkeeper,
    predefinedCornerTaker: teamTakers.cornerTaker,
  });
}

export interface CPUMatchResult {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
}

export interface SimulateCPUMatchesProps extends Pick<GameState, "teams"> {
  pendingMatches: Match[];
}

interface SimulateBackgroundMatchProps extends MatchTeams {
  match: Match;
}

function simulateBackgroundMatch({
  match,
  homeTeam,
  awayTeam,
}: SimulateBackgroundMatchProps): CPUMatchResult {
  const engine = new MatchEngine(homeTeam, awayTeam);
  const summary = engine.simulateBackground();
  return {
    matchId: match.id,
    homeGoals: summary.homeGoals,
    awayGoals: summary.awayGoals,
    events: summary.events,
  };
}

export function simulateCPUMatches({
  pendingMatches,
  teams,
}: SimulateCPUMatchesProps): CPUMatchResult[] {
  const results: CPUMatchResult[] = [];
  for (const match of pendingMatches) {
    if (match.simulated) continue;
    const homeTeam = teams[match.homeTeamId];
    const awayTeam = teams[match.awayTeamId];
    if (homeTeam && awayTeam) {
      const result = simulateBackgroundMatch({ match, homeTeam, awayTeam });
      results.push(result);
    }
  }
  return results;
}
