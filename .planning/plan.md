## Plan: Fantasy Football RPG MVP

Build a desktop-first standard-redraft web app on the existing Bun/Hono workspace. Add a SQLite-backed league and scoring system, integrate Sleeper data through an isolated provider adapter, and make the four public manager classes a deterministic layer over ordinary fantasy scoring.

### Product Rules

- A manager selects Knight, Wizard, Cleric, or Rogue when joining a league and retains it for the season. Classes are public and duplicates are allowed.
- Each class exposes two once-per-matchup abilities. Managers may select and use both after Wednesday lineup lock until the Thursday Night Football deadline; selected abilities remain hidden until that deadline.
- The resolver uses deterministic phases: defense first, theft second, then scoring. Persist every submitted action and generated resolution record for an auditable matchup history.
- Initial balance targets:
  - Knight: Fortify blocks all incoming harmful effects; Charge boosts a selected starting RB or TE by 10%.
  - Wizard: Hex reduces a selected opponent position group by 10%; Arcane Surge boosts a selected own position group by 10%.
  - Cleric: Healing adds 5 total team points; Sanctuary protects one selected position group from opponent penalties.
  - Rogue: Pickpocket transfers 50% of an active opponent score boost; Evasion cancels one incoming harmful effect.
- Treat the individual score-affecting effects as mutually composable only through the resolver's declared priority. Never mutate provider raw stats; store base score, applied effects, and final score separately.
- The Wednesday lineup lock is enforced server-side. At final matchup calculation, an officially inactive locked starter is replaced by the highest-projected bench player at the exact same position. No flex substitution is included in v1.
- Commissioners create/invite/configure leagues but do not get manual in-season overrides in v1. Valid configurations are 8-14 teams, 13-15 regular-season weeks, and 4 or 6 playoff teams.

### Steps

1. **Establish the app and persistence foundation.** Add a desktop-first web workspace package and extend the root Bun workspace configuration. Add SQLite initialization, migrations, repository interfaces, and environment configuration to the Hono API. Use a migration-backed schema for users, sessions, leagues, memberships/teams, league settings, NFL players, roster slots, drafts/picks, matchups, submitted abilities, score snapshots, and resolution/audit events. This blocks all later persistence work.
2. **Define the shared domain contract.** Expand the shared types around the current League, Team, Player, Schedule, and Settings models. Add `FantasyClass`, ability identifiers and target types, lineup/roster state, league lifecycle state, draft state, matchup state, score breakdowns, source-data snapshots, and typed API request/response contracts. Keep the existing NFL `Position` separate from a manager's `FantasyClass`.
3. **Build provider isolation and validate Sleeper data.** Create a Sleeper client behind a provider interface for NFL state, players, schedules, stats, roster data, injury/inactive status, and projections. Begin with a capability test and cached fixtures that verifies which required fields Sleeper currently offers, especially projections and official inactives. Use provider-neutral persistence so a supplemental projection/status provider can be introduced without changing matchup logic if Sleeper lacks an essential field.
4. **Implement identity, league setup, and membership.** Add account registration, login/session handling, league creation, bounded league configuration, invitation creation/acceptance, manager team naming, and season-long public class selection. Enforce league capacity and accept class duplicates. Expose Hono routes that return only the current manager's private state while the weekly choice remains sealed.
5. **Implement roster and live snake draft workflows.** Add draft order generation, serpentine pick validation, turn/deadline state, player availability, roster composition validation, and real-time client updates. Persist each pick as an immutable event and create team roster entries. Provide roster management and a weekly lineup editor that validates eligible starters before the Wednesday lock.
6. **Implement weekly scheduling, locks, and abilities.** Generate head-to-head regular-season schedules and playoff seeding from the selected league parameters. Run server-side deadline jobs for lineup locking, the ability window, sealing/revealing choices, and finalization. Add ability-target validation: Charge only targets a starting RB/TE; position effects target valid opposing/own starting groups; healing has no target; protective abilities are recorded against the protected action or position.
7. **Implement the deterministic scoring resolver.** In a pure shared/domain service, ingest immutable base player scores, calculate team positional subtotals, apply defensive blocks, resolve Pickpocket against surviving score boosts, and then apply boosts/penalties/healing. Return a score breakdown with each action's accepted, blocked, stolen, or canceled status. Store the result and make finalization idempotent.
8. **Implement the post-lock inactive replacement rule.** At finalization, inspect locked starters against the verified inactive status snapshot. For each eligible starter, select the highest-projected bench player at the exact same position, persist the automatic substitution and its projection/status evidence, then score the amended lineup. Do not replace players merely because they produced zero points.
9. **Build desktop web workflows.** Implement authenticated pages for league discovery/creation, invitation acceptance/class selection, live draft, roster and Wednesday lineup lock, Thursday sealed ability choices, matchup scoreboards, revealed ability outcomes, standings, schedules, and immutable weekly scoring details. Make deadline time zones and current league state obvious, and use server-authoritative data for every mutation.
10. **Test and operationalize the release.** Add unit tests for class target validation and resolver precedence, integration tests for deadlines/draft/roster transitions, and API tests for authorization and secrecy of un-revealed abilities. Seed a complete test league with provider fixtures. Add structured logging, job retry/idempotency protections, and API error handling before deployment.

### Relevant Files

- `c:/Users/User/Documents/Code Projects/fantasy-football-app/package.json` - Extend workspaces and root scripts for API, shared types, web client, migrations, and tests.
- `c:/Users/User/Documents/Code Projects/fantasy-football-app/packages/api/package.json` - Add SQLite, migration, auth, scheduling, and test dependencies.
- `c:/Users/User/Documents/Code Projects/fantasy-football-app/packages/api/src/index.ts` - Compose database lifecycle, routes, deadline jobs, and error handling.
- `c:/Users/User/Documents/Code Projects/fantasy-football-app/packages/api/src/routes/userController.ts` - Replace the placeholder pattern with authenticated user/session behavior; use it as a route-structure reference for league, draft, roster, matchup, and ability controllers.
- `c:/Users/User/Documents/Code Projects/fantasy-football-app/packages/shared/types/League/index.ts` - Re-export the expanded league lifecycle, schedule, settings, matchup, and fantasy-class contracts.
- `c:/Users/User/Documents/Code Projects/fantasy-football-app/packages/shared/types/League/league.ts` - Extend the minimal League model with configuration, season state, deadlines, and ownership.
- `c:/Users/User/Documents/Code Projects/fantasy-football-app/packages/shared/types/League/schedule.ts` - Extend weekly pairings into persisted matchup state and playoff scheduling.
- `c:/Users/User/Documents/Code Projects/fantasy-football-app/packages/shared/types/League/settings.ts` - Add bounded team/week/playoff and deadline configuration while preserving roster-position settings.
- `c:/Users/User/Documents/Code Projects/fantasy-football-app/packages/shared/types/Team/team.ts` - Add manager class, roster, lineup, and score state without conflating it with NFL player positions.
- `c:/Users/User/Documents/Code Projects/fantasy-football-app/packages/shared/types/Player/player.ts` - Add provider identity and score/projection snapshots while retaining the existing `Position` relationship.
- `c:/Users/User/Documents/Code Projects/fantasy-football-app/packages/shared/types/index.ts` - Provide the API and web app a single public shared-contract entry point.
- `c:/Users/User/Documents/Code Projects/fantasy-football-app/packages/web/` - New desktop-first client workspace for the league, draft, roster, ability, and matchup views.

### Verification

1. Run the provider capability test against Sleeper and recorded fixtures; verify the exact player identifiers, NFL state, schedules, weekly stats, injury/inactive status, and projection data needed by the feature. Document any unavailable fields before enabling automatic replacement in production.
2. Run migration tests against an empty SQLite database and verify foreign keys, unique draft picks, sealed ability privacy, and idempotent resolution records.
3. Unit-test every class interaction: Fortify and Evasion block valid harmful effects, Sanctuary blocks penalties only for its selected position, Pickpocket transfers only an unblocked surviving score boost, and score modifiers are applied exactly once.
4. Simulate a full league through snake draft, roster construction, Wednesday lock, hidden Thursday submissions, reveal, weekly finalization, standings update, and playoff seeding.
5. Simulate official inactive and non-inactive zero-score starters; verify only the former receives an exact-position, highest-projection bench substitution at finalization.
6. Exercise desktop workflows in two authenticated browser sessions to verify invitation flows, draft concurrency, private ability selection, public reveal, and live score refresh.

### Scope Boundaries

- Included: standard redraft, live snake draft, roster/lineup management, configurable bounded league formats, Sleeper integration, automated weekly resolution, four starter classes, live results, and a desktop-first web app.
- Excluded from v1: mobile-native app, lineup-altering abilities, auctions, trades/waivers, commissioner overrides, arbitrary league structures, additional classes/progression, duplicate-player replacement across positions, and manual statistical corrections.

### Dependencies and Risks

- The client and database foundation can begin in parallel after the shared contract is established. Provider validation must finish before finalizing auto-substitution implementation. League/draft/roster work blocks weekly ability and scoring workflows; the pure resolver can be developed in parallel with the web UI using fixtures.
- Sleeper API availability and data completeness are the material product risk. The provider adapter and raw snapshots protect the core rules engine from changing source data and make a later supplemental provider tractable.
- Authentication is intentionally specified as API-managed sessions backed by server-side SQLite, matching the selected Hono plus SQLite architecture; select a password hashing/session library during implementation rather than inventing cryptography.

### Working Scope

- Planning only; no production edits are made during this session.
