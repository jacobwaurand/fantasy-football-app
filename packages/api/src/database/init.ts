import { Database } from 'bun:sqlite'

export function initializeDatabase(db: Database) {
    initializeUsersTable(db);
    initializeTeamsTable(db);
    initializePlayersTable(db);
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
            owner_id INTEGER NOT NULL,
            fantasy_class TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users(id)
        )
    `);
}

function initializePlayersTable(db: Database) {
    db.run(`
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            position TEXT NOT NULL
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
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS roster_settings (
            league_id INTEGER PRIMARY KEY,
            bench_slots INTEGER NOT NULL,
            starter_slots_qb INTEGER NOT NULL,
            starter_slots_rb INTEGER NOT NULL,
            starter_slots_wr INTEGER NOT NULL,
            starter_slots_te INTEGER NOT NULL,
            starter_slots_flex INTEGER NOT NULL,
            starter_slots_def INTEGER NOT NULL,
            starter_slots_k INTEGER NOT NULL,
            FOREIGN KEY (league_id) REFERENCES leagues(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS league_settings (
            league_id INTEGER PRIMARY KEY,
            number_of_teams INTEGER NOT NULL,
            regular_season_weeks INTEGER NOT NULL,
            number_of_playoff_teams INTEGER NOT NULL,
            lineup_lock_day TEXT NOT NULL,
            ability_lock_day TEXT NOT NULL,
            FOREIGN KEY (league_id) REFERENCES leagues(id)
        )
    `);
}
