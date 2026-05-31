import type { LocalizationKey } from '@utd/localization';
import type { EffectDef, ModifierDef } from '@utd/shared-types';
export type MapConfig = {
    readonly id: string;
    readonly path: readonly {
        readonly x: number;
        readonly y: number;
    }[];
};
/** Per-wave-band scaling for enemy HP, count, gold, and speed (fixed-point FP_ONE=1000). */
export type WaveBandScaling = {
    readonly waveMin: number;
    readonly waveMax: number;
    readonly hpMultiplier: number;
    readonly countMultiplier: number;
    readonly goldMultiplier: number;
    readonly speedMultiplier: number;
};
/** Rules for bonus waves that appear every N regular waves. */
export type BonusWaveConfig = {
    readonly interval: number;
    readonly hpMultiplier: number;
    readonly goldMultiplier: number;
    readonly countGroup: number;
    readonly leakDamagesLives: boolean;
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
        readonly isBonusWave?: boolean;
    }[];
    readonly waveBandScaling: readonly WaveBandScaling[];
    readonly bonusWave: BonusWaveConfig;
    readonly inventory: readonly {
        readonly stackId: string;
        readonly towerDefId: string;
        readonly element: string;
        readonly count: number;
    }[];
    readonly effectDefs: readonly EffectDef[];
    readonly modifierDefs: readonly ModifierDef[];
};
export declare const createContentConfig: () => GameContentConfig;
export declare const createConfigFingerprint: (config: GameContentConfig) => string;
export declare const validateContentConfig: (config: GameContentConfig) => string[];
//# sourceMappingURL=index.d.ts.map