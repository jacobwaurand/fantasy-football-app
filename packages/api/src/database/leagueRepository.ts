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
  return db.prepare('DELETE FROM leagues WHERE id = ?').run(id)
}
