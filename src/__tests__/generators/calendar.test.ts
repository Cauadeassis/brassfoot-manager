import {
  buildMasterCalendar,
  CompetitionSlot,
} from "../../gameEngine/generators/calendar";
const createMockMatch = (home: string, away: string, compId: string): any => ({
  id: "m1",
  competitionId: compId,
  homeTeamId: home,
  awayTeamId: away,
  round: 1,
});

describe("Calendar Generator (calendar.ts)", () => {
  const competitions: CompetitionSlot[] = [
    {
      competitionId: "BR_league",
      matches: [
        [createMockMatch("T1", "T2", "BR_league")],
        [createMockMatch("T2", "T1", "BR_league")],
      ],
    },
    {
      competitionId: "southAmerican_clubs_competition",
      matches: [
        [createMockMatch("T1", "T3", "southAmerican_clubs_competition")],
        [createMockMatch("T3", "T1", "southAmerican_clubs_competition")],
      ],
    },
    {
      competitionId: "BR_cup",
      matches: [
        [createMockMatch("T1", "T4", "BR_cup")],
        [createMockMatch("T4", "T1", "BR_cup")],
      ],
    },
  ];
  const calendar = buildMasterCalendar({ season: 2024, competitions });
  it("Should throw errors if competitions array is empty", () => {
    expect(() => {
      buildMasterCalendar({ season: 2026, competitions: [] });
    }).toThrow();
  });
  it("Should assign dates to the matches", () => {
    expect(calendar.length).toBeGreaterThan(0);
    const firstMatchDate = calendar[0].date;
    const secondMatchDate = calendar[1].date;
    expect(firstMatchDate).not.toBe(secondMatchDate);
  });

  it("deve respeitar o intervalo mínimo de descanso de 2 dias para times em 3 ou mais competições", () => {
    const dataJogo1 = new Date(calendar[0].date).getTime();
    const dataJogo2 = new Date(calendar[1].date).getTime();
    const diffEmDias = (dataJogo2 - dataJogo1) / (1000 * 3600 * 24);
    expect(diffEmDias).toBeGreaterThanOrEqual(2);
  });

  it("deve lançar erro overlappingDates se for impossível terminar a temporada no ano", () => {
    const impossivelRounds = Array.from({ length: 200 }, () => [
      createMockMatch("T1", "T2", "worldClubs"),
    ]);
    const invalidCompetitions: CompetitionSlot[] = [
      { competitionId: "worldClubs", matches: impossivelRounds },
    ];
    expect(() => {
      buildMasterCalendar({ season: 2024, competitions: invalidCompetitions });
    }).toThrow();
  });
});
