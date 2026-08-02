import { Nationality } from "./data/nationalities";
import { CompetitionId } from "./types/competition";

export class CalendarGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CalendarGenerationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static unsupportedFormat(format: string) {
    return new CalendarGenerationError(
      `The format ${format} is not supported.`,
    );
  }

  static missingTeams() {
    return new CalendarGenerationError(
      "Teams list for generating the calendar is empty.",
    );
  }

  static missingCompetitions() {
    return new CalendarGenerationError(
      "Competitions list for generating the calendar is empty.",
    );
  }

  static overlappingDates(competitionId: CompetitionId) {
    return new CalendarGenerationError(`Dates conflit in ${competitionId}.`);
  }
}

interface InvalidNationalityProps {
  nationality: string;
  name: string;
}

interface CompetitionGenerationFailed {
  competitionId: string;
  details: string;
}

export class SeasonGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SeasonGenerationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static missingTeams() {
    return new SeasonGenerationError(
      "Teams list for generating the season is empty.",
    );
  }

  static invalidNationality({ nationality, name }: InvalidNationalityProps) {
    return new SeasonGenerationError(
      `The nationality ${nationality}, from ${name} isn't supported.`,
    );
  }

  static unknownEligibilityRule(rule: string) {
    return new SeasonGenerationError(`Unknow eligibility rule: ${rule}.`);
  }

  static competitionGenerationFailed({
    competitionId,
    details,
  }: CompetitionGenerationFailed) {
    return new SeasonGenerationError(
      `Couldn't generate ${competitionId}. ${details}`,
    );
  }
}

export class PlayerGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlayerGenerationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static invalidPosition(position: string) {
    return new PlayerGenerationError(`Invalid position: ${position}`);
  }

  static invalidNationality(nationality: string) {
    return new PlayerGenerationError(
      `Nationality ${nationality} is not supported.`,
    );
  }

  static missingNameData(additionalMessage: string) {
    return new PlayerGenerationError(
      `Couldn't load names. ${additionalMessage}`,
    );
  }
}

interface InvalidNationalityProps {
  nationality: string;
  name: string;
}

export class TransferError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransferError";
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static missingBuyerAndSeller() {
    return new TransferError(`Missing buyer and seller`);
  }

  static invalidPlayer(name: string) {
    return new TransferError(`Player ${name} is not free in the market`);
  }

  static playerNotFound(name: string) {
    return new TransferError(`Player ${name} not found in origin team`);
  }

  static missingMoney() {
    return new TransferError(`Team does not have money enough`);
  }
}

export class TeamGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeamGenerationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static missingTemplate(type: string) {
    return new TeamGenerationError(`Couldn't get template for ${type}.`);
  }

  static missingGoalkeeper(teamName: string) {
    return new TeamGenerationError(
      `${teamName} doesn't have a starter goalkeeper.`,
    );
  }

  static invalidNationality({ nationality, name }: InvalidNationalityProps) {
    return new TeamGenerationError(
      `Nationality ${nationality}, from ${name}, is not supported.`,
    );
  }

  static missingPositionsData(modality: string) {
    return new TeamGenerationError(`Couldn't find ${modality} POSITIONS_DATA.`);
  }
}

export class MatchSimulationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MatchSimulationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static missingUserTeam() {
    return new MatchSimulationError("User team is not defined");
  }

  static noMatchesAvailable() {
    return new MatchSimulationError("There is no available match.");
  }

  static dateMismatch(matchDate: string, currentDate: string) {
    return new MatchSimulationError(
      `Dates mismatch. Match date (${matchDate}) does not match the current date (${currentDate}).`,
    );
  }
}
