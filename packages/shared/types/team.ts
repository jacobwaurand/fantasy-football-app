export type Team = {
    id: number;
    name: string;
    partyId: number;
    userId: number;
    classId?: string;
};

export type TeamPlayer = {
    playerId: number;
    teamId: number;
    partyId: number;
};
