export const summarizeTelemetry = (options) => {
    const damageByTower = {};
    let kills = 0;
    let leaks = 0;
    for (const event of options.events) {
        if (event.type === 'damage') {
            damageByTower[event.sourceId] = (damageByTower[event.sourceId] ?? 0) + event.amount;
        }
        if (event.type === 'kill') {
            kills += 1;
        }
        if (event.type === 'leak') {
            leaks += 1;
        }
    }
    return {
        waveReached: options.waveReached,
        kills,
        leaks,
        gold: options.gold,
        lives: options.lives,
        damageByTower,
        commandLogReference: options.commandLogReference,
        configFingerprint: options.configFingerprint,
        stateHash: options.stateHash
    };
};
//# sourceMappingURL=index.js.map