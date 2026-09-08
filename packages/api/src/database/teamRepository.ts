import type { RosterSettings, Team } from "@fantasy/shared";
import { db } from "./db";

export function getTeamById(id: number) {
  return (db.prepare("SELECT * FROM teams WHERE id = ?").get(id) as Team | undefined) ?? null;
}

export function getTeamsByPartyId(partyId: number) {
  return db.prepare("SELECT * FROM teams WHERE partyId = ?").all(partyId) as Team[];
}

export function createTeam(team: Pick<Team, "name" | "partyId" | "userId"> & Pick<Team, "classId">) {
  return db
    .prepare("INSERT INTO teams (name, partyId, userId, classId) VALUES (?, ?, ?, ?)")
    .run(team.name, team.partyId, team.userId, team.classId ?? null);
}

export function deleteTeamById(id: number) {
  return db.transaction(() => {
    db.prepare("DELETE FROM team_players WHERE teamId = ?").run(id);
    db.prepare("DELETE FROM matchups WHERE teamAId = ? OR teamBId = ?").run(id, id);
    return db.prepare("DELETE FROM teams WHERE id = ?").run(id);
  })();
}

export function getRosterSettingsByTeamId(teamId: number) {
  return db
    .prepare(
      `
    SELECT roster_settings.*
    FROM roster_settings
    INNER JOIN parties ON parties.id = roster_settings.partyId
    INNER JOIN teams ON teams.partyId = parties.id
    WHERE teams.id = ?
  `
    )
    .get(teamId) as RosterSettings;
}
