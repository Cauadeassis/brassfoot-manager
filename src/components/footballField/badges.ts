export type Badge = "penalty" | "freeKick" | "corner";

export const badgeLabelMap: Record<Badge, string> = {
  penalty: "Batedor de pênalti",
  freeKick: "Batedor de falta",
  corner: "Batedor de escanteio",
};

const joinWithConjunction = (items: string[]): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} e ${items[1]}`;

  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
};

export const getBadgeLabel = (badge: Badge): string => badgeLabelMap[badge];

export const getBadgeLabels = (badges: Badge[]): string => {
  const labels = badges.map((badge) =>
    getBadgeLabel(badge).replace(/^Batedor de /, ""),
  );

  return `Batedor de ${joinWithConjunction(labels)}`;
};
