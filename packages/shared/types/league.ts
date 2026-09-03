export type League = {
    id: number;
    name: string;
    ownerId: number;
    season: number;
};

export type RosterSettings = {
    leagueId: number;
    benchSlots: number;
    numQB: number;
    numRB: number;
    numWR: number;
    numTE: number;
    numFLEX: number;
    numDEF: number;
    numK: number;
    flexPositions: string[];
};

export type LeagueSettings = {
    leagueId: number;
    maxNumTeams: number;
};

export const defaultRosterSettings: RosterSettings = {
    leagueId: 0,
    benchSlots: 6,
    numQB: 1,
    numRB: 2,
    numWR: 2,
    numTE: 1,
    numFLEX: 1,
    numDEF: 1,
    numK: 1,
    flexPositions: ["RB", "WR", "TE"],
};

export const defaultLeagueSettings: LeagueSettings = {
    leagueId: 0,
    maxNumTeams: 4,
};
