
const baseUrl = 'https://api.sleeper.app/v1'

async function getNflPlayers() {
    const response = await fetch(`${baseUrl}/players/nfl`);
    const data = await response.json();
    // Convert the object to an array of players
    const playersArray = Object.values(data);
    return playersArray;
}

async function getPlayerScoreByWeek(playerId: string, week: number) {
    const response = await fetch(`${baseUrl}/player/${playerId}/stats/${week}`);
    const data = await response.json();
    return data;
}

export { getNflPlayers, getPlayerScoreByWeek }