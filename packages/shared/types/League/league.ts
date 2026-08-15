type League = {
    id: number;
    name: string;
    ownerId: number;
    RosterSettings: RosterSettings;
    createdAt: Date;
    updatedAt: Date;
}

type RosterSettings = {
    leagueId: number;
    benchSlots: number;
    starterSlots: {
        QB: number;
        RB: number;
        WR: number;
        TE: number;
        FLEX: number;
        DEF: number;
        K: number;
    }
};

type LeagueSettings = {
    leagueId: number;
    numberOfTeams: number;
    regularSeasonWeeks: number;
    numberOfPlayoffTeams: number;
    lineupLockDay: string;
    abilityLockDay: string;
};

export { League, RosterSettings, LeagueSettings };