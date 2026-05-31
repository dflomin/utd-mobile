import type { LocalizationKey } from '@utd/localization';
export type MapConfig = {
    readonly id: string;
    readonly path: readonly {
        readonly x: number;
        readonly y: number;
    }[];
};
export type GameContentConfig = {
    readonly map: MapConfig;
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
export declare const createContentConfig: () => GameContentConfig;
export declare const createConfigFingerprint: (config: GameContentConfig) => string;
export declare const validateContentConfig: (config: GameContentConfig) => string[];
//# sourceMappingURL=index.d.ts.map