import { getBadgeLabel } from "../../components/footballField/badges";

describe("football field badges", () => {
  it("should return the label for each set-piece taker badge", () => {
    expect(getBadgeLabel("penalty")).toBe("Batedor de pênalti");
    expect(getBadgeLabel("freeKick")).toBe("Batedor de falta");
    expect(getBadgeLabel("corner")).toBe("Batedor de escanteio");
  });
});
