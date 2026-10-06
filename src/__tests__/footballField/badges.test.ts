import {
  getBadgeLabel,
  getBadgeLabels,
} from "../../components/footballField/badges";

describe("football field badges", () => {
  it("should return the label for each set-piece taker badge", () => {
    expect(getBadgeLabel("penalty")).toBe("Batedor de pênalti");
    expect(getBadgeLabel("freeKick")).toBe("Batedor de falta");
    expect(getBadgeLabel("corner")).toBe("Batedor de escanteio");
  });

  it("should join multiple badge labels with conjunctions", () => {
    expect(getBadgeLabels(["freeKick", "corner"])).toBe(
      "Batedor de falta e escanteio",
    );
    expect(getBadgeLabels(["penalty", "freeKick"])).toBe(
      "Batedor de pênalti e falta",
    );
    expect(getBadgeLabels(["penalty", "freeKick", "corner"])).toBe(
      "Batedor de pênalti, falta e escanteio",
    );
  });
});
