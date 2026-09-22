import { Position } from "./types/player";
import useFiltersStore, {
  ScorerSortKey,
  TransferPlayerSortKey,
} from "./stores/useFilterStore";

import React, { useState, useEffect, useRef } from "react";

export function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

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

function useCountUp(targetValue: number, duration: number = 500) {
  const targetPercent = Math.round(targetValue * 100);
  const [displayPercent, setDisplayPercent] = useState(targetPercent);
  const displayPercentRef = useRef(targetPercent);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(targetPercent);
  const previousTargetRef = useRef(targetPercent);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (targetPercent === previousTargetRef.current) {
      return;
    }

    cancelAnimationFrame(animationFrameRef.current!);
    startTimeRef.current = null;
    startValueRef.current = displayPercentRef.current;
    previousTargetRef.current = targetPercent;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const runtime = timestamp - startTimeRef.current;
      const relativeProgress = runtime / duration;
      const easedProgress = 1 - Math.pow(1 - Math.min(relativeProgress, 1), 4);
      const currentValue =
        startValueRef.current +
        (targetPercent - startValueRef.current) * easedProgress;
      const nextDisplay = Math.round(currentValue);

      if (nextDisplay !== displayPercentRef.current) {
        displayPercentRef.current = nextDisplay;
        setDisplayPercent(nextDisplay);
      }

      if (runtime < duration) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        displayPercentRef.current = targetPercent;
        setDisplayPercent(targetPercent);
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current!);
  }, [targetPercent, duration]);

  return displayPercent;
}

interface AnimatedPercentProps {
  value: number;
  className?: string;
}

export const AnimatedPercent: React.FC<AnimatedPercentProps> = ({
  value,
  className,
}) => {
  const animatedValue = useCountUp(value, 1000);
  const sign = animatedValue > 0 ? "+" : "";
  const safeValue = Object.is(animatedValue, -0) ? 0 : animatedValue;
  return (
    <span className={className}>
      {sign}
      {safeValue}%
    </span>
  );
};
