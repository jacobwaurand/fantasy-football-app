import { Hono } from 'hono'
import type { Team } from '@fantasy/shared'
import {
  createTeam,
  deleteTeamById,
  getTeamById,
} from '../database/teamRepository'
import { getPlayersByTeamId } from '../database/playerRepository'

const teamRoute = new Hono()

teamRoute.get('/:id/players', (c) => {
  const teamId = c.req.param('id')
  const players = getPlayersByTeamId(teamId)
  return c.json(players)
})

teamRoute.get('/:id', (c) => {
  const id = c.req.param('id')
  const team = getTeamById(id)
  return c.json(team)
})

teamRoute.post('/', async (c) => {
  const team: Partial<Team> = await c.req.json()

  if (!team.name || !team.leagueId || !team.userId) {
    return c.json({ message: 'Missing required fields' }, 400)
  }

  const result = createTeam({
    name: team.name,
    leagueId: team.leagueId,
    userId: team.userId,
    classId: team.classId,
  })

  return c.text(`Created Team: ${result.lastInsertRowid}`)
})

teamRoute.delete('/:id', (c) => {
  const id = c.req.param('id')
  deleteTeamById(id)
  return c.text(`Deleted team with ID: ${id}`)
})

export { teamRoute }