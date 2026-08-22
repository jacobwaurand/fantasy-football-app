import { Hono } from 'hono'
import { userRoute } from './routes/userRoute'
import { startCron } from './cron/sleeperCron'

const app = new Hono()

startCron() // Start the cron job when the server starts

app.get('/', (c) => c.text('Hello World!'))
app.route('/user', userRoute)

export default app
