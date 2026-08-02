import {
  addPlayer,
  getGoalkeeper,
  getSquad,
  getStats,
  initialTeamStatistics,
  processTransfer,
  removePlayer,
  updateOverall,
} from "../../gameEngine/team";
import { Player } from "../../types/player";
import { Team } from "../../types/team";

describe("Team Management", () => {
  let argentina: Team;
  let mockPlayersMap: Record<string, Player>;
  beforeEach(() => {
    argentina = {
      id: "team-1",
      nationality: "AR",
      shield: "../shield",
      name: "Argentina",
      type: "national",
      division: "A",
      description: "Time dos infernos",
      money: 1000,
      overall: 0,
      rankingScore: 0,
      history: { 2026: initialTeamStatistics },
      trophies: {},
      squad: {
        playerIds: ["LionelMessi", "DibuMartinez"],
        starterIds: ["LionelMessi", "DibuMartinez"],
        playerShirts: { LionelMessi: 10, DibuMartinez: 1 },
      },
      tactics: {
        formation: "4-2-3-1",
        style: "offensive",
        captainId: "LionelMessi",
        takers: {
          penalty: null,
          freeKick: "LionelMessi",
          corner: "LionelMessi",
        },
      },
    };

    mockPlayersMap = {
      LionelMessi: {
        id: "LionelMessi",
        name: "Lionel Messi",
        currentTeamId: "team-1",
        position: "MA",
        nationality: "AR",
        currentSkills: {
          reflexes: 100,
          physical: 100,
          shooting: 100,
          vision: 100,
        },
        potentialSkills: {
          reflexes: 100,
          physical: 100,
          shooting: 100,
          vision: 100,
        },
        value: 250_000_000,
        stamina: 100,
        history: {},
        trophies: {},
        overall: 100,
        age: 39,
      },
      DibuMartinez: {
        id: "DibuMartinez",
        name: "Dibu Martinez",
        currentTeamId: "team-1",
        position: "GK",
        nationality: "AR",
        currentSkills: {
          reflexes: 90,
          physical: 90,
          shooting: 90,
          vision: 90,
        },
        potentialSkills: {
          reflexes: 90,
          physical: 90,
          shooting: 90,
          vision: 90,
        },
        value: 100_000_000,
        stamina: 100,
        history: {},
        trophies: {},
        overall: 90,
        age: 22,
      },
      DiMaria: {
        id: "DiMaria",
        name: "Di Maria",
        currentTeamId: "team-1",
        position: "PD",
        nationality: "AR",
        currentSkills: {
          reflexes: 95,
          physical: 95,
          shooting: 95,
          vision: 95,
        },
        potentialSkills: {
          reflexes: 95,
          physical: 95,
          shooting: 95,
          vision: 95,
        },
        value: 120_000_000,
        stamina: 100,
        history: {},
        trophies: {},
        overall: 95,
        age: 22,
      },
    };
  });

  describe("Adding and removing", () => {
    it("Should add 'Di Maria' to Argentina players", () => {
      const updatedArgentina = addPlayer({
        team: argentina,
        playerId: "DiMaria",
      });
      expect(updatedArgentina.squad.playerIds).toContain("DiMaria");
      expect(updatedArgentina.squad.playerIds).toHaveLength(3);
    });

    it("Should not duplicate if player already exists", () => {
      const updatedArgentina = addPlayer({
        team: argentina,
        playerId: "LionelMessi",
      });
      expect(updatedArgentina.squad.playerIds).toHaveLength(2);
    });

    it("Should completely remove player", () => {
      const updatedArgentina = removePlayer({
        team: argentina,
        playerId: "LionelMessi",
      });

      expect(updatedArgentina.squad.playerIds).not.toContain("LionelMessi");
      expect(updatedArgentina.squad.starterIds).not.toContain("LionelMessi");
      expect(
        updatedArgentina.squad.playerShirts["LionelMessi"],
      ).toBeUndefined();
      expect(updatedArgentina.tactics.captainId).toBeNull();
      expect(updatedArgentina.tactics.takers.corner).toBeNull();
      expect(updatedArgentina.tactics.takers.freeKick).toBeNull();
    });
  });

  describe("Getting squad", () => {
    it("Should get players", () => {
      const squad = getSquad({ team: argentina, playersMap: mockPlayersMap });
      expect(squad).toHaveLength(2);
      expect(squad[0].id).toBe("LionelMessi");
    });

    it("Should return the starter GK", () => {
      const gk = getGoalkeeper({ team: argentina, playersMap: mockPlayersMap });
      expect(gk.id).toBe("DibuMartinez");
      expect(gk.position).toBe("GK");
    });

    it("Should throw error if team doesn't have a starter GK", () => {
      argentina.squad.starterIds = ["LionelMessi"];
      expect(() => {
        getGoalkeeper({ team: argentina, playersMap: mockPlayersMap });
      }).toThrow();
    });
  });

  describe("Managing team", () => {
    it("Should return correct overall", () => {
      argentina.squad.starterIds = [
        "LionelMessi",
        "LionelMessi",
        "LionelMessi",
        "LionelMessi",
        "LionelMessi",
        "LionelMessi",
        "LionelMessi",
        "LionelMessi",
        "LionelMessi",
        "LionelMessi",
        "LionelMessi",
      ];
      const updatedArgentina = updateOverall({
        team: argentina,
        playersMap: mockPlayersMap,
      });

      expect(updatedArgentina.overall).toBe(100);
    });

    it("Should return 0 overall if doesn't have starters", () => {
      argentina.squad.starterIds = [];
      const updatedArgentina = updateOverall({
        team: argentina,
        playersMap: mockPlayersMap,
      });
      expect(updatedArgentina.overall).toBe(0);
    });

    it("Should return statistics", () => {
      const stats2026 = getStats({ team: argentina, season: 2026 });
      expect(stats2026).toEqual(initialTeamStatistics);
      const stats2027 = getStats({ team: argentina, season: 2027 });
      expect(stats2027).toEqual(initialTeamStatistics);
    });
  });

  describe("Transfers", () => {
    it("Should buy player", () => {
      const argentinaAfterBuying = processTransfer({
        team: argentina,
        playerId: "DiMaria",
        value: 500,
        role: "buyer",
        playersMap: mockPlayersMap,
      });
      expect(argentinaAfterBuying.money).toBe(500);
      expect(argentinaAfterBuying.squad.playerIds).toContain("DiMaria");
    });

    it("Should sell player", () => {
      const argentinaAfterSelling = processTransfer({
        team: argentina,
        playerId: "LionelMessi",
        value: 2000,
        role: "seller",
        playersMap: mockPlayersMap,
      });

      expect(argentinaAfterSelling.money).toBe(3000);
      expect(argentinaAfterSelling.squad.playerIds).not.toContain(
        "LionelMessi",
      );
    });
  });
});
