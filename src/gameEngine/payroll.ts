import type { GameState } from "../types/state";
import { isContractActive } from "./contracts";

type PayrollState = Pick<
  GameState,
  "currentDate" | "players" | "teams" | "payrollSalaryDays"
>;

export function accrueDailyPayroll(state: PayrollState, date: string): void {
  state.payrollSalaryDays ??= {};
  Object.values(state.players).forEach((player) => {
    const teamId = player.currentTeamId;
    if (
      !teamId ||
      !state.teams[teamId] ||
      !player.contract ||
      !isContractActive(player.contract, date)
    ) {
      return;
    }

    state.payrollSalaryDays[teamId] =
      (state.payrollSalaryDays[teamId] ?? 0) + player.contract.salary;
  });
}

export function settleMonthlyPayroll(state: PayrollState): void {
  state.payrollSalaryDays ??= {};
  const [year, month, day] = state.currentDate.split("-").map(Number);
  if (day !== 1) return;

  const daysInPreviousMonth = new Date(year, month - 1, 0).getDate();
  Object.entries(state.payrollSalaryDays).forEach(([teamId, salaryDays]) => {
    const team = state.teams[teamId];
    if (team) team.money -= Math.round(salaryDays / daysInPreviousMonth);
  });

  state.payrollSalaryDays = {};
}
