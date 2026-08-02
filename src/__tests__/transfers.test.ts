import {
  generateOffer,
  makeTransfer,
  processAITransfers,
} from "../gameEngine/market";

const createMockPlayer = (
  id: string,
  currentTeamId: string | null = null,
  overall: number = 70,
  value: number = 1000000,
  position: string = "ATA",
): any => ({
  id,
  name: `Player ${id}`,
  currentTeamId,
  overall,
  value,
  position,
});
const createMockTeam = (
  id: string,
  money: number = 5000000,
  playerIds: string[] = [],
): any => ({
  id,
  name: `Team ${id}`,
  money,
  squad: { playerIds: [...playerIds] },
});

const createMockGameState = (userTeamId: string = "team1"): any => ({
  userTeamId,
  modality: "masculine",
  teams: {
    team1: createMockTeam("team1", 10000000, ["p1"]),
    team2: createMockTeam("team2", 5000000, ["p2", "p3"]),
  },
  players: {
    p1: createMockPlayer("p1", "team1", 75, 2000000),
    p2: createMockPlayer("p2", "team2", 70, 1000000),
    p3: createMockPlayer("p3", "team2", 60, 500000),
    freeAgent: createMockPlayer("freeAgent", null, 70, 1500000),
  },
});
describe("Market Logic (market.ts)", () => {
  let draft: any;
  beforeEach(() => {
    jest.restoreAllMocks();
    draft = createMockGameState();
  });
  describe("makeTransfer", () => {
    it("Should throw error if no buyer and seller", () => {
      expect(() => {
        makeTransfer({
          draft,
          transferOffer: {
            playerId: "p1",
            value: 100,
            buyerTeamId: null,
            sellerTeamId: null,
          },
        });
      }).toThrow();
    });

    it("Should throw error if invalid player", () => {
      expect(() => {
        makeTransfer({
          draft,
          transferOffer: {
            playerId: "ghost",
            value: 100,
            buyerTeamId: "team1",
            sellerTeamId: null,
          },
        });
      }).toThrow();
    });

    it("Should throw error if player is not free in the market", () => {
      expect(() => {
        makeTransfer({
          draft,
          transferOffer: {
            playerId: "p2",
            value: 100,
            buyerTeamId: "team1",
            sellerTeamId: null,
          },
        });
      }).toThrow();
    });

    it("Should throw error if player was not found in the origin team", () => {
      expect(() => {
        makeTransfer({
          draft,
          transferOffer: {
            playerId: "p2",
            value: 100,
            buyerTeamId: "team2",
            sellerTeamId: "team1",
          },
        });
      }).toThrow();
    });

    it("Should throw missing money error", () => {
      expect(() => {
        makeTransfer({
          draft,
          transferOffer: {
            playerId: "p2",
            value: 20000000,
            buyerTeamId: "team1",
            sellerTeamId: "team2",
          },
        });
      }).toThrow();
    });

    it("Should return null if NPC team does not have enough money", () => {
      const result = makeTransfer({
        draft,
        transferOffer: {
          playerId: "p1",
          value: 20000000,
          buyerTeamId: "team2",
          sellerTeamId: "team1",
        },
      });
      expect(result).toBeNull();
    });

    it("Should buy player from another team", () => {
      makeTransfer({
        draft,
        transferOffer: {
          playerId: "p2",
          value: 1_000_000,
          buyerTeamId: "team1",
          sellerTeamId: "team2",
        },
      });
      expect(draft.teams.team1.money).toBe(9_000_000);
      expect(draft.teams.team2.money).toBe(6_000_000);
      expect(draft.teams.team1.squad.playerIds).toContain("p2");
      expect(draft.teams.team2.squad.playerIds).not.toContain("p2");
      expect(draft.players["p2"].currentTeamId).toBe("team1");
    });
    it("Should buy player from free market", () => {
      makeTransfer({
        draft,
        transferOffer: {
          playerId: "freeAgent",
          value: 500000,
          buyerTeamId: "team1",
          sellerTeamId: null,
        },
      });
      expect(draft.teams.team1.money).toBe(9500000);
      expect(draft.players["freeAgent"].currentTeamId).toBe("team1");
    });
    it("Should sell player", () => {
      makeTransfer({
        draft,
        transferOffer: {
          playerId: "p1",
          value: 0,
          buyerTeamId: null,
          sellerTeamId: "team1",
        },
      });
      expect(draft.players["p1"].currentTeamId).toBeNull();
      expect(draft.teams.team1.squad.playerIds).not.toContain("p1");
    });
  });

  describe("processAITransfers", () => {
    it("Should sell players", () => {
      const aiTeamIds = Array.from({ length: 23 }, (_, i) => `ata_${i}`);
      draft.teams.team2.squad.playerIds = aiTeamIds;
      aiTeamIds.forEach((id, i) => {
        draft.players[id] = createMockPlayer(id, "team2", 80 - i, 1000, "ATA");
      });
      processAITransfers(draft);
      expect(draft.players["ata_22"].currentTeamId).toBeNull();
      expect(draft.teams.team2.money).toBe(5000000 + 1000);
    });

    it("Should buy free agent", () => {
      draft.teams.team2.squad.playerIds = [];
      draft.teams.team2.money = 3000000;
      processAITransfers(draft);
      expect(draft.teams.team2.squad.playerIds).toContain("freeAgent");
      expect(draft.players["freeAgent"].currentTeamId).toBe("team2");
      expect(draft.teams.team2.money).toBe(1500000);
    });

    it("Should not affect other teams", () => {
      draft.teams.team1.squad.playerIds = [];
      draft.teams.team1.money = 10_000_000;
      draft.teams.team2.money = 0;
      processAITransfers(draft);
      expect(draft.teams.team1.squad.playerIds).toHaveLength(0);
      expect(draft.players["freeAgent"].currentTeamId).toBeNull();
    });
  });

  describe("generateOffer", () => {
    it("Should return null if user already has 3 offers", () => {
      const offer = generateOffer({
        teams: Object.values(draft.teams),
        players: draft.players,
        userTeamId: "team1",
        currentCount: 3,
      });
      expect(offer).toBeNull();
    });

    it("Should not generate an offer if user team does not have >=72 overall players", () => {
      draft.players["p1"].overall = 70;
      const offer = generateOffer({
        teams: Object.values(draft.teams),
        players: draft.players,
        userTeamId: "team1",
        currentCount: 0,
      });
      expect(offer).toBeNull();
    });

    it("Should not generate an offer if random factor >= 0.5", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.5);
      const offer = generateOffer({
        teams: Object.values(draft.teams),
        players: draft.players,
        userTeamId: "team1",
        currentCount: 0,
      });
      expect(offer).toBeNull();
    });

    it("Should generate an offer", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.2);
      const offer = generateOffer({
        teams: Object.values(draft.teams),
        players: draft.players,
        userTeamId: "team1",
        currentCount: 0,
      });
      expect(offer).not.toBeNull();
      expect(offer?.playerId).toBe("p1");
      expect(offer?.sellerTeamId).toBe("team1");
      expect(offer?.buyerTeamId).toBe("team2");
      expect(offer?.value).toBe(2400000);
    });
  });
});
