import { Nationality } from "../../data/nationalities";
import {
  Competition,
  Region,
  CompetitionRules,
  RegionalCompetition,
} from "../../types/competition";
import NATIONALITIES_DATA from "../../data/nationalities";
import CONFEDERATIONS from "../../data/confederations";
import {
  european_cupQualifiers,
  nationsLeague,
  worldClubs,
  worldCup,
  worldCupQualifier,
} from "../../data/competitions";
import {
  nationalCupRules,
  nationalLeagueRules,
  nationalSupercupRules,
} from "../../data/rules";
import { CompetitionId } from "../../types/competition";

interface GenerateRegionalCompetitionProps {
  draftCompetition: RegionalCompetition;
}

interface GenerateNationalLeagueProps {
  nationality: Nationality;
  continentalCompetitionId: CompetitionId;
  countrySlots: number;
}

export function generateNationalLeague({
  nationality,
  continentalCompetitionId,
  countrySlots,
}: GenerateNationalLeagueProps): Competition {
  return {
    id: `${nationality}_league` as CompetitionId,
    eligibility: { nationality, teamType: "club" },
    rules: nationalLeagueRules,
    frequency: "anual",
    output: [{ id: continentalCompetitionId, slots: countrySlots }],
  };
}

interface GenerateNationalCupProps {
  nationality: Nationality;
}
export function generateNationalCup({
  nationality,
}: GenerateNationalCupProps): Competition {
  return {
    id: `${nationality}_cup` as CompetitionId,
    eligibility: { nationality, teamType: "club" },
    rules: nationalCupRules,
    frequency: "anual",
  };
}

export function generateNationalSupercup({
  nationality,
}: GenerateNationalCupProps): Competition {
  return {
    id: `${nationality}_supercup` as CompetitionId,
    eligibility: { nationality, teamType: "club" },
    rules: nationalSupercupRules,
    frequency: "anual",
    input: [
      { id: `${nationality}_league` as CompetitionId, slots: 1 },
      { id: `${nationality}_cup` as CompetitionId, slots: 1 },
    ],
  };
}

export function generateRegionalClubsCompetition({
  draftCompetition,
}: GenerateRegionalCompetitionProps): Competition {
  const { id, slotsByNationality, rules, eligibility } = draftCompetition;
  const input = Object.entries(slotsByNationality || {}).map(
    ([nationality, slots]) => ({
      id: `${nationality}_league` as CompetitionId,
      slots: slots as number,
    }),
  );

  return {
    id,
    eligibility,
    rules,
    frequency: "anual",
    input,
    output: [{ id: "worldClubs" as CompetitionId, slots: 1 }],
  };
}

export function generateRegionalCup({
  draftCompetition,
}: GenerateRegionalCompetitionProps): Competition {
  const { id, rules, eligibility } = draftCompetition;
  const input =
    eligibility.region === "european"
      ? [{ id: `${id}Qualifiers` as CompetitionId, slots: 24 }]
      : [];
  return {
    id,
    eligibility,
    rules,
    frequency: "quadrienal",
    input,
  };
}

export const buildCompetitions = (): Competition[] => {
  const allCompetitions: Competition[] = [
    worldCupQualifier,
    worldCup,
    worldClubs,
  ];
  Object.entries(CONFEDERATIONS).forEach(([region, confederation]) => {
    if (!confederation) return;
    const continentalClubComp = confederation.competitions.find(
      (c) => c.eligibility.teamType === "club",
    ) as RegionalCompetition;
    const allNationalities = new Set<Nationality>();
    confederation.competitions.forEach((def) => {
      Object.keys(def.slotsByNationality || {}).forEach((nationality) =>
        allNationalities.add(nationality as Nationality),
      );
    });
    allNationalities.forEach((nationality) => {
      const countrySlots =
        continentalClubComp?.slotsByNationality?.[nationality] ??
        continentalClubComp?.defaultSlots ??
        1;
      allCompetitions.push(
        generateNationalLeague({
          nationality,
          continentalCompetitionId: continentalClubComp.id as CompetitionId,
          countrySlots,
        }),
      );
      allCompetitions.push(generateNationalCup({ nationality }));
      allCompetitions.push(generateNationalSupercup({ nationality }));
    });
    confederation.competitions.forEach((competition) => {
      if (competition.eligibility.teamType === "club") {
        const respectiveCompetition = generateRegionalClubsCompetition({
          draftCompetition: competition,
        });
        if (!allCompetitions.some((c) => c.id === respectiveCompetition.id)) {
          allCompetitions.push(respectiveCompetition);
        }
      }
      if (competition.eligibility.teamType === "national") {
        if (competition.rules.format === "league") {
          allCompetitions.push(nationsLeague);
        } else {
          const nationsCup = generateRegionalCup({
            draftCompetition: competition,
          });
          if (!allCompetitions.some((c) => c.id === nationsCup.id)) {
            allCompetitions.push(nationsCup);
          }
          if (
            region === "european" &&
            !allCompetitions.some((c) => c.id === "european_cupQualifiers")
          ) {
            allCompetitions.push(european_cupQualifiers);
          }
        }
      }
    });
  });

  return allCompetitions;
};
