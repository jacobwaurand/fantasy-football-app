import { Hono } from 'hono'
import type { User } from '@fantasy/shared'
import { createUser, deleteUserById, getUserById } from '../database/userRepository'

const userRoute = new Hono()

userRoute.get('/:id', (c) => {
  const id = c.req.param('id')
  const user = getUserById(id)
  return c.json(user)
})
userRoute.post('/', async (c) => {
  const user: Partial<User> = await c.req.json()

  if (!user.name || !user.email || !user.password) {
    return c.json({ message: 'Missing required fields' }, 400)
  }

  const result = createUser({
    name: user.name,
    email: user.email,
    password: user.password,
  })

  return c.text(`Created User: ${result.lastInsertRowid}`)
})
userRoute.delete('/:id', (c) => {
  const id = c.req.param('id')
  deleteUserById(id)
  return c.text(`Deleted user with ID: ${id}`)
})

export { userRoute }