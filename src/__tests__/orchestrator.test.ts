import {
  getTeamBaseModifiers,
  getTeamsModifiers,
  simulateOpportunities,
  simulateCPUMatches,
  GetTeamBaseModifiersProps,
} from "../gameEngine/match/orchestrator";

import {
  simulateShot,
  simulateCorner,
  calculateTotalShots,
} from "../gameEngine/match/simulator";
import MatchEngine from "../gameEngine/match/MatchEngine";
import { FormationType } from "../data/formations";
jest.mock("../gameEngine/match/simulator", () => ({
  simulateShot: jest.fn(),
  simulateCorner: jest.fn(),
  calculateTotalShots: jest.fn(),
}));

jest.mock("../gameEngine/match/state", () => ({
  getTeamTakers: jest.fn(() => ({ cornerTaker: undefined })),
}));

jest.mock("../gameEngine/match/MatchEngine", () => {
  return jest.fn().mockImplementation(() => ({
    simulateBackground: jest.fn(() => ({
      homeGoals: 2,
      awayGoals: 1,
      events: [],
    })),
  }));
});

jest.mock("../utils", () => ({
  getRandom: jest.fn(({ array }) => array[0]),
  filterPlayersByPosition: jest.fn(({ starters }) => starters),
}));
jest.mock("../gameEngine/team", () => ({
  getGoalkeeper: jest.fn(() => ({ id: "gk", currentSkills: { reflexes: 80 } })),
  getStarters: jest.fn(() => [
    { id: "p1", currentSkills: { shooting: 85 } },
    { id: "p2", currentSkills: { shooting: 75 } },
  ]),
}));

const createMockTeam = (id: string, style: string, formation: string): any => ({
  id,
  name: `Team ${id}`,
  tactics: {
    style,
    formation,
    takers: {},
  },
});

describe("Orchestrator Engine (orchestrator.ts)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTeamBaseModifiers()", () => {
    it("deve retornar zeros para estilo balanced e formação não mapeada (ou sem modificadores)", () => {
      const modifiers = getTeamBaseModifiers({
        formation: "5-3-2" as FormationType,
        style: "balanced",
      });
      expect(modifiers).toEqual({
        ownShots: 0,
        opponentShots: 0,
        ownPossession: 0,
      });
    });

    it("deve combinar estilo offensive com formação 4-3-3", () => {
      const modifiers = getTeamBaseModifiers({
        formation: "4-3-3",
        style: "offensive",
      });
      expect(modifiers.ownShots).toBeCloseTo(0.2);
      expect(modifiers.opponentShots).toBeCloseTo(0.2);
      expect(modifiers.ownPossession).toBe(0);
    });

    it("deve combinar estilo defensive com formação 4-2-3-1", () => {
      const modifiers = getTeamBaseModifiers({
        formation: "4-2-3-1",
        style: "defensive",
      });
      expect(modifiers.ownShots).toBeCloseTo(-0.3); // -0.1 + -0.2
      expect(modifiers.opponentShots).toBeCloseTo(-0.1);
      expect(modifiers.ownPossession).toBeCloseTo(0.1);
    });
  });

  describe("getTeamsModifiers()", () => {
    it("deve calcular corretamente a interação entre os modificadores de ambos os times", () => {
      const homeTactics = {
        formation: "4-3-3",
        style: "offensive",
      } as GetTeamBaseModifiersProps;
      const awayTactics = {
        formation: "4-2-3-1",
        style: "balanced",
      } as GetTeamBaseModifiersProps;
      const { homeModifiers, awayModifiers } = getTeamsModifiers({
        homeTactics,
        awayTactics,
      });
      expect(homeModifiers.shotsModifier).toBeCloseTo(0.2);
      expect(homeModifiers.possessionModifier).toBe(0);
      expect(awayModifiers.shotsModifier).toBeCloseTo(0);
      expect(awayModifiers.possessionModifier).toBeCloseTo(0.1);
    });
  });

  describe("simulateOpportunities()", () => {
    it("deve gerar os logs de chutes para ambos os times processando rebotes de escanteio", () => {
      const homeTeam = createMockTeam("home", "balanced", "4-4-2");
      const awayTeam = createMockTeam("away", "balanced", "4-4-2");
      (calculateTotalShots as jest.Mock).mockReturnValue(1);
      (simulateShot as jest.Mock)
        .mockReturnValueOnce("corner")
        .mockReturnValueOnce("goal");
      (simulateCorner as jest.Mock).mockReturnValue("defended");
      const { homeShotLogs, awayShotLogs } = simulateOpportunities({
        homeTeam,
        awayTeam,
        matchPossession: { home: 0.6, away: 0.4 },
        playersMap: {},
      });
      expect(homeShotLogs).toHaveLength(2);
      expect(homeShotLogs[0].type).toBe("open_play");
      expect(homeShotLogs[0].result).toBe("corner");
      expect(homeShotLogs[1].type).toBe("corner");
      expect(homeShotLogs[1].result).toBe("defended");
      expect(simulateCorner).toHaveBeenCalledTimes(1);
      expect(awayShotLogs).toHaveLength(1);
      expect(awayShotLogs[0].type).toBe("open_play");
      expect(awayShotLogs[0].result).toBe("goal");
    });
  });

  describe("simulateCPUMatches()", () => {
    it("deve simular apenas partidas pendentes (simulated: false) usando o MatchEngine", () => {
      const teams = {
        t1: createMockTeam("t1", "balanced", "4-4-2"),
        t2: createMockTeam("t2", "balanced", "4-4-2"),
        t3: createMockTeam("t3", "balanced", "4-4-2"),
        t4: createMockTeam("t4", "balanced", "4-4-2"),
      };

      const pendingMatches = [
        { id: "m1", homeTeamId: "t1", awayTeamId: "t2", simulated: false },
        { id: "m2", homeTeamId: "t3", awayTeamId: "t4", simulated: true },
      ] as any;

      const results = simulateCPUMatches({ pendingMatches, teams });
      expect(results).toHaveLength(1);
      expect(results[0].matchId).toBe("m1");
      expect(results[0].homeGoals).toBe(2);
      expect(results[0].awayGoals).toBe(1);
      expect(MatchEngine).toHaveBeenCalledTimes(1);
      expect(MatchEngine).toHaveBeenCalledWith(teams["t1"], teams["t2"]);
    });

    it("deve ignorar partidas se os times não forem encontrados no state", () => {
      const teams = {
        t1: createMockTeam("t1", "balanced", "4-4-2"),
      };
      const pendingMatches = [
        { id: "m1", homeTeamId: "t1", awayTeamId: "INVALID", simulated: false },
      ] as any;
      const results = simulateCPUMatches({ pendingMatches, teams });
      expect(results).toHaveLength(0);
      expect(MatchEngine).not.toHaveBeenCalled();
    });
  });
});
