import { useState, useEffect } from "react";
import { Position } from "./types/player";
import useFiltersStore, {
  ScorerSortKey,
  TransferPlayerSortKey,
} from "./stores/useFilterStore";
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false,
  );

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", checkSize);
    checkSize();
    return () => window.removeEventListener("resize", checkSize);
  }, [breakpoint]);

  return isMobile;
}
interface UseZustandTableFiltersProps {
  pageKey: "topScorersPage" | "transferPage";
  userTeamId: string;
}

export function useTableFilters<SortKey>({
  pageKey,
  userTeamId,
}: UseZustandTableFiltersProps) {
  const filters = useFiltersStore((state) => state[pageKey]);
  const setFilter = useFiltersStore((state) => state.setFilter);
  const { searchQuery, nationality, position, teamId, sortKey, sortDirection } =
    filters;
  const handlePositionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFilter(pageKey, "position", event.target.value as Position | "all");
  };
  const isUserTeamSelected = teamId === userTeamId;
  const handleToggleTeamFilter = () => {
    setFilter(pageKey, "teamId", isUserTeamSelected ? "all" : userTeamId);
  };
  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(pageKey, "teamId", event.target.value);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setFilter(
        pageKey,
        "sortDirection",
        sortDirection === "asc" ? "desc" : "asc",
      );
    } else {
      const isAscendingDefault = key === "age" || key === "value";
      setFilter(
        pageKey,
        "sortKey",
        key as ScorerSortKey | TransferPlayerSortKey,
      );
      setFilter(pageKey, "sortDirection", isAscendingDefault ? "asc" : "desc");
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return " ↕";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  return {
    searchQuery,
    position,
    isUserTeamSelected,
    teamId,
    nationality,
    sortConfig: { key: sortKey, direction: sortDirection },
    handlePositionChange,
    handleToggleTeamFilter,
    handleTeamChange,
    handleSort,
    getSortIcon,
  };
}
