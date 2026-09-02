## Plan: Fantasy Football RPG — Co-op Boss Mode (Campaign)

Build a 4-player cooperative PVE campaign mode on the existing Bun/Hono workspace. Each player drafts a roster, then week by week the party fights a scaling boss with stat-based challenges. Beating bosses awards XP that levels classes and unlocks abilities. The mode is a deterministic layer over ordinary fantasy scoring, driven by Sleeper data.

### Big Picture

- **Mode:** PVE co-op boss mode for v1. PVP head-to-head is a later mode (keep `matchups`/`leagues` tables around, unused).
- **Party:** 4 players, each with an individual roster. Scores are **pooled** for combined boss challenges, but bosses can also demand **individual** contributions from each team.
- **Loop:** Create/join campaign → D20 initiative roll → snake draft → each NFL week fight one boss from a preset 17-boss chain → win advances, lose refights next week → weekly pickups → XP/leveling.

### Confirmed Rules

- **Rosters:** 9 starters, no bench: QB, RB, RB, WR, WR, TE, FLEX, DEF, K.
- **Scoring:** Standard PPR defaults for now, architected as a configurable scoring table so the owners can refine (custom scoring table to be supplied and encoded) later.
- **Draft:** Live snake draft seeded by a server-side D20 initiative roll (tie-breaker rule required).
- **Weekly pickups:** Up to 2 replacements per member per week from a shared pool. A player can exist on only one roster. Injured players flagged via Sleeper `status`.
- **Bosses:** Preset chain of 17 bosses (NFL-aligned), escalating difficulty. Challenges are mixed scope: pooled (e.g., 400 total pts, 8 TDs), individual (e.g., each team scores 2 TDs), and fun real-stat categories (e.g., longest TD across the party, best single-player score) — all computable from Sleeper weekly stat fields.
- **Refights:** Boss number is campaign state (`currentBossIndex`), tied to real NFL weeks for stats. One boss fight per real week. Win → advance to the next boss next week. Loss → refight the same boss next week. Falling behind the chain is permanent.
- **Classes:** Knight, Wizard, Cleric, Rogue retained. Simple level tiers; XP awarded on boss wins, harder bosses award more. Levels gate ability/passive unlocks so players scale with the bosses.
- **Locks:** Per-player game-time locks (a player locks when their real game kicks off). Server-enforced.
- **Auth:** Simple shared league — invite code + display name, no passwords. Lightweight member token issued on join so actions map to a member slot.
- **Stack:** All Bun — `bun:sqlite`, Hono router, Bun cron, workspace-shared types, Vue frontend.

### Work Plan

#### Phase 0 — Foundation cleanup
- Fix broken import `packages/shared/types/Team/team.ts:1` (`../Class/class` → the `Classes` folder).
- Build out the stubbed `weekly_player_stats` table + `insertWeeklyPlayerStats()` in `packages/api/src/database/playerRepository.ts:42` (currently prepares but never executes; table/columns don't exist in `init.ts`).
- Add a `scores`/`scoring_config` seam so points are computed from raw Sleeper stat fields (pass/rush/rec/td/int/etc.) — PPR defaults first, refineable to a custom table later.

#### Phase 1 — Shared domain contract (`packages/shared`)
Add types: `Campaign`, `CampaignMember` (class, level, xp), `Boss`, `BossChallenge` (stat, scope `pooled|individual`, target), `RosterSlot`, `DraftPick`, `CampaignWeek`, `AbilitySubmission`, `BossFightResult`, `XpProgression`. Retune `AbilityTarget` (`Classes/ability.ts`) so abilities can target boss challenges rather than opponent teams.

#### Phase 2 — Campaign create/join + classes
- API routes: `create-campaign` (invite code), `join-campaign` (code + display name + class), `get-campaign`.
- DB tables: `campaigns`, `campaign_members` (slot, class, level, xp).
- Simple XP config: thresholds + ability unlock table (e.g., ability 1 at lvl 2, passive at lvl 3, ability 2 at lvl 4).

#### Phase 3 — Draft
- Server-side D20 initiative roll per member; tie-breaker rule.
- Snake order generation; per-pick validation (unavailable player, roster-position validity).
- `draft_picks` immutable event log; `campaign_rosters` with fixed 9 slots.
- Turn-based with live sync (Pinia store + polling or SSE) — decide during implementation.

#### Phase 4 — Weekly stats, scoring, and boss resolution engine
- Enable weekly Sleeper stats cron (currently commented in `sleeperCron.ts`); nightly player-status refresh.
- Pure **resolver service**: raw stats → scoring config → per-player score → team totals → per-challenge pass/fail (pooled + individual) → per-player game-time lock enforcement → boss outcome.
- DB tables: `campaign_weeks`, `bosses`, `boss_challenges`, `boss_fight_results` (immutable, audit-friendly resolution records).
- Advance/refight: `currentBossIndex` increments only on a win; one fight per real week.

#### Phase 5 — XP/leveling gating
- XP on wins scaled by boss number; small/partial XP on loss (simple tiers). Unlocks apply to the next fight for determinism.

#### Phase 6 — Weekly pickups
- Shared pool = all Sleeper players not currently on any roster.
- Max 2 swaps per member per week; per-player game-time lock prevents dropping a locked player; injured players auto-flagged via `players.status`.
- `campaign_rosters` supports `dropped_at`/`added_at` for audit.

#### Phase 7 — Frontend (Vue, `packages/frontend`)
Pages: create/join campaign, class select, initiative roll + live draft board, roster/lock lineup, **boss dashboard** (challenges + this week's live scores per challenge), level/XP screen, results & history (refight banner). Replace scaffolded `App.vue`, empty `router/index.ts`, `counter.ts`.

#### Phase 8 — Tests & ops
- Unit tests for challenge evaluation (pooled vs individual), class target validation, XP math, scoring config.
- Scenario test: simulate a full campaign through draft → week-by-week boss fights → losses/refights → pickups → level ups.
- Structured logging, idempotent resolution, graceful cron failure handling.

### PVE Ability Tuning (Draft Direction)

The existing 8 abilities (Hex reduces an *opponent* position group, Pickpocket transfers *opponent* score boosts, etc.) are PVP-designed. For PVE they must be reinterpreted against the boss's challenge targets rather than an opposing team — e.g., Wizard's Hex reduces a challenge target's difficulty for the party, Rogue's Pickpocket converts a boss debuff into party points. Exact re-tunes a decision to finalize during implementation.

### Open Items / Risks

- **Sleeper data completeness** for fun categories (longest TD, DEF sacks, etc.) — verify which raw fields Sleeper exposes before locking boss challenge types (provider capability test).
- **PVE ability re-tuning** for all 4 classes.
- Long-term flagged: roguelike endless mode (v2), PVP mode (later).

### Dependencies and Risks

- Foundation (Phase 0-2) blocks draft and weekly work.
- Draft/roster work blocks the weekly boss + scoring loop; the pure resolver can be developed in parallel with the web UI using fixtures.
- Sleeper API availability and raw-stat completeness are the material product risk; provider-neutral persistence keeps the rules engine isolated from source changes.