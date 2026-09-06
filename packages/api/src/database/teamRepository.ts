import type { RosterSettings, Team } from '@fantasy/shared'
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
  return db.transaction(() => {
    db.prepare('DELETE FROM team_players WHERE team_id = ?').run(id)
    db.prepare('DELETE FROM matchups WHERE team_a_id = ? OR team_b_id = ?').run(id, id)
    return db.prepare('DELETE FROM teams WHERE id = ?').run(id)
  })()
}

export function getRosterSettingsByTeamId(teamId: number) {
  return db.prepare(`
    SELECT roster_settings.*
    FROM roster_settings
    INNER JOIN leagues ON leagues.id = roster_settings.league_id
    INNER JOIN teams ON teams.league_id = leagues.id
    WHERE teams.id = ?
  `).get(teamId) as RosterSettings
}
