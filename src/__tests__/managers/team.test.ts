import { BASE_TEAM_COLORS } from "../../data/uniforms";
import {
  addPlayer,
  assignShirtNumbers,
  getGoalkeeper,
  getSquad,
  getTeamStats,
  initialTeamStatistics,
  processTransfer,
  removePlayer,
  resetTakersForStarters,
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
      uniformDesign: {
        design: "verticalLines",
        colors: {
          primary: BASE_TEAM_COLORS.skyBlue,
          secondary: BASE_TEAM_COLORS.white,
          number: BASE_TEAM_COLORS.black,
        },
      },
      nationality: "AR",
      shield: "../shield",
      name: "Argentina",
      type: "national",
      division: "A",
      description: "Time dos infernos",
      money: 1000,
      overall: 0,
      rankingScore: 0,
      history: {},
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

    it("Should clear takers when starters change and a taker leaves the starting XI", () => {
      const updatedArgentina = resetTakersForStarters({
        team: {
          ...argentina,
          tactics: {
            ...argentina.tactics,
            takers: {
              penalty: "LionelMessi",
              freeKick: "DibuMartinez",
              corner: "LionelMessi",
            },
          },
        },
        starterIds: ["DibuMartinez"],
      });

      expect(updatedArgentina.tactics.takers.penalty).toBeNull();
      expect(updatedArgentina.tactics.takers.freeKick).toBe("DibuMartinez");
      expect(updatedArgentina.tactics.takers.corner).toBeNull();
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

  describe("assignShirtNumbers", () => {
    it("should assign goalkeeper and starter numbers without duplicates", () => {
      const players: Record<string, Player> = {
        gkStarter: {
          id: "gkStarter",
          name: "GK Starter",
          currentTeamId: "team-1",
          position: "GK",
          age: 26,
          nationality: "AR",
          overall: 80,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            reflexes: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            reflexes: 10,
          },
          value: 1000000,
          stamina: 90,
          history: {},
          trophies: {},
        },
        gkReserve: {
          id: "gkReserve",
          name: "GK Reserve",
          currentTeamId: "team-1",
          position: "GK",
          age: 24,
          nationality: "AR",
          overall: 75,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            reflexes: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            reflexes: 10,
          },
          value: 500000,
          stamina: 85,
          history: {},
          trophies: {},
        },
        z1: {
          id: "z1",
          name: "Z1",
          currentTeamId: "team-1",
          position: "ZA",
          age: 29,
          nationality: "AR",
          overall: 78,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          value: 700000,
          stamina: 88,
          history: {},
          trophies: {},
        },
        z2: {
          id: "z2",
          name: "Z2",
          currentTeamId: "team-1",
          position: "ZA",
          age: 28,
          nationality: "AR",
          overall: 77,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          value: 650000,
          stamina: 86,
          history: {},
          trophies: {},
        },
        ld: {
          id: "ld",
          name: "LD",
          currentTeamId: "team-1",
          position: "LD",
          age: 27,
          nationality: "AR",
          overall: 76,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          value: 600000,
          stamina: 85,
          history: {},
          trophies: {},
        },
        le: {
          id: "le",
          name: "LE",
          currentTeamId: "team-1",
          position: "LE",
          age: 27,
          nationality: "AR",
          overall: 76,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          value: 600000,
          stamina: 85,
          history: {},
          trophies: {},
        },
        vol: {
          id: "vol",
          name: "VOL",
          currentTeamId: "team-1",
          position: "VOL",
          age: 30,
          nationality: "AR",
          overall: 80,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          value: 700000,
          stamina: 87,
          history: {},
          trophies: {},
        },
        ma: {
          id: "ma",
          name: "MA",
          currentTeamId: "team-1",
          position: "MA",
          age: 25,
          nationality: "AR",
          overall: 82,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          value: 800000,
          stamina: 88,
          history: {},
          trophies: {},
        },
        mc: {
          id: "mc",
          name: "MC",
          currentTeamId: "team-1",
          position: "MC",
          age: 26,
          nationality: "AR",
          overall: 79,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          value: 650000,
          stamina: 86,
          history: {},
          trophies: {},
        },
        pd: {
          id: "pd",
          name: "PD",
          currentTeamId: "team-1",
          position: "PD",
          age: 27,
          nationality: "AR",
          overall: 77,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          value: 650000,
          stamina: 85,
          history: {},
          trophies: {},
        },
        pe: {
          id: "pe",
          name: "PE",
          currentTeamId: "team-1",
          position: "PE",
          age: 24,
          nationality: "AR",
          overall: 78,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          value: 680000,
          stamina: 86,
          history: {},
          trophies: {},
        },
        ca: {
          id: "ca",
          name: "CA",
          currentTeamId: "team-1",
          position: "CA",
          age: 29,
          nationality: "AR",
          overall: 81,
          currentSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          potentialSkills: {
            shooting: 10,
            vision: 10,
            physical: 10,
            defense: 10,
            dribbling: 10,
          },
          value: 850000,
          stamina: 88,
          history: {},
          trophies: {},
        },
      };

      const starterIds = [
        "gkStarter",
        "z1",
        "z2",
        "ld",
        "le",
        "vol",
        "ma",
        "mc",
        "pd",
        "pe",
        "ca",
      ];
      const playersWithReserves = {
        ...players,
        meReserve: { ...players.pe, id: "meReserve", position: "ME" as const },
        peReserve: { ...players.pe, id: "peReserve" },
      };

      const standardShirts = assignShirtNumbers({
        playerIds: Object.keys(players),
        starterIds,
        players,
      });
      const playerShirts = assignShirtNumbers({
        playerIds: ["meReserve", "peReserve", ...Object.keys(players)],
        starterIds,
        players: playersWithReserves,
      });

      expect(standardShirts.gkStarter).toBe(1);
      expect(standardShirts.gkReserve).toBe(12);
      expect(playerShirts.pe).toBe(11);
      expect(playerShirts.ca).toBe(9);
      expect(playerShirts.pd).toBe(7);

      const starterNumbers = starterIds
        .map((playerId) => playerShirts[playerId])
        .sort((a, b) => a - b);

      expect(starterNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      expect(new Set(starterNumbers).size).toBe(11);
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
      const stats2026 = getTeamStats({ team: argentina, season: 2026 });
      expect(stats2026).toEqual(initialTeamStatistics);
      const stats2027 = getTeamStats({ team: argentina, season: 2027 });
      expect(stats2027).toEqual(initialTeamStatistics);
    });
  });

  describe("Transfers", () => {
    it("Should update shirt numbers when buying and selling players", () => {
      const teamAfterBuying = processTransfer({
        team: argentina,
        playerId: "DiMaria",
        value: 500,
        role: "buyer",
        playersMap: mockPlayersMap,
      });

      expect(teamAfterBuying.squad.playerShirts["DiMaria"]).toBeDefined();

      const teamAfterSelling = processTransfer({
        team: teamAfterBuying,
        playerId: "DiMaria",
        value: 500,
        role: "seller",
        playersMap: mockPlayersMap,
      });

      expect(teamAfterSelling.squad.playerShirts["DiMaria"]).toBeUndefined();
      expect(Object.values(teamAfterSelling.squad.playerShirts)).toHaveLength(
        2,
      );
    });

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
