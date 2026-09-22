"use client";

import { useMemo } from "react";
import FORMATIONS_DATA, { PlayerSlot } from "../../data/formations";
import { getSquad } from "../../gameEngine/team";
import useSubstitutionEvents, {
  FormationKey,
  SubstitutionEvent,
} from "../../hooks/useSubstitutionEvent";
import { Player } from "../../types/player";
import { Team } from "../../types/team";

interface UseFootballFieldDataProps {
  team: Team | undefined;
  playersMap: Record<string, Player>;
}

export default function useFootballFieldData({
  team,
  playersMap,
}: UseFootballFieldDataProps) {
  const squad = useMemo(
    () => (team ? getSquad({ team, playersMap }) : []),
    [playersMap, team],
  );
  const squadMap = useMemo(
    () => new Map(squad.map((player) => [player.id, player])),
    [squad],
  );
  const slots: PlayerSlot[] = team
    ? FORMATIONS_DATA[team.tactics.formation].slots[team.tactics.style]
    : FORMATIONS_DATA["4-3-3"].slots.balanced;
  const slotRoles = useMemo(() => slots.map((slot) => slot.role), [slots]);
  const formationKey: FormationKey = team
    ? `${team.tactics.formation}_${team.tactics.style}`
    : "4-3-3_balanced";
  const substitutionEvents = useSubstitutionEvents({
    starterIds: team?.squad.starterIds ?? [],
    slotRoles,
    squadMap,
    formationKey,
  });

  return { squadMap, slots, substitutionEvents };
}

export type { SubstitutionEvent };
