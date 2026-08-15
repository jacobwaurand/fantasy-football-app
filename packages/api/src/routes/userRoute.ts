import { Hono } from 'hono'
import type { User } from '@fantasy/shared'
import { db } from '../database/db'

const userRoute = new Hono()

userRoute.get('/', (c) => c.text('Hello World!'))
userRoute.get('/:id', (c) => {
  const id = c.req.param('id')
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  return c.json(user)
})
userRoute.post('/', async (c) => {
  const user: Partial<User> = await c.req.json()

  if (!user.name || !user.email || !user.password) {
    return c.json({ message: 'Missing required fields' }, 400)
  }

  const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
    .run(user.name, user.email, user.password)
  result.lastInsertRowid

  return c.text(`Created User: ${result.lastInsertRowid}`)
})
userRoute.delete('/:id', (c) => {
  const id = c.req.param('id')
  db.prepare('DELETE FROM users WHERE id = ?').run(id)
  return c.text(`Deleted user with ID: ${id}`)
})

export { userRoute }