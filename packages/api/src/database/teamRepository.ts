import type { Team } from '@fantasy/shared'
import { db } from './db'

export function getTeamById(id: string) {
  return db.prepare('SELECT * FROM teams WHERE id = ?').get(id)
}

export function createTeam(team: Pick<Team, 'name' | 'leagueId' | 'userId'> & Pick<Team, 'classId'>) {
  return db.prepare(
    'INSERT INTO teams (name, league_id, user_id, class_id) VALUES (?, ?, ?, ?)',
  ).run(team.name, team.leagueId, team.userId, team.classId ?? null)
}

export function deleteTeamById(id: string) {
  return db.prepare('DELETE FROM teams WHERE id = ?').run(id)
}
