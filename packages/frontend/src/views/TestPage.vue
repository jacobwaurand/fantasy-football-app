<script setup lang="ts">
import { ref } from "vue";

type RequestMethod = "GET" | "POST" | "DELETE";

const apiBase = "/api";
const responseBody = ref("No request made yet.");
const responseStatus = ref("Idle");
const isLoading = ref(false);
const lastRequest = ref("");

const userId = ref("1");
const userName = ref("Test User");
const userEmail = ref(`test-${Date.now()}@example.com`);
const userPassword = ref("password");

const partyId = ref("1");
const partyName = ref("Test Party");
const partyOwnerId = ref("1");
const partySeason = ref("2026");

const teamId = ref("1");
const teamName = ref("Test Team");
const teamPartyId = ref("1");
const teamUserId = ref("1");
const teamClassId = ref("");
const rosterPlayerId = ref("1");

async function request(path: string, method: RequestMethod = "GET", body?: unknown) {
  isLoading.value = true;
  lastRequest.value = `${method} ${apiBase}${path}`;
  responseStatus.value = "Loading";

  try {
    const response = await fetch(`${apiBase}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await response.text();
    let formatted = text;

    try {
      formatted = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      // Text responses from create/delete endpoints are already readable.
    }

    responseStatus.value = `${response.status} ${response.statusText}`;
    responseBody.value = formatted || "(empty response)";
  } catch (error) {
    responseStatus.value = "Request failed";
    responseBody.value = error instanceof Error ? error.message : String(error);
  } finally {
    isLoading.value = false;
  }
}

function createUser() {
  return request("/user", "POST", {
    name: userName.value,
    email: userEmail.value,
    password: userPassword.value,
  });
}

function createParty() {
  return request("/party", "POST", {
    name: partyName.value,
    ownerId: Number(partyOwnerId.value),
    season: Number(partySeason.value),
  });
}

function createTeam() {
  return request("/team", "POST", {
    name: teamName.value,
    partyId: Number(teamPartyId.value),
    userId: Number(teamUserId.value),
    classId: teamClassId.value || undefined,
  });
}
</script>

<template>
  <main class="shell">
    <header class="masthead">
      <div>
        <p class="kicker">Fantasy Football / API Lab</p>
        <h1>Endpoint console</h1>
        <p class="lede">Create records, inspect relationships, and exercise roster changes from one place.</p>
      </div>
      <div class="connection">
        <span class="pulse"></span> Proxy target: <code>localhost:3000</code><button class="health" @click="request('/')">GET /</button>
      </div>
    </header>

    <section class="workspace">
      <div class="panels">
        <section class="panel">
          <div class="panel-heading">
            <span class="number">01</span>
            <div>
              <h2>Users</h2>
              <p>Identity and ownership records</p>
            </div>
          </div>
          <div class="form-grid">
            <label>Name<input v-model="userName" /></label>
            <label>Email<input v-model="userEmail" type="email" /></label>
            <label>Password<input v-model="userPassword" type="password" /></label>
            <label>User ID<input v-model="userId" inputmode="numeric" /></label>
          </div>
          <div class="actions">
            <button class="primary" @click="createUser">POST /user</button>
            <button @click="request(`/user/${userId}`)">GET /user/:id</button>
            <button class="danger" @click="request(`/user/${userId}`, 'DELETE')">DELETE /user/:id</button>
          </div>
        </section>

        <section class="panel">
          <div class="panel-heading">
            <span class="number">02</span>
            <div>
              <h2>Parties</h2>
              <p>Party records and draft context</p>
            </div>
          </div>
          <div class="form-grid">
            <label>Party name<input v-model="partyName" /></label>
            <label>Owner ID<input v-model="partyOwnerId" inputmode="numeric" /></label>
            <label>Season<input v-model="partySeason" inputmode="numeric" /></label>
            <label>Party ID<input v-model="partyId" inputmode="numeric" /></label>
          </div>
          <div class="actions">
            <button class="primary" @click="createParty">POST /party</button>
            <button @click="request(`/party/${partyId}`)">GET /party/:id</button>
            <button @click="request(`/party/${partyId}/players`)">GET players</button>
            <button @click="request(`/party/${partyId}/roster-settings`)">GET settings</button>
            <button class="danger" @click="request(`/party/${partyId}`, 'DELETE')">DELETE party</button>
          </div>
        </section>

        <section class="panel">
          <div class="panel-heading">
            <span class="number">03</span>
            <div>
              <h2>Teams</h2>
              <p>Team records and roster operations</p>
            </div>
          </div>
          <div class="form-grid">
            <label>Team name<input v-model="teamName" /></label>
            <label>Party ID<input v-model="teamPartyId" inputmode="numeric" /></label>
            <label>User ID<input v-model="teamUserId" inputmode="numeric" /></label>
            <label>Class ID<input v-model="teamClassId" placeholder="Optional" /></label>
            <label>Team ID<input v-model="teamId" inputmode="numeric" /></label>
            <label>Player ID<input v-model="rosterPlayerId" inputmode="numeric" /></label>
          </div>
          <div class="actions">
            <button class="primary" @click="createTeam">POST /team</button>
            <button @click="request(`/team/${teamId}`)">GET /team/:id</button>
            <button @click="request(`/team/${teamId}/players`)">GET roster</button>
            <button @click="request(`/team/${teamId}/players/${rosterPlayerId}`, 'POST')">POST add player</button>
            <button class="danger" @click="request(`/team/${teamId}/players/${rosterPlayerId}`, 'DELETE')">DELETE player</button>
            <button class="danger" @click="request(`/team/${teamId}`, 'DELETE')">DELETE team</button>
          </div>
        </section>
      </div>

      <aside class="response-panel">
        <div class="response-top">
          <div>
            <p class="kicker">Live response</p>
            <h2>Request output</h2>
          </div>
          <span :class="['status', { loading: isLoading }]">{{ responseStatus }}</span>
        </div>
        <p class="request-line">{{ lastRequest || "Run an endpoint to inspect its response." }}</p>
        <pre>{{ responseBody }}</pre>
      </aside>
    </section>
  </main>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap");

:root {
  color: #e9efe8;
  background: #111713;
  font-family: "Space Grotesk", sans-serif;
  font-synthesis: none;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-width: 320px;
  background: #111713;
}
button,
input {
  font: inherit;
}
.shell {
  min-height: 100vh;
  padding: 48px clamp(20px, 5vw, 76px);
  background: radial-gradient(circle at 80% 0%, #243b2b 0, transparent 34%), #111713;
}
.masthead {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: end;
  max-width: 1420px;
  margin: 0 auto 42px;
  border-bottom: 1px solid #405044;
  padding-bottom: 28px;
}
.kicker {
  margin: 0 0 12px;
  color: #c8ee83;
  font:
    500 12px "DM Mono",
    monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
h1,
h2,
p {
  margin-top: 0;
}
h1 {
  margin-bottom: 12px;
  font-size: clamp(38px, 6vw, 76px);
  line-height: 0.95;
  letter-spacing: -0.04em;
}
h2 {
  margin-bottom: 5px;
  font-size: 21px;
}
.lede,
.panel-heading p {
  color: #9da99d;
  margin-bottom: 0;
}
.connection {
  color: #aebaae;
  border: 1px solid #405044;
  padding: 10px 13px;
  font:
    12px "DM Mono",
    monospace;
  white-space: nowrap;
}
.connection code {
  color: #e9efe8;
}
.pulse {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 7px;
  border-radius: 50%;
  background: #c8ee83;
  box-shadow: 0 0 14px #c8ee83;
}
.health {
  margin-left: 14px;
  padding: 5px 7px;
  color: #c8ee83;
}
.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.8fr);
  gap: 22px;
  max-width: 1420px;
  margin: auto;
  align-items: start;
}
.panels {
  display: grid;
  gap: 16px;
}
.panel,
.response-panel {
  border: 1px solid #35453a;
  background: rgba(24, 32, 26, 0.86);
  padding: clamp(20px, 3vw, 30px);
}
.panel-heading {
  display: flex;
  gap: 15px;
  align-items: start;
  margin-bottom: 25px;
}
.number {
  color: #c8ee83;
  font:
    500 13px "DM Mono",
    monospace;
  padding-top: 4px;
}
.panel-heading p {
  font-size: 13px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
  margin-bottom: 21px;
}
label {
  display: grid;
  gap: 7px;
  color: #aebaae;
  font:
    11px "DM Mono",
    monospace;
  text-transform: uppercase;
}
input {
  width: 100%;
  border: 1px solid #48574b;
  border-radius: 0;
  background: #111713;
  color: #f5faf2;
  padding: 11px 10px;
  outline: none;
}
input:focus {
  border-color: #c8ee83;
  box-shadow: 0 0 0 2px rgba(200, 238, 131, 0.12);
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
button {
  border: 1px solid #59685b;
  border-radius: 0;
  background: transparent;
  color: #dce5da;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 12px;
}
button:hover {
  border-color: #c8ee83;
  color: #c8ee83;
}
button.primary {
  background: #c8ee83;
  border-color: #c8ee83;
  color: #172016;
  font-weight: 600;
}
button.primary:hover {
  background: #e1ffae;
  color: #172016;
}
button.danger:hover {
  border-color: #f18b78;
  color: #f18b78;
}
.response-panel {
  position: sticky;
  top: 20px;
  min-height: 390px;
}
.response-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
}
.status {
  border: 1px solid #526155;
  padding: 5px 8px;
  color: #c8ee83;
  font:
    11px "DM Mono",
    monospace;
  white-space: nowrap;
}
.status.loading {
  color: #f4c86b;
  border-color: #f4c86b;
}
.request-line {
  min-height: 18px;
  margin: 22px 0 13px;
  color: #9da99d;
  font:
    12px "DM Mono",
    monospace;
  overflow-wrap: anywhere;
}
pre {
  min-height: 260px;
  margin: 0;
  padding: 16px;
  overflow: auto;
  background: #0d120e;
  color: #d6e8c4;
  font:
    12px/1.65 "DM Mono",
    monospace;
  white-space: pre-wrap;
}
@media (max-width: 960px) {
  .workspace {
    grid-template-columns: 1fr;
  }
  .response-panel {
    position: static;
  }
}
@media (max-width: 620px) {
  .shell {
    padding: 28px 16px;
  }
  .masthead {
    display: block;
    margin-bottom: 25px;
  }
  .connection {
    display: inline-block;
    margin-top: 22px;
  }
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 400px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
