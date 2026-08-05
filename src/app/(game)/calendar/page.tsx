"use client";

import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventContentArg, EventInput } from "@fullcalendar/core";
import styles from "./calendar.module.css";
import useGameStore from "../../../stores/useGameStore";
import { getMatchesByMonth } from "../../../gameEngine/match/state";
import { Match } from "../../../types/match";

function formatMonthKey(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
}

function parseGameDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function CalendarPage() {
  const calendar = useGameStore((state) => state.calendar);
  const teams = useGameStore((state) => state.teams);
  const userTeamId = useGameStore((state) => state.userTeamId!);
  const currentGameDate = useGameStore((state) => state.currentDate);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    parseGameDate(currentGameDate),
  );
  const monthKey = useMemo(() => formatMonthKey(visibleMonth), [visibleMonth]);
  const { matches, error } = useMemo<{
    matches: Match[];
    error: string | null;
  }>(() => {
    try {
      return {
        matches: getMatchesByMonth({
          calendar,
          targetTeamId: userTeamId,
          targetMonth: monthKey,
        }),
        error: null,
      };
    } catch {
      return {
        matches: [],
        error: "Não foi possível carregar o calendário. Tente novamente.",
      };
    }
  }, [calendar, userTeamId, monthKey]);
  const events: EventInput[] = useMemo(
    () =>
      matches.map((match) => {
        const opponentId =
          match.homeTeamId === userTeamId ? match.awayTeamId : match.homeTeamId;
        const opponent = teams[opponentId];

        return {
          id: match.id,
          date: match.date,
          title: opponent?.name ?? opponentId,
          extendedProps: {
            opponentShield: opponent?.shield,
            opponentName: opponent?.name ?? opponentId,
          },
        };
      }),
    [matches, userTeamId, teams],
  );

  const renderEventContent = (arg: EventContentArg) => {
    const { opponentShield, opponentName } = arg.event.extendedProps as {
      opponentShield?: string;
      opponentName?: string;
    };

    if (!opponentShield) return null;

    return (
      <img
        src={opponentShield}
        alt={opponentName ?? ""}
        className={styles.dayShield}
      />
    );
  };

  return (
    <div className={styles.page}>
      {error && <p className={styles.errorBanner}>{error}</p>}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialDate={visibleMonth}
        locale="pt-br"
        headerToolbar={{ left: "prev", center: "title", right: "next" }}
        height="auto"
        fixedWeekCount={false}
        events={events}
        eventContent={renderEventContent}
        datesSet={(arg) => setVisibleMonth(arg.view.currentStart)}
        dayMaxEventRows={1}
        dayCellClassNames={(arg) => {
          const year = arg.date.getFullYear();
          const month = String(arg.date.getMonth() + 1).padStart(2, "0");
          const day = String(arg.date.getDate()).padStart(2, "0");
          const cellDateString = `${year}-${month}-${day}`;
          return cellDateString === currentGameDate ? ["currentDay"] : [];
        }}
      />
    </div>
  );
}
