import { Hono } from 'hono'
import { userRoute } from './routes/userRoute'
import { Database } from 'bun:sqlite'

type AppBindings = {
    Variables: {
        DB: Database
    }
}

const db = new Database('fantasy-football.db')
const app = new Hono<AppBindings>()

app.use('*', async (c, next) => {
    c.set('DB', db)
    await next()
})

app.get('/', (c) => c.text('Hello World!'))
app.route('/user', userRoute)

export default app
