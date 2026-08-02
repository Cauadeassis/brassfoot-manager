import {
  advanceDay,
  advanceMonth,
  advanceYear,
  getPlayerTeam,
} from "../../gameEngine/player";

describe("getPlayerTeam", () => {
  const mockTeam = { id: "team-1", name: "Brasil" } as any;
  const teamsMap = { "team-1": mockTeam };

  it("Should return team", () => {
    const player = { currentTeamId: "team-1" } as any;
    expect(getPlayerTeam({ player, teamsMap })).toBe(mockTeam);
  });

  it("Should return null if player does not have a team or the team is invalid", () => {
    expect(
      getPlayerTeam({ player: { currentTeamId: null } as any, teamsMap }),
    ).toBeNull();
    expect(
      getPlayerTeam({ player: { currentTeamId: "team-2" } as any, teamsMap }),
    ).toBeNull();
  });
});
describe("Progression (advanceYear & advanceMonth)", () => {
  const mockPlayer = {
    id: "p1",
    position: "GK",
    age: 30,
    stamina: 50,
    currentSkills: { reflexes: 80, physical: 50 },
  } as any;

  it("advanceYear should increase age and update skills", () => {
    const updated = advanceYear({ player: mockPlayer });
    expect(updated.age).toBe(31);
    expect(updated.currentSkills.physical).toBe(48);
  });

  it("advanceDay should update stamina", () => {
    const updated = advanceDay({ player: mockPlayer });
    expect(updated.stamina).toBe(60);
  });

  it("advanceMonth should increase young players physical", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.8);
    const youngPlayer = { ...mockPlayer, age: 20 };
    const updated = advanceMonth({ player: youngPlayer });
    expect(updated.currentSkills.physical).toBe(51);
  });
});
