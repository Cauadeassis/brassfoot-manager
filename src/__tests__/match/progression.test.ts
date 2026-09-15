import { processMatchResults } from "../../gameEngine/match/progression";
import { getAggregateScore } from "../../gameEngine/match/aggregate";
import { GameState } from "../../types/state";
import { Match } from "../../types/match";

const createMatch = (
  id: string,
  round: number,
  date: string,
  homeTeamId: string,
  awayTeamId: string,
): Match => ({
  id,
  competitionId: "BR_cup",
  round,
  date,
  homeTeamId,
  awayTeamId,
  simulated: false,
  accelerated: false,
  goals: { home: 0, away: 0 },
});

const createGameState = (matches: Match[]): GameState => ({
  currentDate: "2026-01-01",
  modality: "masculine",
  season: 2026,
  status: "IDLE",
  userTeamId: null,
  teams: {},
  players: {},
  competitions: [
    { id: "BR_cup", matches: [matches], standings: [], stats: [] },
  ],
  calendar: matches.map((match) => ({
    date: match.date,
    matches: [match],
    events: [],
  })),
  activeMatch: null,
  notifications: [],
  results: [],
});

describe("Cup progression", () => {
  it("shows the aggregate score for a two-legged tie", () => {
    const firstLeg = createMatch("first", 1, "2026-01-01", "Real", "Barca");
    firstLeg.goals = { home: 3, away: 0 };
    const secondLeg = createMatch("second", 2, "2026-01-08", "Barca", "Real");
    secondLeg.goals = { home: 1, away: 0 };

    expect(
      getAggregateScore({
        match: secondLeg,
        competitionMatches: [firstLeg, secondLeg],
      }),
    ).toEqual({ home: 1, away: 3 });
  });

  it("creates the next knockout round after a two-legged round", () => {
    const matches = [
      createMatch("first-a", 1, "2026-01-01", "A", "B"),
      createMatch("first-b", 1, "2026-01-01", "C", "D"),
      createMatch("return-a", 2, "2026-01-03", "B", "A"),
      createMatch("return-b", 2, "2026-01-03", "D", "C"),
    ];
    const gameState = createGameState(matches);

    processMatchResults({
      gameState,
      payload: { matchId: "first-a", homeGoals: 2, awayGoals: 0, events: [] },
    });
    processMatchResults({
      gameState,
      payload: { matchId: "first-b", homeGoals: 0, awayGoals: 1, events: [] },
    });
    processMatchResults({
      gameState,
      payload: { matchId: "return-a", homeGoals: 1, awayGoals: 0, events: [] },
    });
    processMatchResults({
      gameState,
      payload: { matchId: "return-b", homeGoals: 0, awayGoals: 0, events: [] },
    });

    const nextRound = gameState.calendar
      .flatMap((day) => day.matches)
      .filter((match) => match.round === 3);

    expect(nextRound).toHaveLength(1);
    expect(nextRound[0]).toMatchObject({
      homeTeamId: "A",
      awayTeamId: "D",
      date: "2026-01-04",
      simulated: false,
    });
    expect(
      gameState.calendar
        .flatMap((day) => day.matches)
        .some((match) => match.round === 4),
    ).toBe(true);
  });
});
