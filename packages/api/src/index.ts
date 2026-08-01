import { Hono } from 'hono'
import { userController } from './routes/userController'

const app = new Hono()

app.get('/', (c) => c.text('Hello World!'))
app.route('/user', userController)

export default app
