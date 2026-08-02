import {
  simulateShot,
  simulateCorner,
  calculatePossession,
  calculateTotalShots,
} from "../../gameEngine/match/simulator";
const createMockPlayer = (skills: any): any => ({
  currentSkills: skills,
});

describe("Match Simulator Engine (simulator.ts)", () => {
  let mathRandomSpy: jest.SpyInstance;
  beforeEach(() => {
    mathRandomSpy = jest.spyOn(Math, "random");
  });
  afterEach(() => {
    mathRandomSpy.mockRestore();
  });
  describe("Common shots", () => {
    it("Should be possible to miss the shot", () => {
      mathRandomSpy.mockReturnValue(0.9);
      const result = simulateShot({
        shooterShootingAttribute: 50,
        goalkeeperReflexesAttribute: 50,
      });

      expect(result).toBe("missed");
    });

    it("Should be possible to score goal", () => {
      mathRandomSpy.mockReturnValueOnce(0.1).mockReturnValueOnce(0.1);

      const result = simulateShot({
        shooterShootingAttribute: 90,
        goalkeeperReflexesAttribute: 50,
      });

      expect(result).toBe("goal");
    });

    it("Should be possible to  defend a shot", () => {
      mathRandomSpy
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.5);
      const result = simulateShot({
        shooterShootingAttribute: 50,
        goalkeeperReflexesAttribute: 90,
      });

      expect(result).toBe("defended");
    });

    it("Should be possible to  make a corner", () => {
      mathRandomSpy
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.1);

      const result = simulateShot({
        shooterShootingAttribute: 70,
        goalkeeperReflexesAttribute: 80,
      });

      expect(result).toBe("corner");
    });
  });

  describe("Penalties", () => {
    it("Should be possible to score a goal from a penalty", () => {
      mathRandomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.1);

      const result = simulateShot({
        shooterShootingAttribute: 80,
        goalkeeperReflexesAttribute: 70,
        isPenaltyKick: true,
      });

      expect(result).toBe("goal");
    });
    it("Should be possible to defend a penalty", () => {
      mathRandomSpy
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.4);

      const result = simulateShot({
        shooterShootingAttribute: 70,
        goalkeeperReflexesAttribute: 100,
        isPenaltyKick: true,
      });

      expect(result).toBe("defended");
    });
    it("Should be possible to make a corner from a penalty", () => {
      mathRandomSpy
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.2);

      const result = simulateShot({
        shooterShootingAttribute: 70,
        goalkeeperReflexesAttribute: 100,
        isPenaltyKick: true,
      });

      expect(result).toBe("corner");
    });
  });

  describe("Corners", () => {
    const cornerTaker = createMockPlayer({ vision: 80, shooting: 80 }); // (80*0.65 + 80*0.35)/100 = 0.8
    const headerPlayer = createMockPlayer({ shooting: 85 });
    const goalkeeper = createMockPlayer({ reflexes: 70 });

    it("Should be possible to miss a corner", () => {
      mathRandomSpy.mockReturnValue(0.95);
      const result = simulateCorner({ cornerTaker, headerPlayer, goalkeeper });
      expect(result).toBe("missed");
    });

    it("Should be possible to score a goal from a corner", () => {
      mathRandomSpy
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.1);
      const result = simulateCorner({ cornerTaker, headerPlayer, goalkeeper });
      expect(result).toBe("goal");
    });

    it("Should not make a corner from a corner", () => {
      mathRandomSpy
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.1);
      const result = simulateCorner({ cornerTaker, headerPlayer, goalkeeper });
      expect(result).toBe("defended");
    });
  });

  describe("Possession", () => {
    it("Should calculate possession", () => {
      const result = calculatePossession({
        homeTeamOverall: 80,
        awayTeamOverall: 73,
      });

      expect(result.home).toBeCloseTo(0.6);
      expect(result.away).toBeCloseTo(0.4);
    });

    it("Should apply modifiers", () => {
      const { home, away } = calculatePossession({
        homeTeamOverall: 70,
        awayTeamOverall: 73,
        homePossessionModifier: 0.2,
        awayPossessionModifier: -0.1,
      });

      expect(home).toBeCloseTo(0.65);
      expect(away).toBeCloseTo(0.35);
    });
    it("Should clamp the possession", () => {
      const { home, away } = calculatePossession({
        homeTeamOverall: 99,
        awayTeamOverall: 10,
        homePossessionModifier: 1.0,
      });
      expect(home).toBeCloseTo(0.9);
      expect(away).toBeCloseTo(0.1);
      const minResult = calculatePossession({
        homeTeamOverall: 10,
        awayTeamOverall: 99,
        awayPossessionModifier: 1.0,
      });
      expect(minResult.home).toBeCloseTo(0.1);
      expect(minResult.away).toBeCloseTo(0.9);
    });
  });

  describe("Getting total number of shots", () => {
    it("Should calculate the shots", () => {
      mathRandomSpy.mockReturnValue(0.5);
      const possession = 0.6;
      const tacticalModifier = 0.2;
      const shots = calculateTotalShots(possession, tacticalModifier);
      expect(shots).toBe(7);
    });

    it("Should vary the shots", () => {
      mathRandomSpy.mockReturnValue(0.9);
      const possession = 0.5;
      const tacticalModifier = 0;
      const shots = calculateTotalShots(possession, tacticalModifier);
      expect(shots).toBe(7);
    });

    it("Should make at least one shot in the match", () => {
      mathRandomSpy.mockReturnValue(0);
      const possession = 0.1;
      const tacticalModifier = -0.5;
      const shots = calculateTotalShots(possession, tacticalModifier);
      expect(shots).toBe(1);
    });
  });
});
