import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello World!'))
app.get('/:id', (c) => {
  const id = c.req.param('id')
  return c.text(`Hello Hono! Your ID is ${id}`)
})
app.post('/', async (c) => {
  const body = await c.req.json()
  return c.json({ message: 'Data received', data: body })
})
app.delete('/:id', (c) => {
  const id = c.req.param('id')
  return c.text(`Deleted item with ID: ${id}`)
})

export const userController = app