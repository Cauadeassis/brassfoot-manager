import { useEffect, useRef, useState } from "react";
import { Player, Position } from "../types/player";
import { FormationType } from "../data/formations";
import { PlayStyle } from "../types/team";

export interface SubstitutionEvent {
  id: string;
  outPlayer?: ExchangePlayer | null;
  inPlayer?: ExchangePlayer | null;
  positionSwap?: {
    player: ExchangePlayer;
    fromRole: string;
    toRole: string;
  } | null;
}

export type FormationKey = `${FormationType}_${PlayStyle}`;

type ExchangePlayer = Pick<Player, "name" | "position">;

interface UseSubstitutionEventsProps {
  starterIds: string[];
  slotRoles: string[];
  squadMap: Map<string, ExchangePlayer>;
  formationKey: FormationKey;
}

const EVENT_LIFETIME_MS = 5000;

export default function useSubstitutionEvents({
  starterIds,
  slotRoles,
  squadMap,
  formationKey,
}: UseSubstitutionEventsProps) {
  const [events, setEvents] = useState<SubstitutionEvent[]>([]);
  const previousRef = useRef<{ ids: string[]; roles: string[] } | null>(null);
  const previousFormationKeyRef = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const previous = previousRef.current;
    const previousFormationKey = previousFormationKeyRef.current;
    previousRef.current = { ids: starterIds, roles: slotRoles };
    previousFormationKeyRef.current = formationKey;

    if (previous === null) return;

    const previousRoleById = new Map<string, string>();
    previous.ids.forEach((id, i) =>
      previousRoleById.set(id, previous.roles[i]),
    );
    const currentRoleById = new Map<string, string>();
    starterIds.forEach((id, i) => currentRoleById.set(id, slotRoles[i]));

    const previousSet = new Set(previous.ids);
    const currentSet = new Set(starterIds);

    const removedIds = previous.ids.filter((id) => !currentSet.has(id));
    const addedIds = starterIds.filter((id) => !previousSet.has(id));
    const formationChanged = previousFormationKey !== formationKey;
    const swappedIds = formationChanged
      ? []
      : starterIds.filter((id) => {
          if (!previousSet.has(id)) return false;
          return previousRoleById.get(id) !== currentRoleById.get(id);
        });

    if (
      removedIds.length === 0 &&
      addedIds.length === 0 &&
      swappedIds.length === 0
    ) {
      return;
    }

    const batchId = `${Date.now()}`;
    const pairCount = Math.max(removedIds.length, addedIds.length);

    const substitutionEvents: SubstitutionEvent[] = Array.from(
      { length: pairCount },
      (_, i) => {
        const outId = removedIds[i];
        const inId = addedIds[i];
        const outPlayer = outId ? squadMap.get(outId) : undefined;
        const inPlayer = inId ? squadMap.get(inId) : undefined;
        return {
          id: `${batchId}-sub-${i}`,
          outPlayer: outPlayer
            ? { name: outPlayer.name, position: outPlayer.position }
            : null,
          inPlayer: inPlayer
            ? { name: inPlayer.name, position: inPlayer.position }
            : null,
        };
      },
    );

    const positionSwapEvents: SubstitutionEvent[] = swappedIds
      .map((id, i) => {
        const player = squadMap.get(id);
        if (!player) return null;
        return {
          id: `${batchId}-swap-${i}`,
          positionSwap: {
            player: { name: player.name, position: player.position },
            fromRole: previousRoleById.get(id) ?? "?",
            toRole: currentRoleById.get(id) ?? "?",
          },
        };
      })
      .filter((event): event is NonNullable<typeof event> => event !== null);
    const newEvents = [...substitutionEvents, ...positionSwapEvents];
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setEvents(newEvents);
    timeoutRef.current = setTimeout(() => {
      setEvents([]);
      timeoutRef.current = null;
    }, EVENT_LIFETIME_MS);
  }, [starterIds, slotRoles, squadMap, formationKey]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return events;
}
