const baseUrl = 'https://api.sleeper.app/v1'

export type SleeperPlayer = {
    sleeper_id?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    position?: string;
    team?: string;
    team_abbr?: string;
}

export async function getNflPlayers() {
    type PlayerData = Record<string, SleeperPlayer>;
    const response = await fetch(`${baseUrl}/players/nfl`);
    if (!response.ok) {
        throw new Error(`Failed to fetch NFL players: ${response.statusText}`);
    }
    const data: PlayerData = await response.json();
    const players = Object.entries(data).map(([id, player]: [string, SleeperPlayer]) => {
        const fullName = [player?.first_name, player?.last_name].filter(Boolean).join(" ");
        return { ...player, sleeper_id: id, full_name: fullName } as SleeperPlayer;
    });
    return players;
}


export async function getWeeklyStats(season: number, week: number) {
    const response = await fetch(`${baseUrl}/stats/nfl/regular/${season}/${week}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch weekly stats: ${response.statusText}`);
    }
    console.log('Weekly stats endpoint response:', response);
    const data = await response.json(); // keyed by player_id
    return data;
}