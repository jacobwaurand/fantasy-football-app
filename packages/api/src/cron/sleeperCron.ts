
function startCron() {
    Bun.cron('* * * * *', () => {
        console.log('Running cron job every minute');
    });
}

export { startCron }