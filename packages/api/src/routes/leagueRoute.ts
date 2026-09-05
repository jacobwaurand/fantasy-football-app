import { Hono } from 'hono'
import type { League } from '@fantasy/shared'
import { createLeague, deleteLeagueById, getLeagueById } from '../database/leagueRepository'

const leagueRoute = new Hono()

leagueRoute.get('/:id', (c) => {
  const id = c.req.param('id')
  const league = getLeagueById(id)
  return c.json(league)
})

leagueRoute.post('/', async (c) => {
  const league: Partial<League> = await c.req.json()

  if (!league.name || !league.ownerId || !league.season) {
    return c.json({ message: 'Missing required fields' }, 400)
  }

  const result = createLeague({
    name: league.name,
    ownerId: league.ownerId,
    season: league.season,
  })

  return c.text(`Created League: ${result.lastInsertRowid}`)
})

leagueRoute.delete('/:id', (c) => {
  const id = c.req.param('id')
  deleteLeagueById(id)
  return c.text(`Deleted league with ID: ${id}`)
})

export { leagueRoute }