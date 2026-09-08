import type { Party } from "@fantasy/shared";
import { db } from "./db";

export function getPartyById(id: string) {
  return db.prepare("SELECT * FROM parties WHERE id = ?").get(id);
}

export function createParty(party: Pick<Party, "name" | "ownerId" | "season">) {
  return db.prepare("INSERT INTO parties (name, ownerId, season) VALUES (?, ?, ?)").run(party.name, party.ownerId, party.season);
}

export function deletePartyById(id: string) {
  return db.transaction(() => {
    db.prepare(
      `
      DELETE FROM team_players
      WHERE teamId IN (SELECT id FROM teams WHERE partyId = ?)
    `
    ).run(id);
    db.prepare(
      `
      DELETE FROM matchups
      WHERE teamAId IN (SELECT id FROM teams WHERE partyId = ?)
        OR teamBId IN (SELECT id FROM teams WHERE partyId = ?)
    `
    ).run(id, id);
    db.prepare("DELETE FROM teams WHERE partyId = ?").run(id);
    db.prepare("DELETE FROM roster_settings WHERE partyId = ?").run(id);
    db.prepare("DELETE FROM party_settings WHERE partyId = ?").run(id);
    return db.prepare("DELETE FROM parties WHERE id = ?").run(id);
  })();
}

// Party Roster Settings
export function getRosterSettingsByPartyId(partyId: string) {
  return db
    .prepare(
      `
    SELECT roster_settings.*
    FROM roster_settings
    WHERE roster_settings.partyId = ?
  `
    )
    .get(partyId);
}
