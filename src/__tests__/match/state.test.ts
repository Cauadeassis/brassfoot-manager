import {
  getTeamBaseModifiers,
  getTeamsModifiers,
} from "../../gameEngine/match/orchestrator";
import { calculatePossession } from "../../gameEngine/match/simulator";
import {
  createMatchState,
  getUpcomingMatches,
  getLastMatches,
  getTeamTakers,
} from "../../gameEngine/match/state";
jest.mock("../../utils", () => ({
  getPlayer: jest.fn((id: string) => ({ id, name: `Player ${id}` })),
}));

interface CreateMockTeamProps {
  id: string;
  overall?: number;
  tactics?: {
    formation: string;
    style: string;
  };
}

const baseTactics = {
  formation: "4-4-2",
  style: "balanced",
};

const createMockTeam = ({
  id,
  overall = 80,
  tactics = baseTactics,
}: CreateMockTeamProps): any => ({
  id,
  name: `Team ${id}`,
  overall,
  tactics,
});

const createMockMatch = (
  id: string,
  homeTeamId: string,
  awayTeamId: string,
  simulated: boolean = false,
): any => ({
  id,
  homeTeamId,
  awayTeamId,
  simulated,
});

describe("Match State & Utils (state.ts)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Getting modifiers", () => {
    const differentTactics = {
      formation: "4-2-3-1",
      style: "defensive",
    };
    it("Should get the base modifiers", () => {
      const homeTeam = createMockTeam({ id: "T1", tactics: differentTactics });
      const { ownShots, opponentShots, ownPossession } =
        getTeamBaseModifiers(homeTeam);
      expect(ownShots).toBeCloseTo(-0.3);
      expect(opponentShots).toBeCloseTo(-0.1);
      expect(ownPossession).toBeCloseTo(0.1);
    });
    it("Should sum the modifiers", () => {
      const homeTeam = createMockTeam({ id: "T1" });
      const awayTeam = createMockTeam({ id: "T2", tactics: differentTactics });
      const { homeModifiers, awayModifiers } = getTeamsModifiers({
        homeTeam,
        awayTeam,
      });
      expect(homeModifiers.shotsModifier).toBeCloseTo(-0.2);
      expect(homeModifiers.possessionModifier).toBeCloseTo(0);
      expect(awayModifiers.shotsModifier).toBeCloseTo(-0.4);
      expect(awayModifiers.possessionModifier).toBeCloseTo(0.1);
    });
  });
  it("Should create state", () => {
    const homeTeam = createMockTeam({ id: "home", overall: 77 });
    const awayTeam = createMockTeam({ id: "away", overall: 80 });
    const state = createMatchState({ homeTeam, awayTeam });
    expect(state.events).toEqual([]);
    expect(state.statistics.currentMinute).toBe(0);
    expect(state.statistics.goals).toEqual({ home: 0, away: 0 });
    expect(state.statistics.shots).toEqual({ home: 0, away: 0 });
    expect(state.statistics.possession).toEqual({ home: 0.5, away: 0.5 });
  });
  describe("Calendar Match Queries", () => {
    const calendar: any[] = [
      { matches: [createMockMatch("m1", "T1", "T2", true)] },
      { matches: [createMockMatch("m2", "T3", "T1", true)] },
      { matches: [createMockMatch("m3", "T1", "T4", false)] },
      { matches: [createMockMatch("m4", "T5", "T1", false)] },
    ];

    it("Should return the upcoming matches", () => {
      const matches = getUpcomingMatches({
        calendar,
        targetTeamId: "T1",
        desiredQuantity: 2,
      });
      expect(matches).toHaveLength(2);
      expect(matches[0].id).toBe("m3");
      expect(matches[1].id).toBe("m4");
    });

    describe("getLastMatches()", () => {
      it("Should return the last matches", () => {
        const matches = getLastMatches({
          calendar,
          targetTeamId: "T1",
          desiredQuantity: 2,
        });
        expect(matches).toHaveLength(2);
        expect(matches[0].id).toBe("m2");
        expect(matches[1].id).toBe("m1");
      });

      it("Should return the desired quantity", () => {
        const matches = getLastMatches({
          calendar,
          targetTeamId: "T1",
          desiredQuantity: 1,
        });
        expect(matches).toHaveLength(1);
        expect(matches[0].id).toBe("m2");
      });
    });
  });
  it("Should return the team takers", () => {
    const setPieceTakers = {
      corner: "p1",
      penalty: null,
      freeKick: "p3",
    };
    const result = getTeamTakers({ setPieceTakers, teamId: "T1" });
    expect(result.cornerTaker).toEqual({ id: "p1", name: "Player p1" });
    expect(result.penaltyTaker).toBeUndefined();
    expect(result.freeKickTaker).toEqual({ id: "p3", name: "Player p3" });
  });
});
