import type {
  ContractOffer,
  ContractOfferError,
  PlayerContract,
} from "../types/contract";

interface DateParts {
  year: number;
  month: number;
  day: number;
}

interface GenerateAIContractOfferProps {
  age: number;
  overall: number;
  value: number;
  maxWageCommitment: number;
  isFreeAgent: boolean;
}

export interface EvaluatePlayerContractOfferProps {
  age: number;
  overall: number;
  value: number;
  offer: ContractOffer;
  isFreeAgent: boolean;
}

export interface PlayerContractEvaluation {
  accepted: boolean;
  message: string;
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

function getPreferredDuration(age: number, overall: number): number {
  const ageLimit =
    age < 21 ? 60 : age < 26 ? 48 : age < 30 ? 36 : age < 34 ? 24 : 12;
  const qualityAdjustment =
    overall >= 90 ? 12 : overall >= 80 ? 6 : overall < 60 ? -6 : 0;
  return Math.min(60, Math.max(3, ageLimit + qualityAdjustment));
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

export function generateAIContractOffer({
  age,
  overall,
  value,
  maxWageCommitment,
  isFreeAgent,
}: GenerateAIContractOfferProps): ContractOffer | null {
  if (
    !Number.isFinite(age) ||
    age < 0 ||
    !Number.isFinite(overall) ||
    !Number.isFinite(value) ||
    value < 0 ||
    !Number.isFinite(maxWageCommitment) ||
    maxWageCommitment < 0
  ) {
    return null;
  }

  const salary = Math.max(Math.round((value * 0.05) / 12), 1621);
  const preferredDuration = getPreferredDuration(age, overall);
  const affordableDuration =
    salary === 0 ? preferredDuration : Math.floor(maxWageCommitment / salary);
  const durationInMonths = Math.min(preferredDuration, affordableDuration);
  if (durationInMonths < 3) return null;

  return {
    durationInMonths,
    salary,
    signingBonus: Math.round(value * (isFreeAgent ? 0.2 : 0.1)),
  };
}

export function evaluatePlayerContractOffer({
  age,
  overall,
  value,
  offer,
  isFreeAgent,
}: EvaluatePlayerContractOfferProps): PlayerContractEvaluation {
  const offerError = validateContractOffer(offer);
  if (offerError) {
    return {
      accepted: false,
      message: "Os termos do contrato são inválidos.",
    };
  }

  const expectedOffer = generateAIContractOffer({
    age,
    overall,
    value,
    maxWageCommitment: value * 0.25,
    isFreeAgent,
  });
  if (!expectedOffer) {
    return {
      accepted: false,
      message: "Não foi possível avaliar a proposta de contrato.",
    };
  }

  const salaryFloor = Math.ceil(expectedOffer.salary * 0.8);
  const signingBonusFloor = Math.ceil(expectedOffer.signingBonus * 0.8);

  if (offer.salary < salaryFloor || offer.signingBonus < signingBonusFloor) {
    return {
      accepted: false,
      message: "O jogador recusou os termos do contrato.",
    };
  }

  return {
    accepted: true,
    message: "O jogador aceitou os termos do contrato.",
  };
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
