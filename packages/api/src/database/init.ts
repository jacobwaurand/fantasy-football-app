import { Database } from "bun:sqlite";

export function initializeDatabase(db: Database) {
  initializeUsersTable(db);
  initializeTeamsTable(db);
  initializePlayersTable(db);
    initializeTeamPlayersTable(db);
  initializeMatchupsTable(db);
  initializeLeaguesTable(db);
}

function initializeUsersTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

function initializeTeamsTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            league_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            class_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (league_id) REFERENCES leagues(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
}

function initializePlayersTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sleeper_id TEXT NOT NULL UNIQUE,
            first_name TEXT,
            last_name TEXT,
            full_name TEXT,
            position TEXT,
            team TEXT,
            status TEXT
        )
    `);
}

function initializeTeamPlayersTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS team_players (
            player_id INTEGER NOT NULL,
            team_id INTEGER NOT NULL,
            PRIMARY KEY (player_id, team_id),
            FOREIGN KEY (player_id) REFERENCES players(id),
            FOREIGN KEY (team_id) REFERENCES teams(id)
        )
    `);
}

function initializeMatchupsTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS matchups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            week INTEGER NOT NULL,
            team_a_id INTEGER NOT NULL,
            team_b_id INTEGER NOT NULL,
            FOREIGN KEY (team_a_id) REFERENCES teams(id),
            FOREIGN KEY (team_b_id) REFERENCES teams(id)
        )
    `);
}

function initializeLeaguesTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS leagues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            owner_id INTEGER NOT NULL,
            season INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users(id)
        )
    `);

  db.run(`
        CREATE TABLE IF NOT EXISTS roster_settings (
            league_id INTEGER PRIMARY KEY,
            bench_slots INTEGER NOT NULL,
            num_qb INTEGER NOT NULL,
            num_rb INTEGER NOT NULL,
            num_wr INTEGER NOT NULL,
            num_te INTEGER NOT NULL,
            num_flex INTEGER NOT NULL,
            num_def INTEGER NOT NULL,
            num_k INTEGER NOT NULL,
            flex_positions TEXT NOT NULL,
            FOREIGN KEY (league_id) REFERENCES leagues(id)
        )
    `);

  db.run(`
        CREATE TABLE IF NOT EXISTS league_settings (
            league_id INTEGER PRIMARY KEY,
            max_num_teams INTEGER NOT NULL,
            FOREIGN KEY (league_id) REFERENCES leagues(id)
        )
    `);
}
