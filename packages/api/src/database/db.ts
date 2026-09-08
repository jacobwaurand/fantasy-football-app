import { Database } from "bun:sqlite";
import { initializeDatabase } from "./init";

const db = new Database(`${import.meta.dir}/../../fantasy-football.db`);

db.run("PRAGMA foreign_keys = ON");
initializeDatabase(db);

export { db };
