import {
  generateMatches,
  generateLeagueMatches,
  generateCupMatches,
  generateMixedMatches,
} from "../../gameEngine/generators/matches";
const createMockTeam = (id: string, division: string = "A"): any => ({
  id,
  division,
});

describe("Match Generators (matches.ts)", () => {
  describe("generateLeagueMatches (Round Robin)", () => {
    it("deve gerar rodadas de turno e returno para 4 times", () => {
      const teams = [
        createMockTeam("T1"),
        createMockTeam("T2"),
        createMockTeam("T3"),
        createMockTeam("T4"),
      ];
      const rounds = generateLeagueMatches({
        teams,
        competitionId: "BR_league",
        rules: { format: "league", leagueGamesPerOpponent: 2 } as any,
      });

      expect(rounds).toHaveLength(6);
      expect(rounds[0]).toHaveLength(2);
    });
    it("Should generate even with odd number of teams", () => {
      const teams = [
        createMockTeam("T1"),
        createMockTeam("T2"),
        createMockTeam("T3"),
      ];
      const rounds = generateLeagueMatches({
        teams,
        competitionId: "BR_league",
        rules: { format: "league", leagueGamesPerOpponent: 1 } as any,
      });
      expect(rounds).toHaveLength(3);
      expect(rounds[0]).toHaveLength(1);
    });
  });

  describe("generateCupMatches (Mata-Mata)", () => {
    it("Should generate home and away games", () => {
      const teams = [
        createMockTeam("T1"),
        createMockTeam("T2"),
        createMockTeam("T3"),
        createMockTeam("T4"),
      ];
      const rounds = generateCupMatches({
        teams,
        competitionId: "BR_league",
        rules: { format: "cup", knockoutGamesPerRound: 2 } as any,
      });
      expect(rounds).toHaveLength(2);
    });
  });

  describe("generateMixedMatches (Grupos)", () => {
    it("Should generate group stage", () => {
      const teams = Array.from({ length: 8 }, (_, i) =>
        createMockTeam(`T${i + 1}`),
      );
      const rounds = generateMixedMatches({
        teams,
        competitionId: "BR_league",
        rules: {
          format: "mixed",
          groupSize: 4,
          groupStageGamesPerRound: 1,
        } as any,
      });
      expect(rounds).toHaveLength(3);
      expect(rounds[0]).toHaveLength(4);
    });
  });
  describe("generateMatches (Função Principal)", () => {
    it("Should throw error if teams array is empty", () => {
      expect(() => {
        generateMatches({
          teams: [],
          rules: { format: "league" } as any,
          competitionId: "BR_league",
        });
      }).toThrow();
    });

    it("Should generate matches", () => {
      const teams = [createMockTeam("T1"), createMockTeam("T2")];
      const rounds = generateMatches({
        teams,
        rules: { format: "cup" } as any,
        competitionId: "BR_league",
      });
      expect(rounds).toBeDefined();
    });
  });
});
