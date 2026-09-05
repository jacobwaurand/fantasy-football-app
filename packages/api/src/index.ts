import { Hono } from 'hono'
import { leagueRoute } from './routes/leagueRoute'
import { teamRoute } from './routes/teamRoute'
import { userRoute } from './routes/userRoute'
import { startCron } from './cron/sleeperCron'

const app = new Hono()

startCron() // Start the cron job when the server starts

app.get('/', (c) => c.text('Hello World!'))
app.route('/league', leagueRoute)
app.route('/team', teamRoute)
app.route('/user', userRoute)

export default app
