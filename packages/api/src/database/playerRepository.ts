import { db } from './db'
import { SleeperPlayer } from '../sleeper/sleeperApi'

export async function insertPlayers(players: SleeperPlayer[]) {
  if (!players || players.length === 0) {
    return { inserted: 0 }
  }

  const insertStatement = db.prepare(`
    INSERT OR IGNORE INTO players (sleeper_id, first_name, last_name, full_name, position, team)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  let inserted = 0

  db.transaction(() => {
    for (const player of players) {
      const sleeper_id = player.sleeper_id ?? null
      if (!sleeper_id) {
        continue
      }

      const result = insertStatement.run(
        sleeper_id,
        player.first_name ?? null,
        player.last_name ?? null,
        player.full_name ?? null,
        player.position ?? null,
        player.team ?? null
      )

      if (result.changes > 0) {
        inserted += 1
      }
    }
  })()

  return { inserted }
}
