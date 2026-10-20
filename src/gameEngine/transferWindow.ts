export function isTransferWindowOpen(date: string): boolean {
  const month = Number(date.slice(5, 7));
  return month === 1 || month === 7 || month === 8;
}

export function getTransferWindowEnd(date: string): string | null {
  const [year, month] = date.split("-").map(Number);
  if (!isTransferWindowOpen(date)) return null;
  if (month === 1) return `${year}-01-31`;
  return `${year}-08-31`;
}
