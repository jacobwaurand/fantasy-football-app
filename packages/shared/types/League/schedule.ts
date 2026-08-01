type Schedule = {
    week: number;
    matchups: {
        week: number;
        teamAId: number;
        teamBId: number;
    }[]
}
export { Schedule };