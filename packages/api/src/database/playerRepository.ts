import { db } from "./db";
import { SleeperPlayer } from "../sleeper/sleeperApi";
import { defaultRosterSettings, canAddPlayerToTeam, type Player } from "@fantasy/shared";
import { getTeamById } from "./teamRepository";

export function getPlayerIdsByPartyId(partyId: number) {
  return db
    .prepare(
      `
    SELECT players.id
    FROM players
    INNER JOIN team_players ON team_players.playerId = players.id
    INNER JOIN teams ON teams.id = team_players.teamId
    WHERE teams.partyId = ?
  `
    )
    .all(partyId);
}

export function addPlayerToTeam(teamId: number, playerId: number) {
  const rosterSettings = defaultRosterSettings; // Replace with actual roster settings retrieval logic if needed
  const teamPlayers = getPlayersByTeamId(teamId);
  const team = getTeamById(teamId);
  const player = getPlayer(playerId);

  if (!team) {
    throw new Error(`Team not found: ${teamId}`);
  }
  if (!player) {
    throw new Error(`Player not found: ${playerId}`);
  }
  if (!canAddPlayerToTeam(rosterSettings, teamPlayers, player)) {
    throw new Error(`Cannot add player ${playerId} to team ${teamId}`);
  }

  return db.prepare("INSERT INTO team_players (playerId, teamId, partyId) VALUES (?, ?, ?)").run(playerId, teamId, team.partyId);
}

export function removePlayerFromTeam(teamId: number, playerId: number) {
  return db.prepare("DELETE FROM team_players WHERE playerId = ? AND teamId = ?").run(playerId, teamId);
}

export function getPlayersByTeamId(teamId: number) {
  return db
    .prepare(
      `
        SELECT players.*
        FROM players
        INNER JOIN team_players ON team_players.playerId = players.id
        WHERE team_players.teamId = ?
    `
    )
    .all(teamId) as Player[];
}

export function getPlayer(playerId: number): Player | null {
  return (db.prepare("SELECT * FROM players WHERE id = ?").get(playerId) as Player | undefined) ?? null;
}

export async function insertPlayers(players: SleeperPlayer[]) {
  if (!players || players.length === 0) {
    return { inserted: 0 };
  }

  const insertStatement = db.prepare(`
    INSERT OR IGNORE INTO players (sleeperId, firstName, lastName, fullName, position, team, status)
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
        player.status ?? null
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
