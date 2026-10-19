import {
  createContractFromOffer,
  evaluatePlayerContractOffer,
  generateAIContractOffer,
  isContractActive,
  validateContractOffer,
} from "../gameEngine/contracts";
import { makeTransfer } from "../gameEngine/market";

describe("contract logic", () => {
  it("calculates a monthly salary at 5% of market value per year", () => {
    expect(
      generateAIContractOffer({
        age: 24,
        overall: 88,
        value: 100_000_000,
        maxWageCommitment: 30_000_000,
      }),
    ).toEqual({ durationInMonths: 54, salary: 416_667, signingBonus: 0 });
  });

  it("limits the contract duration to the AI wage commitment", () => {
    expect(
      generateAIContractOffer({
        age: 20,
        overall: 92,
        value: 100_000_000,
        maxWageCommitment: 1_250_001,
      }),
    ).toEqual({ durationInMonths: 3, salary: 416_667, signingBonus: 0 });
  });

  it("returns no offer when fewer than three months are affordable", () => {
    expect(
      generateAIContractOffer({
        age: 20,
        overall: 92,
        value: 100_000_000,
        maxWageCommitment: 1_250_000,
      }),
    ).toBeNull();
  });

  it("rejects offers outside supported ranges", () => {
    expect(
      validateContractOffer({
        durationInMonths: 2,
        salary: 1,
        signingBonus: 0,
      }),
    ).toBe("INVALID_DURATION");
  });

  it("accepts a package that meets the player's salary and guaranteed value expectations", () => {
    expect(
      evaluatePlayerContractOffer({
        age: 24,
        overall: 88,
        value: 100_000_000,
        offer: {
          durationInMonths: 54,
          salary: 416_667,
          signingBonus: 0,
        },
      }).accepted,
    ).toBe(true);
  });

  it("rejects a low salary even when the transfer fee is high", () => {
    expect(
      evaluatePlayerContractOffer({
        age: 24,
        overall: 88,
        value: 100_000_000,
        offer: {
          durationInMonths: 54,
          salary: 100_000,
          signingBonus: 40_000_000,
        },
      }).accepted,
    ).toBe(false);
  });

  it("clamps a month-end start date when creating the contract", () => {
    const contract = createContractFromOffer(
      { durationInMonths: 3, salary: 100, signingBonus: 0 },
      "2024-11-30",
    );

    expect(contract.endDate).toBe("2025-02-28");
  });

  it("handles leap days and treats contract end dates as active", () => {
    const contract = createContractFromOffer(
      { durationInMonths: 12, salary: 100, signingBonus: 0 },
      "2024-02-29",
    );

    expect(contract.endDate).toBe("2025-02-28");
    expect(isContractActive(contract, "2024-02-29")).toBe(true);
    expect(isContractActive(contract, "2025-02-28")).toBe(true);
    expect(isContractActive(contract, "2025-03-01")).toBe(false);
  });

  it("creates a new contract when a player joins a club", () => {
    const player = {
      id: "player",
      name: "Player",
      currentTeamId: "seller",
      age: 24,
      overall: 88,
      value: 100_000_000,
      contract: null,
    };
    const draft = {
      currentDate: "2026-04-01",
      players: { player },
      teams: {
        seller: { id: "seller", money: 0, squad: { playerIds: ["player"] } },
        buyer: {
          id: "buyer",
          type: "club",
          money: 200_000_000,
          squad: { playerIds: [] },
        },
      },
    } as any;

    makeTransfer({
      draft,
      transferOffer: {
        playerId: "player",
        buyerTeamId: "buyer",
        sellerTeamId: "seller",
        value: 100_000_000,
        contractOffer: {
          durationInMonths: 54,
          salary: 416_667,
          signingBonus: 0,
        },
      },
    });

    expect(player.contract).toMatchObject({
      startDate: "2026-04-01",
      salary: 416_667,
    });
  });
});
