import { BASE_TEAM_COLORS, OPPOSITE_COLORS } from "../../data/uniforms";

describe("opposite uniform colors", () => {
  it("maps the base uniform colors to their contrasting colors", () => {
    expect(OPPOSITE_COLORS[BASE_TEAM_COLORS.white]).toBe(
      BASE_TEAM_COLORS.black,
    );
    expect(OPPOSITE_COLORS[BASE_TEAM_COLORS.black]).toBe(
      BASE_TEAM_COLORS.white,
    );
    expect(OPPOSITE_COLORS[BASE_TEAM_COLORS.red]).toBe(BASE_TEAM_COLORS.green);
    expect(OPPOSITE_COLORS[BASE_TEAM_COLORS.green]).toBe(BASE_TEAM_COLORS.red);
    expect(OPPOSITE_COLORS[BASE_TEAM_COLORS.navyBlue]).toBe(
      BASE_TEAM_COLORS.orange,
    );
    expect(OPPOSITE_COLORS[BASE_TEAM_COLORS.yellow]).toBe(
      BASE_TEAM_COLORS.purple,
    );
    expect(OPPOSITE_COLORS[BASE_TEAM_COLORS.purple]).toBe(
      BASE_TEAM_COLORS.yellow,
    );
  });

  it("defines an opposite color for every base uniform color", () => {
    for (const color of Object.values(BASE_TEAM_COLORS)) {
      expect(OPPOSITE_COLORS[color]).toBeDefined();
    }
  });
});
