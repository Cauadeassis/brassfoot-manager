import { Nationality } from "../../data/nationalities";
import { buildMasterCalendar } from "../../gameEngine/generators/calendar";
import { generateMatches } from "../../gameEngine/generators/matches";
import generateSeason, { isEligible } from "../../gameEngine/generators/season";
import { TeamType } from "../../types/team";
jest.mock("../../data/competitions", () => [
    {
        id: "BR_league",
        eligibility: { nationality: "BR", teamType: "club" },
        rules: { format: "league" },
    },
    {
        id: "BR_cup",
        eligibility: { nationality: "BR", teamType: "club" },
        rules: { format: "cup" },
    },
    {
        id: "worldCup",
        eligibility: { teamType: "national" },
        input: true,
        rules: { format: "cup" },
    },
    {
        id: "southAmerican_cup",
        eligibility: { region: "southAmerican", teamType: "national" },
        rules: { format: "league" },
    },
]);

jest.mock("../../data/nationalities", () => ({
    BR: { region: "southAmerican" },
    US: { region: "northAmerican" },
}));

jest.mock("../../gameEngine/generators/matches", () => ({
    generateMatches: jest.fn(),
}));

jest.mock("../../gameEngine/generators/calendar", () => ({
    buildMasterCalendar: jest
        .fn()
        .mockReturnValue([{ date: "2026-01-01", matchId: "m1" }]),
}));

const createMockTeam = (
    id: string,
    nationality: Nationality = "BR",
    type: TeamType = "club",
): any => ({
    id,
    name: `Team ${id}`,
    nationality,
    type,
});

describe("Season Generator (season.ts)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("isEligible()", () => {
        it("Should return true if team is eligible", () => {
            const team = createMockTeam("T1", "BR", "club");
            const eligibility: any = { nationality: "BR", teamType: "club" };
            expect(isEligible({ team, eligibility })).toBe(true);
        });

        it("Should return false if team is not eligible", () => {
            const team = createMockTeam("T1", "BR", "national");
            const eligibility: any = { nationality: "BR", teamType: "club" };
            expect(isEligible({ team, eligibility })).toBe(false);
        });
        it("Should work with region eligiblity", () => {
            const team = createMockTeam("T1", "BR", "national");
            const eligibility: any = { region: "southAmerican" };
            expect(isEligible({ team, eligibility })).toBe(true);
        });

        it("Should throw error if nationality does not exist in the region", () => {
            const team = createMockTeam("T1", "XX");
            const eligibility: any = { region: "southAmerican" };
            expect(() => {
                isEligible({ team, eligibility });
            }).toThrow();
        });
        it("Should throw error if invalid eligibility", () => {
            const team = createMockTeam("T1");
            const eligibility: any = { unknownRule: "value" };
            expect(() => {
                isEligible({ team, eligibility });
            }).toThrow();
        });
    });
    describe("generateSeason()", () => {
        it("Should throw error if teams array is empty", () => {
            expect(() => {
                generateSeason({ teams: [], season: 2026 });
            }).toThrow();
        });

        it("Should only generate competitions without input", () => {
            const mockMatches = [[{ id: "m1" }]];
            (generateMatches as jest.Mock).mockReturnValue(mockMatches);
            const teams = [
                createMockTeam("T1", "BR", "club"),
                createMockTeam("T2", "BR", "club"),
            ];
            const result = generateSeason({ teams, season: 2026 });
            const expectedStandings = [
                {
                    teamId: "T1",
                    points: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    matchesPlayed: 0,
                },
                {
                    teamId: "T2",
                    points: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    matchesPlayed: 0,
                },
            ];
            expect(result.competitions).toHaveLength(2);
            expect(result.competitions[0].id).toBe("BR_league");
            expect(result.competitions[0].standings).toEqual(expectedStandings);
            expect(result.competitions[0].matches).toEqual(mockMatches);
            expect(buildMasterCalendar).toHaveBeenCalledTimes(1);
            expect(result.calendar).toEqual([{ date: "2026-01-01", matchId: "m1" }]);
        });

        it("Should throw error if generateMatches throw error", () => {
            (generateMatches as jest.Mock).mockImplementation(() => {
                throw new Error();
            });

            const teams = [
                createMockTeam("T_BR1", "BR", "club"),
                createMockTeam("T_BR2", "BR", "club"),
            ];

            expect(() => {
                generateSeason({ teams, season: 2026 });
            }).toThrow();
        });
    });
});
