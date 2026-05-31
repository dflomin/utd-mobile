import { runScriptedSimulation } from '@utd/game-core';
const createRunRecord = (runIndex, seed, summary) => ({
    runIndex,
    seed,
    summary,
    perWaveLeakage: [{ wave: 1, leaks: summary.leaks }],
    perStageEconomy: [{ wave: summary.waveReached, gold: summary.gold, lives: summary.lives }],
    buildSnapshot: {
        hero: null,
        elements: [],
        towers: Object.keys(summary.damageByTower),
        items: [],
        potions: [],
        stats: {
            kills: summary.kills,
            leaks: summary.leaks,
            gold: summary.gold,
            lives: summary.lives
        },
        waveReached: summary.waveReached,
        reportData: summary
    }
});
export const runSimulation = (options) => {
    return runScriptedSimulation(options);
};
export const exportRunHistory = (history) => {
    return JSON.stringify(history, null, 2);
};
export const runSimulationBatch = (options) => {
    if (options.runs <= 0) {
        throw new Error('runs must be greater than zero');
    }
    const seedStep = options.seedStep ?? 1;
    const scenario = options.scenario ?? {};
    const runRecords = [];
    for (let index = 0; index < options.runs; index += 1) {
        const seed = options.seed + (index * seedStep);
        const summary = runSimulation({ ...options, seed });
        runRecords.push(createRunRecord(index, seed, summary));
    }
    const averageWaveReached = runRecords.reduce((sum, run) => sum + run.summary.waveReached, 0) / runRecords.length;
    const averageKills = runRecords.reduce((sum, run) => sum + run.summary.kills, 0) / runRecords.length;
    const averageLeaks = runRecords.reduce((sum, run) => sum + run.summary.leaks, 0) / runRecords.length;
    const averageGold = runRecords.reduce((sum, run) => sum + run.summary.gold, 0) / runRecords.length;
    return {
        runs: runRecords,
        averageWaveReached,
        averageKills,
        averageLeaks,
        averageGold,
        exportDump: exportRunHistory({ scenario, runs: runRecords })
    };
};
//# sourceMappingURL=runSimulation.js.map