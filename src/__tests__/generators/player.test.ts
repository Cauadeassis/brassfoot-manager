import {
  advanceMonth,
  advanceYear,
  calculateMarketValue,
  calculateOverall,
  generatePlayer,
  generateSkills,
  getPlayerTeam,
} from "../../gameEngine/player";
import { Position } from "../../types/player";
describe("Player Logic", () => {
  describe("calculateOverall", () => {
    it("Should calculate overall", () => {
      const skills = {
        reflexes: 0,
        physical: 100,
        vision: 100,
        shooting: 100,
      };
      const overall = calculateOverall({ position: "GK", skills });
      expect(overall).toBe(55);
    });

    it("Should throw error if the position is invalid", () => {
      expect(() => {
        calculateOverall({ position: "INVALID" as any, skills: {} as any });
      }).toThrow("Invalid position: INVALID");
    });
  });
  describe("calculateMarketValue", () => {
    it("Should return the minimum value", () => {
      const value = calculateMarketValue({ overall: 40, age: 20 });
      expect(value).toBe(7500);
    });

    it("Should apply young age debuff", () => {
      const valueYoung = calculateMarketValue({ overall: 70, age: 19 });
      const valueNormal = calculateMarketValue({ overall: 70, age: 28 });
      expect(valueYoung).toBeLessThan(valueNormal);
    });

    it("Should apply prime age buff", () => {
      const valuePrime = calculateMarketValue({ overall: 80, age: 23 });
      const valueNormal = calculateMarketValue({ overall: 80, age: 28 });
      expect(valuePrime).toBeGreaterThan(valueNormal);
    });

    it("Should apply veteran age debuff", () => {
      const valueOld = calculateMarketValue({ overall: 80, age: 35 });
      const valueNormal = calculateMarketValue({ overall: 80, age: 28 });
      expect(valueOld).toBeLessThan(valueNormal);
    });

    it("Should apply exponential multiplier for top tier players", () => {
      const val99 = calculateMarketValue({ overall: 99, age: 25 });
      const val100 = calculateMarketValue({ overall: 100, age: 25 });
      expect(val100).toBeGreaterThan(val99 * 1.2);
    });
  });
  describe("generateSkills", () => {
    it.each([
      {
        position: "GK" as Position,
        expected: ["reflexes"],
        forbidden: ["dribbling", "defense"],
      },
      {
        position: "CA" as Position,
        expected: ["dribbling"],
        forbidden: ["defense", "reflexes"],
      },
      {
        position: "LE" as Position,
        expected: ["dribbling", "defense"],
        forbidden: ["reflexes"],
      },
    ])(
      "Should generate the position respective skills",
      ({ position, expected, forbidden }) => {
        const skills = generateSkills({
          position: position,
          baseOverall: 70,
        });

        expected.forEach((skill) => {
          expect(skills).toHaveProperty(skill);
        });

        forbidden.forEach((skill) => {
          expect(skills).not.toHaveProperty(skill);
        });
      },
    );
    it("Should throw error for invalid positions", () => {
      expect(() => {
        generateSkills({ position: "UNKNOWN" as any, baseOverall: 70 });
      }).toThrow("Invalid position: UNKNOWN");
    });
  });
  describe("generatePlayer", () => {
    const mockTeam = {
      id: "team-br",
      nationality: "BR",
      type: "national",
      overall: 75,
    } as any;

    it("Should create a masculine player", async () => {
      const player = await generatePlayer({
        position: "GK",
        team: mockTeam,
        modality: "masculine",
      });
      expect(player.nationality).toBe("BR");
      expect(player.currentTeamId).toBe("team-br");
      expect(player.stamina).toBe(100);
    });

    it("Should create a feminine player", async () => {
      const player = await generatePlayer({
        position: "GK",
        team: mockTeam,
        modality: "feminine",
      });
      expect(player.nationality).toBe("BR");
      expect(player.currentTeamId).toBe("team-br");
      expect(player.stamina).toBe(100);
    });

    it("Should throw error if the nationality is not supported", async () => {
      const badTeam = { ...mockTeam, nationality: "JAP" };
      await expect(
        generatePlayer({
          position: "GK",
          team: badTeam,
          modality: "masculine",
        }),
      ).rejects.toThrow("Nationality JAP is not supported.");
    });
  });
});
