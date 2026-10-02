export type Badge = "penalty" | "freeKick" | "corner";

export const badgeLabelMap: Record<Badge, string> = {
  penalty: "Batedor de pênalti",
  freeKick: "Batedor de falta",
  corner: "Batedor de escanteio",
};

export const getBadgeLabel = (badge: Badge): string => badgeLabelMap[badge];
