import { create } from "zustand";
import { Region } from "../types/competition";
import { LineupType, PositionGroup } from "../app/(game)/squad/page";
import { Division, TeamType } from "../types/team";
import { Position } from "../types/player";
import { Nationality } from "../data/nationalities";
import { CompetitionId } from "../types/competition";

export type ScorerSortKey = "goals" | "matchesPlayed" | "assists" | "defenses";
export type TransferPlayerSortKey = "overall" | "age" | "value";
export interface Filters {
  searchQuery: string;
  region: Region | "all";
  positionGroup: PositionGroup | "all";
  playerSort: "overall" | "position" | "age";
  lineupStatus: LineupType | "all";
  teamType: TeamType;
  division: Division;
  round: number | "all";
  month: number | "all";
  position: Position | "all";
  teamId: string | "all";
  nationality: Nationality | "all";
  competitionId: CompetitionId | "all";
  competitionScope: CompetitionScope | "all";
  competitionType: CompetitionType | "all";
  generalCompetitionId: CompetitionId | null;
  sortKey: ScorerSortKey | TransferPlayerSortKey;
  sortDirection: "asc" | "desc";
}

export type CompetitionScope = "national" | "continental" | "world";
export type CompetitionType = "legue" | "cup" | "supercup";

interface GlobalFilters extends Pick<Filters, "generalCompetitionId"> {}

interface CalendarFilters extends Pick<Filters, "month" | "teamId"> {}
interface SquadFilters extends Pick<
  Filters,
  "searchQuery" | "positionGroup" | "lineupStatus" | "playerSort"
> {}
interface TransferFilters extends Pick<
  Filters,
  | "searchQuery"
  | "position"
  | "teamId"
  | "sortKey"
  | "sortDirection"
  | "nationality"
> {}

interface TopScorersFilters extends Pick<
  Filters,
  | "searchQuery"
  | "position"
  | "teamId"
  | "sortKey"
  | "sortDirection"
  | "nationality"
> {}
interface StartGameFilters extends Pick<
  Filters,
  "teamType" | "region" | "nationality" | "division"
> {}

interface CompetitionsModalFilters extends Pick<
  Filters,
  "teamType" | "competitionScope" | "competitionType"
> {}

export interface FiltersState {
  globalFilters: GlobalFilters;
  competitionsModal: CompetitionsModalFilters;
  squadPage: SquadFilters;
  transferPage: TransferFilters;
  topScorersPage: TopScorersFilters;
  startGamePage: StartGameFilters;
  calendarPage: CalendarFilters;
}

const initialFiltersState: FiltersState = {
  globalFilters: { generalCompetitionId: null },
  competitionsModal: {
    teamType: "club",
    competitionScope: "all",
    competitionType: "all",
  },
  calendarPage: { teamId: "all", month: "all" },
  squadPage: {
    searchQuery: "",
    positionGroup: "all",
    lineupStatus: "all",
    playerSort: "position",
  },
  transferPage: {
    searchQuery: "",
    teamId: "all",
    position: "all",
    nationality: "all",
    sortKey: "overall",
    sortDirection: "desc",
  },
  topScorersPage: {
    searchQuery: "",
    teamId: "all",
    position: "all",
    nationality: "all",
    sortKey: "goals",
    sortDirection: "desc",
  },
  startGamePage: {
    teamType: "club",
    region: "all",
    nationality: "all",
    division: "A",
  },
};

interface FiltersActions {
  setFilter: <
    Page extends keyof FiltersState,
    Key extends keyof FiltersState[Page],
  >(
    page: Page,
    key: Key,
    value: FiltersState[Page][Key],
  ) => void;
}
type FiltersStore = FiltersState & FiltersActions;
const useFiltersStore = create<FiltersStore>((set) => ({
  ...initialFiltersState,
  setFilter: (page, key, value) =>
    set((state) => ({
      ...state,
      [page]: {
        ...state[page],
        [key]: value,
      },
    })),
  resetFilters: () => set(initialFiltersState),
}));

export default useFiltersStore;
