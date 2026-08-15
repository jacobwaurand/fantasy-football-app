import { Hono } from 'hono'
import { userRoute } from './routes/userRoute'

const app = new Hono()

app.get('/', (c) => c.text('Hello World!'))
app.route('/user', userRoute)

export default app
