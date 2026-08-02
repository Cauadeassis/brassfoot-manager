import {
  getTeamDescription,
  createBaseTeam,
  generateTeam,
} from "../../gameEngine/team";
import { RawTeamData } from "../../types/team";

describe("getTeamDescription", () => {
  it("Should return specific description for nationality", () => {
    const description = getTeamDescription({
      type: "club",
      region: "southAmerican",
      nationality: "BR",
    });
    expect(description).toBe(
      "Lidere esse clube brasileiro em direção à Libertadores e ao Mundial!",
    );
  });

  it("Should return regional description", () => {
    const description = getTeamDescription({
      type: "club",
      region: "southAmerican",
      nationality: "AR",
    });
    expect(description).toBe("Seja dono desse poderoso clube sul-americano!");
  });

  it("Should return error if teamType is invalid", () => {
    expect(() => {
      getTeamDescription({
        type: "alien" as any,
        region: "southAmerican",
        nationality: "BR",
      });
    }).toThrow();
  });
});

const rawMock = {
  name: "Vasco",
  shield: "/clubs/southAmerican/BR/Vasco.svg",
  division: {
    masculine: "B",
    feminine: "A",
  },
  overall: {
    masculine: 60,
    feminine: 100,
  },
  money: 220_000_000,
  type: "club",
  nationality: "BR",
} as RawTeamData;

describe("createTeam", () => {
  it("Should create base team", () => {
    const team = createBaseTeam(rawMock);
    expect(team.history[2026].points).toBe(0);
    expect(team.squad.playerIds).toEqual([]);
  });
  it("Should throw error if nationality is invalid", () => {
    expect(() => {
      createBaseTeam({ ...rawMock, nationality: "INVÁLIDA" });
    }).toThrow();
  });
  it("Should create team", () => {
    const baseData = createBaseTeam(rawMock);
    const team = generateTeam({ baseData, modality: "masculine" });
    expect(team.division).toBe("B");
    expect(team.overall).toBe(60);
    expect(team.rankingScore).toBe((60 * 60) / 5);
  });
  it("Should vary team according to modality", () => {
    const baseData = createBaseTeam(rawMock);
    const team = generateTeam({ baseData, modality: "feminine" });
    expect(team.division).toBe("A");
    expect(team.overall).toBe(100);
    expect(team.rankingScore).toBe((100 * 100) / 5);
  });
});
