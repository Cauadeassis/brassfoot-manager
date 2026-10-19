import { StateCreator } from "zustand";
import {
  advanceCurrentDay,
  advanceUntilEventOrMatch as runUntilEventOrMatch,
} from "../../gameEngine/calendar/advance";
import { GameState, SimulationInterrupt } from "../../types/state";
import type { CalendarActions, GameStore } from "../types";

export const createCalendarSlice: StateCreator<
  GameStore,
  [["zustand/immer", never]],
  [],
  CalendarActions
> = (set) => ({
  advanceDay: () =>
    set((state) => {
      advanceCurrentDay(state as unknown as GameState);
    }),

  advanceUntilEventOrMatch: () => {
    let outcome: SimulationInterrupt | null = null;
    set((state) => {
      outcome = runUntilEventOrMatch(state as unknown as GameState);
    });
    if (!outcome) throw new Error("A simulação não retornou um resultado.");
    return outcome;
  },
});
