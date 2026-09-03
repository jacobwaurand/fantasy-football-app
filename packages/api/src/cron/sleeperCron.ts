import { getNflPlayers, getWeeklyStats } from "../sleeper/sleeperApi";
import { insertPlayers } from "../database/playerRepository";
import type { Player } from "@fantasy/shared";

function startCron() {
  dailyCron();
  // weeklyCron()
}

function dailyCron() {
  Bun.cron("*/1 * * * *", async () => {
    const players = await getNflPlayers();
    const res = await insertPlayers(players);
    console.log(`Inserted ${res.inserted} players`);
  });
}

// function weeklyCron() {
//     Bun.cron('0 0 * * 0', async () => {
//         const weeklyStats = await getWeeklyStats(new Date().getFullYear(), getCurrentWeek());
//         const res = await insertWeeklyStatsIntoDatabase(weeklyStats);
//     });
// }

export { startCron };
