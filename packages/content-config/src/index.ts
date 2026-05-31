export type GameContentConfig = {
  readonly map: {
    readonly id: string;
    readonly path: readonly { readonly x: number; readonly y: number }[];
  };
  readonly economy: {
    readonly startingGold: number;
    readonly startingLives: number;
    readonly schedulingWindowTicks: number;
  };
  readonly slots: readonly {
    readonly id: string;
    readonly x: number;
    readonly y: number;
  }[];
  readonly towers: readonly {
    readonly id: string;
    readonly nameKey: string;
    readonly element: string;
    readonly cost: number;
    readonly damage: number;
    readonly range: number;
    readonly cooldownTicks: number;
  }[];
  readonly enemies: readonly {
    readonly id: string;
    readonly nameKey: string;
    readonly health: number;
    readonly speedPerTick: number;
    readonly rewardGold: number;
    readonly leakDamage: number;
  }[];
  readonly waves: readonly {
    readonly id: string;
    readonly nameKey: string;
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

export const createContentConfig = (): GameContentConfig => ({
  map: { id: 'map-1', path: [{ x: 0, y: 180 }, { x: 360, y: 180 }] },
  economy: { startingGold: 12, startingLives: 20, schedulingWindowTicks: 5 },
  slots: [{ id: 'slot-1', x: 120, y: 140 }],
  towers: [{ id: 'tower.basic', nameKey: 'tower.basic.name', element: 'arcane', cost: 5, damage: 3, range: 120, cooldownTicks: 2 }],
  enemies: [{ id: 'enemy.basic', nameKey: 'enemy.basic.name', health: 6, speedPerTick: 24, rewardGold: 2, leakDamage: 1 }],
  waves: [{ id: 'wave-1', nameKey: 'wave.basic.name', enemyId: 'enemy.basic', count: 3, spawnIntervalTicks: 4 }],
  inventory: [{ stackId: 'stack-1', towerDefId: 'tower.basic', element: 'arcane', count: 1 }]
});

export const validateContentConfig = (_config: GameContentConfig): string[] => {
  return ['TODO: implement strict config validation'];
};
