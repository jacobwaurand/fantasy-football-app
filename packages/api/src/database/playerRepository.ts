import { db } from "./db";
import { SleeperPlayer } from "../sleeper/sleeperApi";
import { RosterSettings } from "@fantasy/shared";
import { getRosterSettingsByTeamId } from "./teamRepository";

export function getPlayerIdsByLeagueId(leagueId: string) {
  return db.prepare(`
    SELECT players.id
    FROM players
    INNER JOIN team_players ON team_players.player_id = players.id
    INNER JOIN teams ON teams.id = team_players.team_id
    WHERE teams.league_id = ?
  `).all(leagueId)
}

export function addPlayerToTeam(teamId: number, playerId: number) {
  const rosterSettings = getRosterSettingsByTeamId(teamId);
  const teamPlayers = getPlayersByTeamId(teamId);

  
  
  return db.prepare(
    'INSERT INTO team_players (player_id, team_id) VALUES (?, ?)',
  ).run(playerId, teamId)
}

export function removePlayerFromTeam(teamId: number, playerId: number) {
    return db.prepare(
        'DELETE FROM team_players WHERE player_id = ? AND team_id = ?',
    ).run(playerId, teamId)
}

export function getPlayersByTeamId(teamId: number) {
    return db.prepare(`
        SELECT players.*
        FROM players
        INNER JOIN team_players ON team_players.player_id = players.id
        WHERE team_players.team_id = ?
    `).all(teamId)
}

export async function insertPlayers(players: SleeperPlayer[]) {
  if (!players || players.length === 0) {
    return { inserted: 0 };
  }

  const insertStatement = db.prepare(`
    INSERT OR IGNORE INTO players (sleeper_id, first_name, last_name, full_name, position, team, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  let inserted = 0;

  db.transaction(() => {
    for (const player of players) {
      const sleeper_id = player.sleeper_id ?? null;
      if (!sleeper_id) {
        continue;
      }

      const result = insertStatement.run(
        sleeper_id,
        player.first_name ?? null,
        player.last_name ?? null,
        player.full_name ?? null,
        player.position ?? null,
        player.team ?? null,
        player.status ?? null,
      );

      if (result.changes > 0) {
        inserted += 1;
      }
    }
  })();

  return { inserted };
}

export async function insertWeeklyPlayerStats(weeklyStats: any[]) {
  if (!weeklyStats || weeklyStats.length === 0) {
    return { inserted: 0 };
  }

  const insertStatement = db.prepare(`
    INSERT OR IGNORE INTO weekly_player_stats (player_id, week, season, passing_yards, passing_touchdowns, interceptions, rushing_yards, rushing_touchdowns, receptions, receiving_yards, receiving_touchdowns)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
}
