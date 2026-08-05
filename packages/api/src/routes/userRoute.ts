import { Hono } from 'hono'
import type { User } from '@fantasy/shared'
import { Database } from 'bun:sqlite'

type AppBindings = {
    Variables: {
        DB: Database
    }
}

const userRoute = new Hono<AppBindings>()

userRoute.get('/', (c) => c.text('Hello World!'))
userRoute.get('/:id', (c) => {
  const id = c.req.param('id')
  return c.text(`Hello Hono! Your ID is ${id}`)
})
userRoute.post('/', async (c) => {
  const user: Partial<User> = await c.req.json()

  if (!user.name || !user.email || !user.password) {
    return c.json({ message: 'Missing required fields' }, 400)
  }

  return c.json({ message: 'Data received', data: user })
})
userRoute.delete('/:id', (c) => {
  const id = c.req.param('id')
  return c.text(`Deleted item with ID: ${id}`)
})

export { userRoute }