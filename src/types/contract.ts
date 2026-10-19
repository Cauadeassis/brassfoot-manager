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
