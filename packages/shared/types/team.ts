export type Team = {
    id: number;
    name: string;
    leagueId: number;
    userId: number;
    classId?: string;
};

export type TeamPlayer = {
    playerId: number;
    teamId: number;
    leagueId: number;
};
