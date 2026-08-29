const baseUrl = 'https://api.sleeper.app/v1'

type SleeperPlayer = {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    position?: string;
    team?: string;
    team_abbr?: string;
}

async function getNflPlayers() {
    type PlayerData = Record<string, SleeperPlayer>;
    const response = await fetch(`${baseUrl}/players/nfl`);
    if (!response.ok) {
        throw new Error(`Failed to fetch NFL players: ${response.statusText}`);
    }
    const data: PlayerData = await response.json();
    const players = Object.entries(data).map(([id, player]: [string, SleeperPlayer]) => {
        const fullName = [player?.first_name, player?.last_name].filter(Boolean).join(" ");

        return {
            sleeper_id: id,
            first_name: player?.first_name ?? null,
            last_name: player?.last_name ?? null,
            full_name: fullName,
            position: player?.position ?? null,
            team: player?.team ?? player?.team_abbr ?? null
        }
    });
    return players;
}


async function getWeeklyStats(season: number, week: number) {
    const response = await fetch(`${baseUrl}/stats/nfl/regular/${season}/${week}`);
    console.log('Weekly stats endpoint response:', response);
    return response.json(); // keyed by player_id
}

export { getNflPlayers, getWeeklyStats }