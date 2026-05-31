const hashText = (text) => {
    let hash = 2166136261;
    for (const character of text) {
        hash ^= character.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
};
export const createContentConfig = () => ({
    map: { id: 'map-1', path: [{ x: 0, y: 180 }, { x: 360, y: 180 }] },
    economy: { startingGold: 12, startingLives: 20, schedulingWindowTicks: 5 },
    slots: [{ id: 'slot-1', x: 120, y: 140 }],
    towers: [{ id: 'tower.basic', nameKey: 'tower.basic.name', element: 'arcane', cost: 5, damage: 3, range: 120, cooldownTicks: 2 }],
    enemies: [{ id: 'enemy.basic', nameKey: 'enemy.basic.name', health: 6, speedPerTick: 24, rewardGold: 2, leakDamage: 1 }],
    waves: [{ id: 'wave-1', nameKey: 'wave.basic.name', enemyId: 'enemy.basic', count: 3, spawnIntervalTicks: 4 }],
    waveBandScaling: [
        { waveMin: 1, waveMax: 10, hpMultiplier: 1000, countMultiplier: 1000, goldMultiplier: 1000, speedMultiplier: 1000 },
        { waveMin: 11, waveMax: 20, hpMultiplier: 1200, countMultiplier: 1100, goldMultiplier: 1100, speedMultiplier: 1050 },
    ],
    bonusWave: { interval: 10, hpMultiplier: 3000, goldMultiplier: 2000, countGroup: 10, leakDamagesLives: false },
    inventory: [{ stackId: 'stack-1', towerDefId: 'tower.basic', element: 'arcane', count: 1 }],
    effectDefs: [
        { effectDefId: 'effect.basic_attack', effectType: 'DIRECT_DAMAGE', value: 3000, element: 'VOID' },
    ],
    modifierDefs: [
        { modifierDefId: 'mod.placeholder_flat', statId: 'DAMAGE', op: 'FLAT_ADD', value: 0, sourceType: 'placeholder', sourceId: 'placeholder', target: 'SELF' },
    ],
});
export const createConfigFingerprint = (config) => {
    return hashText(JSON.stringify(config));
};
export const validateContentConfig = (config) => {
    const errors = [];
    const towerIds = new Set(config.towers.map((tower) => tower.id));
    const enemyIds = new Set(config.enemies.map((enemy) => enemy.id));
    const effectDefIds = new Set(config.effectDefs.map((e) => e.effectDefId));
    if (config.map.path.length < 2)
        errors.push('map.path');
    if (config.economy.startingGold < 0 || config.economy.startingLives <= 0)
        errors.push('economy');
    for (const tower of config.towers) {
        if (tower.cost <= 0 || tower.damage <= 0 || tower.range <= 0 || tower.cooldownTicks <= 0) {
            errors.push(`towers.${tower.id}`);
        }
    }
    for (const enemy of config.enemies) {
        if (enemy.health <= 0 || enemy.speedPerTick <= 0 || enemy.rewardGold < 0 || enemy.leakDamage <= 0) {
            errors.push(`enemies.${enemy.id}`);
        }
    }
    config.waves.forEach((wave, index) => {
        if (!enemyIds.has(wave.enemyId))
            errors.push(`waves[${index}].enemyId`);
        if (wave.count <= 0 || wave.spawnIntervalTicks <= 0)
            errors.push(`waves[${index}]`);
    });
    config.waveBandScaling.forEach((band, index) => {
        if (band.waveMin > band.waveMax || band.hpMultiplier <= 0 || band.countMultiplier <= 0) {
            errors.push(`waveBandScaling[${index}]`);
        }
    });
    if (config.bonusWave.interval <= 0)
        errors.push('bonusWave.interval');
    config.inventory.forEach((stack, index) => {
        if (!towerIds.has(stack.towerDefId) || stack.count <= 0)
            errors.push(`inventory[${index}]`);
    });
    config.effectDefs.forEach((effect, index) => {
        if (!effect.effectDefId || !effect.effectType)
            errors.push(`effectDefs[${index}]`);
    });
    config.modifierDefs.forEach((mod, index) => {
        if (!mod.modifierDefId || !mod.statId)
            errors.push(`modifierDefs[${index}]`);
    });
    void effectDefIds;
    return errors;
};
//# sourceMappingURL=index.js.map