import { describe, expect, it } from 'vitest';

import { createConfigFingerprint, createContentConfig, validateContentConfig } from './index.js';

describe('validateContentConfig', () => {
  it('accepts the placeholder configuration and rejects broken references', () => {
    expect(validateContentConfig(createContentConfig())).toEqual([]);

    const broken = createContentConfig();
    const invalid = {
      ...broken,
      waves: [{ ...broken.waves[0], enemyId: 'missing-enemy' }]
    };

    expect(validateContentConfig(invalid)).toContain('waves[0].enemyId');
  });

  it('reports structural and numeric validation errors across sections', () => {
    const base = createContentConfig();
    const invalid = {
      ...base,
      map: { ...base.map, path: [{ x: 0, y: 0 }] },
      economy: { ...base.economy, startingGold: -1, startingLives: 0 },
      towers: [{ ...base.towers[0], cost: 0, damage: 0, range: 0, cooldownTicks: 0 }],
      enemies: [{ ...base.enemies[0], health: 0, speedPerTick: 0, rewardGold: -1, leakDamage: 0 }],
      waves: [{ ...base.waves[0], count: 0, spawnIntervalTicks: 0 }],
      waveBandScaling: [{ ...base.waveBandScaling[0], waveMin: 3, waveMax: 2, hpMultiplier: 0, countMultiplier: 0 }],
      bonusWave: { ...base.bonusWave, interval: 0 },
      inventory: [{ ...base.inventory[0], count: 0 }]
    };

    expect(validateContentConfig(invalid)).toEqual(
      expect.arrayContaining([
        'map.path',
        'economy',
        `towers.${base.towers[0]!.id}`,
        `enemies.${base.enemies[0]!.id}`,
        'waves[0]',
        'waveBandScaling[0]',
        'bonusWave.interval',
        'inventory[0]'
      ])
    );
  });
});

describe('createConfigFingerprint', () => {
  it('is deterministic and changes when config data changes', () => {
    const config = createContentConfig();
    const fingerprint = createConfigFingerprint(config);
    const changed = {
      ...config,
      economy: { ...config.economy, startingGold: config.economy.startingGold + 1 }
    };

    expect(createConfigFingerprint(config)).toBe(fingerprint);
    expect(createConfigFingerprint(changed)).not.toBe(fingerprint);
  });
});
