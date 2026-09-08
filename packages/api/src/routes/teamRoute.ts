import { Hono } from "hono";
import type { Team } from "@fantasy/shared";
import { createTeam, deleteTeamById, getTeamById } from "../database/teamRepository";
import { getPlayersByTeamId, addPlayerToTeam, removePlayerFromTeam } from "../database/playerRepository";

const teamRoute = new Hono();

teamRoute.get("/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const team = getTeamById(id);
  return c.json(team);
});

teamRoute.post("/", async (c) => {
  const team: Partial<Team> = await c.req.json();

  if (!team.name || !team.partyId || !team.userId) {
    return c.json({ message: "Missing required fields" }, 400);
  }

  const result = createTeam({
    name: team.name,
    partyId: team.partyId,
    userId: team.userId,
    classId: team?.classId,
  });

  return c.text(`Created Team: ${result.lastInsertRowid}`);
});

teamRoute.delete("/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  deleteTeamById(id);
  return c.text(`Deleted team with ID: ${id}`);
});

// Team Players Routes
teamRoute.get("/:id/players", (c) => {
  const teamId = parseInt(c.req.param("id"));
  const players = getPlayersByTeamId(teamId);
  return c.json(players);
});

teamRoute.post("/:teamId/players/:playerId", (c) => {
  const teamId = parseInt(c.req.param("teamId"));
  const playerId = parseInt(c.req.param("playerId"));

  const result = addPlayerToTeam(teamId, playerId);

  return c.text(`Added player ${playerId} to team ${teamId}`);
});

teamRoute.delete("/:teamId/players/:playerId", (c) => {
  const teamId = parseInt(c.req.param("teamId"));
  const playerId = parseInt(c.req.param("playerId"));

  removePlayerFromTeam(teamId, playerId);

  return c.text(`Removed player ${playerId} from team ${teamId}`);
});

export { teamRoute };
