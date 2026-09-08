export type Party = {
    id: number;
    name: string;
    ownerId: number;
    season: number;
};

export type RosterSettings = {
    partyId: number;
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

export type PartySettings = {
    partyId: number;
    maxNumTeams: number;
};

export const defaultRosterSettings: RosterSettings = {
    partyId: 0,
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

export const defaultPartySettings: PartySettings = {
    partyId: 0,
    maxNumTeams: 4,
};
