import { Hono } from "hono";
import type { Party } from "@fantasy/shared";
import { createParty, deletePartyById, getPartyById, getRosterSettingsByPartyId } from "../database/partyRepository";
import { getPlayerIdsByPartyId } from "../database/playerRepository";

const partyRoute = new Hono();

partyRoute.get("/:id", (c) => {
  const id = c.req.param("id");
  const party = getPartyById(id);
  return c.json(party);
});

partyRoute.post("/", async (c) => {
  const party: Partial<Party> = await c.req.json();

  if (!party.name || !party.ownerId || !party.season) {
    return c.json({ message: "Missing required fields" }, 400);
  }

  const result = createParty({
    name: party.name,
    ownerId: party.ownerId,
    season: party.season,
  });

  return c.text(`Created Party: ${result.lastInsertRowid}`);
});

partyRoute.delete("/:id", (c) => {
  const id = c.req.param("id");
  deletePartyById(id);
  return c.text(`Deleted party with ID: ${id}`);
});

// Party Players Route
partyRoute.get("/:id/players", (c) => {
  const partyId = c.req.param("id");
  const playerIds = getPlayerIdsByPartyId(Number(partyId));
  return c.json(playerIds);
});

// Party Roster Settings Route
partyRoute.get("/:id/roster-settings", (c) => {
  const partyId = c.req.param("id");
  const rosterSettings = getRosterSettingsByPartyId(partyId);
  return c.json(rosterSettings);
});

export { partyRoute };
