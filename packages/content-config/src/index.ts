import type { LocalizationKey } from '@utd/localization';

export type MapConfig = {
  readonly id: string;
  readonly path: readonly { readonly x: number; readonly y: number }[];
};

export type GameContentConfig = {
  readonly map: MapConfig;
  readonly economy: {
    readonly startingGold: number;
    readonly startingLives: number;
    readonly schedulingWindowTicks: number;
  };
  readonly slots: readonly { readonly id: string; readonly x: number; readonly y: number }[];
  readonly towers: readonly {
    readonly id: string;
    readonly nameKey: LocalizationKey;
    readonly element: string;
    readonly cost: number;
    readonly damage: number;
    readonly range: number;
    readonly cooldownTicks: number;
  }[];
  readonly enemies: readonly {
    readonly id: string;
    readonly nameKey: LocalizationKey;
    readonly health: number;
    readonly speedPerTick: number;
    readonly rewardGold: number;
    readonly leakDamage: number;
  }[];
  readonly waves: readonly {
    readonly id: string;
    readonly nameKey: LocalizationKey;
    readonly enemyId: string;
    readonly count: number;
    readonly spawnIntervalTicks: number;
  }[];
  readonly inventory: readonly {
    readonly stackId: string;
    readonly towerDefId: string;
    readonly element: string;
    readonly count: number;
  }[];
};

const hashText = (text: string): string => {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const createContentConfig = (): GameContentConfig => ({
  map: { id: 'map-1', path: [{ x: 0, y: 180 }, { x: 360, y: 180 }] },
  economy: { startingGold: 12, startingLives: 20, schedulingWindowTicks: 5 },
  slots: [{ id: 'slot-1', x: 120, y: 140 }],
  towers: [{ id: 'tower.basic', nameKey: 'tower.basic.name', element: 'arcane', cost: 5, damage: 3, range: 120, cooldownTicks: 2 }],
  enemies: [{ id: 'enemy.basic', nameKey: 'enemy.basic.name', health: 6, speedPerTick: 24, rewardGold: 2, leakDamage: 1 }],
  waves: [{ id: 'wave-1', nameKey: 'wave.basic.name', enemyId: 'enemy.basic', count: 3, spawnIntervalTicks: 4 }],
  inventory: [{ stackId: 'stack-1', towerDefId: 'tower.basic', element: 'arcane', count: 1 }]
});

export const createConfigFingerprint = (config: GameContentConfig): string => {
  return hashText(JSON.stringify(config));
};

export const validateContentConfig = (config: GameContentConfig): string[] => {
  const errors: string[] = [];
  const towerIds = new Set(config.towers.map((tower) => tower.id));
  const enemyIds = new Set(config.enemies.map((enemy) => enemy.id));

  if (config.map.path.length < 2) {
    errors.push('map.path');
  }
  if (config.economy.startingGold < 0 || config.economy.startingLives <= 0) {
    errors.push('economy');
  }
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
    if (!enemyIds.has(wave.enemyId)) {
      errors.push(`waves[${index}].enemyId`);
    }
    if (wave.count <= 0 || wave.spawnIntervalTicks <= 0) {
      errors.push(`waves[${index}]`);
    }
  });
  config.inventory.forEach((stack, index) => {
    if (!towerIds.has(stack.towerDefId) || stack.count <= 0) {
      errors.push(`inventory[${index}]`);
    }
  });
  return errors;
};
