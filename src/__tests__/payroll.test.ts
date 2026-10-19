import type { GameState } from "../types/state";
import {
  accrueDailyPayroll,
  settleMonthlyPayroll,
} from "../gameEngine/payroll";

const createState = (): GameState =>
  ({
    currentDate: "2026-01-01",
    players: {
      player: {
        id: "player",
        name: "Player",
        currentTeamId: "club",
        contract: {
          startDate: "2026-01-01",
          endDate: "2026-12-31",
          salary: 31_000,
          signingBonus: 0,
        },
      },
    },
    teams: { club: { id: "club", money: 100_000 } },
    payrollSalaryDays: {},
  }) as unknown as GameState;

describe("monthly payroll", () => {
  it("charges a full monthly salary for a full January contract", () => {
    const state = createState();

    for (let day = 1; day <= 31; day++) {
      accrueDailyPayroll(state, `2026-01-${String(day).padStart(2, "0")}`);
    }
    state.currentDate = "2026-02-01";
    settleMonthlyPayroll(state);

    expect(state.teams.club.money).toBe(69_000);
    expect(state.payrollSalaryDays).toEqual({});
  });

  it("prorates the salary for a contract that starts mid-month", () => {
    const state = createState();
    state.players.player.contract!.startDate = "2026-01-16";

    for (let day = 1; day <= 31; day++) {
      accrueDailyPayroll(state, `2026-01-${String(day).padStart(2, "0")}`);
    }
    state.currentDate = "2026-02-01";
    settleMonthlyPayroll(state);

    expect(state.teams.club.money).toBe(84_000);
  });

  it("prorates the salary through the inclusive contract end date", () => {
    const state = createState();
    state.players.player.contract!.endDate = "2026-01-15";

    for (let day = 1; day <= 31; day++) {
      accrueDailyPayroll(state, `2026-01-${String(day).padStart(2, "0")}`);
    }
    state.currentDate = "2026-02-01";
    settleMonthlyPayroll(state);

    expect(state.teams.club.money).toBe(85_000);
  });

  it("splits prorated wages between the player's old and new clubs", () => {
    const state = createState();
    state.teams.newClub = {
      id: "newClub",
      money: 100_000,
    } as GameState["teams"][string];

    for (let day = 1; day <= 31; day++) {
      if (day === 16) {
        state.players.player.currentTeamId = "newClub";
        state.players.player.contract!.startDate = "2026-01-16";
      }
      accrueDailyPayroll(state, `2026-01-${String(day).padStart(2, "0")}`);
    }
    state.currentDate = "2026-02-01";
    settleMonthlyPayroll(state);

    expect(state.teams.club.money).toBe(85_000);
    expect(state.teams.newClub.money).toBe(84_000);
  });

  it("uses the actual number of days in a leap February", () => {
    const state = createState();
    state.players.player.contract!.salary = 29_000;
    state.players.player.contract!.startDate = "2024-02-01";
    state.players.player.contract!.endDate = "2024-02-29";

    for (let day = 1; day <= 29; day++) {
      accrueDailyPayroll(state, `2024-02-${String(day).padStart(2, "0")}`);
    }
    state.currentDate = "2024-03-01";
    settleMonthlyPayroll(state);

    expect(state.teams.club.money).toBe(71_000);
  });

  it("does not charge until the first day and clears an invoice after payment", () => {
    const state = createState();
    state.payrollSalaryDays.club = 31_000 * 31;
    state.currentDate = "2026-01-31";

    settleMonthlyPayroll(state);
    expect(state.teams.club.money).toBe(100_000);

    state.currentDate = "2026-02-01";
    settleMonthlyPayroll(state);
    settleMonthlyPayroll(state);

    expect(state.teams.club.money).toBe(69_000);
    expect(state.payrollSalaryDays).toEqual({});
  });

  it("allows a team balance to become negative", () => {
    const state = createState();
    state.teams.club.money = 10_000;
    state.payrollSalaryDays.club = 31_000 * 31;
    state.currentDate = "2026-02-01";

    settleMonthlyPayroll(state);

    expect(state.teams.club.money).toBe(-21_000);
  });
});
