import type { League } from '@fantasy/shared'
import { db } from './db'

export function getLeagueById(id: string) {
  return db.prepare('SELECT * FROM leagues WHERE id = ?').get(id)
}

export function createLeague(league: Pick<League, 'name' | 'ownerId' | 'season'>) {
  return db.prepare(
    'INSERT INTO leagues (name, owner_id, season) VALUES (?, ?, ?)',
  ).run(league.name, league.ownerId, league.season)
}

export function deleteLeagueById(id: string) {
  return db.transaction(() => {
    db.prepare(`
      DELETE FROM team_players
      WHERE team_id IN (SELECT id FROM teams WHERE league_id = ?)
    `).run(id)
    db.prepare(`
      DELETE FROM matchups
      WHERE team_a_id IN (SELECT id FROM teams WHERE league_id = ?)
         OR team_b_id IN (SELECT id FROM teams WHERE league_id = ?)
    `).run(id, id)
    db.prepare('DELETE FROM teams WHERE league_id = ?').run(id)
    db.prepare('DELETE FROM roster_settings WHERE league_id = ?').run(id)
    db.prepare('DELETE FROM league_settings WHERE league_id = ?').run(id)
    return db.prepare('DELETE FROM leagues WHERE id = ?').run(id)
  })()
}

// League Roster Settings
export function getRosterSettingsByLeagueId(leagueId: string) {
  return db.prepare(`
    SELECT roster_settings.*
    FROM roster_settings
    WHERE roster_settings.league_id = ?
  `).get(leagueId)
}
