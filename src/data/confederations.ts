import { Confederation, Region } from "../types/competition";
import { nationsCupRules, regionalClubsRules } from "./rules";
const FIFA = {
    id: "FIFA",
    slotsByConfederation: {
        UEFA: 16,
        CONMEBOL: 6,
        CONCACAF: 8,
    },
    defaultSlots: 4,
    competitions: [
        {
            teamType: "national",
            format: "cup",
        },
        {
            // Eurocopa
            teamType: "club",
            format: "cup",
        },
    ],
};

const CONFEDERATIONS: Partial<Record<Region, Confederation>> = {
    european: {
        id: "UEFA",
        name: "União das Associações Europeias de Futebol",
        competitions: [
            {
                id: "european_clubs_competition",
                eligibility: { region: "european", teamType: "club" },
                rules: regionalClubsRules,
                slotsByNationality: { GB: 4, ES: 4, DE: 4, IT: 4, PT: 2 },
                defaultSlots: 1,
            },
            {
                id: "european_cup",
                eligibility: { region: "european", teamType: "national" },
                rules: { ...nationsCupRules, hasThirdPlaceMatch: false },
            },
            {
                id: "european_nations_competition",
                eligibility: { region: "european", teamType: "national" },
                rules: {
                    format: "league",
                    hasGroupStage: false,
                    leagueGamesPerOpponent: 2,
                    hasThirdPlaceMatch: false,
                    finalIsSingleGame: true,
                },
            },
        ],
    },
    southAmerican: {
        id: "CONMEBOL",
        name: "Confederação Sul-Americana de Futebol",
        competitions: [
            {
                id: "southAmerican_clubs_competition",
                eligibility: { region: "southAmerican", teamType: "club" },
                rules: regionalClubsRules,
                slotsByNationality: { BR: 6, AR: 6, UY: 4, CO: 4, CL: 4 },
                defaultSlots: 2,
            },
            {
                id: "southAmerican_cup",
                eligibility: { region: "southAmerican", teamType: "national" },
                rules: nationsCupRules,
            },
        ],
    },
    northAmerican: {
        id: "CONCACAF",
        name: "Confederação Norte-Americana de Futebol",
        competitions: [
            {
                id: "northAmerican_clubs_competition",
                eligibility: { region: "northAmerican", teamType: "club" },
                rules: regionalClubsRules,
                slotsByNationality: { US: 10 },
                defaultSlots: 2,
            },
            {
                id: "northAmerican_cup",
                eligibility: { region: "northAmerican", teamType: "national" },
                rules: nationsCupRules,
            },
        ],
    },
};

export default CONFEDERATIONS;
