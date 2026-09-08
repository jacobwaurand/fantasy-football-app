import { Database } from "bun:sqlite";

export function initializeDatabase(db: Database) {
  initializeUsersTable(db);
  initializeTeamsTable(db);
  initializePlayersTable(db);
  initializeTeamPlayersTable(db);
  initializeMatchupsTable(db);
  initializePartiesTable(db);
}

function initializeUsersTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

function initializeTeamsTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            partyId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            classId TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (partyId) REFERENCES parties(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
}

function initializePlayersTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sleeperId TEXT NOT NULL UNIQUE,
            firstName TEXT,
            lastName TEXT,
            fullName TEXT,
            position TEXT,
            team TEXT,
            status TEXT
        )
    `);
}

function initializeTeamPlayersTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS team_players (
            playerId INTEGER NOT NULL,
            teamId INTEGER NOT NULL,
            partyId INTEGER NOT NULL,
            PRIMARY KEY (playerId, teamId),
            UNIQUE (playerId, partyId),
            FOREIGN KEY (playerId) REFERENCES players(id) ON DELETE CASCADE,
            FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE
        )
    `);
}

function initializeMatchupsTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS matchups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            week INTEGER NOT NULL,
            teamAId INTEGER NOT NULL,
            teamBId INTEGER NOT NULL,
            FOREIGN KEY (teamAId) REFERENCES teams(id) ON DELETE CASCADE,
            FOREIGN KEY (teamBId) REFERENCES teams(id) ON DELETE CASCADE
        )
    `);
}

function initializePartiesTable(db: Database) {
  db.run(`
        CREATE TABLE IF NOT EXISTS parties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            ownerId INTEGER NOT NULL,
            season INTEGER NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

  db.run(`
        CREATE TABLE IF NOT EXISTS roster_settings (
            partyId INTEGER PRIMARY KEY,
            benchSlots INTEGER NOT NULL,
            numQB INTEGER NOT NULL,
            numRB INTEGER NOT NULL,
            numWR INTEGER NOT NULL,
            numTE INTEGER NOT NULL,
            numFLEX INTEGER NOT NULL,
            numDEF INTEGER NOT NULL,
            numK INTEGER NOT NULL,
            flexPositions TEXT NOT NULL,
            FOREIGN KEY (partyId) REFERENCES parties(id) ON DELETE CASCADE
        )
    `);

  db.run(`
        CREATE TABLE IF NOT EXISTS party_settings (
            partyId INTEGER PRIMARY KEY,
            maxNumTeams INTEGER NOT NULL,
            FOREIGN KEY (partyId) REFERENCES parties(id) ON DELETE CASCADE
        )
    `);
}
