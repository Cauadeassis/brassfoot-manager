export interface PlayerContract {
  startDate: string;
  endDate: string;
  salary: number;
  signingBonus: number;
}

export interface ContractOffer {
  durationInMonths: number;
  salary: number;
  signingBonus: number;
}

export type ContractOfferError =
  "INVALID_DURATION" | "INVALID_SALARY" | "INVALID_SIGNING_BONUS";

interface DateParts {
  year: number;
  month: number;
  day: number;
}

function parseDateOnly(value: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12) return null;

  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month - 1];

  if (day < 1 || day > daysInMonth) return null;
  return { year, month, day };
}

function formatDateOnly({ year, month, day }: DateParts): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function validateContractOffer(
  offer: ContractOffer,
): ContractOfferError | null {
  if (
    !Number.isInteger(offer.durationInMonths) ||
    offer.durationInMonths < 3 ||
    offer.durationInMonths > 60
  ) {
    return "INVALID_DURATION";
  }
  if (!Number.isFinite(offer.salary) || offer.salary < 0) {
    return "INVALID_SALARY";
  }
  if (!Number.isFinite(offer.signingBonus) || offer.signingBonus < 0) {
    return "INVALID_SIGNING_BONUS";
  }
  return null;
}

export function createContractFromOffer(
  offer: ContractOffer,
  startDate: string,
): PlayerContract {
  const offerError = validateContractOffer(offer);
  if (offerError) {
    throw new RangeError(`Invalid contract offer: ${offerError}`);
  }

  const start = parseDateOnly(startDate);
  if (!start) throw new RangeError("Invalid contract start date.");

  const targetMonthIndex =
    start.year * 12 + start.month - 1 + offer.durationInMonths;
  const endYear = Math.floor(targetMonthIndex / 12);
  const endMonth = (targetMonthIndex % 12) + 1;
  const isLeapYear =
    endYear % 4 === 0 && (endYear % 100 !== 0 || endYear % 400 === 0);
  const endMonthDays = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][endMonth - 1];

  if (endYear > 9999)
    throw new RangeError("Contract end date is out of range.");

  return {
    startDate,
    endDate: formatDateOnly({
      year: endYear,
      month: endMonth,
      day: Math.min(start.day, endMonthDays),
    }),
    salary: offer.salary,
    signingBonus: offer.signingBonus,
  };
}

export function isContractActive(
  contract: PlayerContract,
  currentDate: string,
): boolean {
  if (!parseDateOnly(contract.startDate) || !parseDateOnly(contract.endDate)) {
    throw new RangeError("Invalid contract date.");
  }
  if (!parseDateOnly(currentDate))
    throw new RangeError("Invalid current date.");

  return currentDate >= contract.startDate && currentDate <= contract.endDate;
}
