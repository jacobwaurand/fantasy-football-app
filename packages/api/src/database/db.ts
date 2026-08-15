import { Database } from 'bun:sqlite'
import { initializeDatabase } from './init'

const db = new Database('fantasy-football.db')

initializeDatabase(db);

export { db }
