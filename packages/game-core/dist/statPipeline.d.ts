import type { ModifierOp } from '@utd/shared-types';
/**
 * Minimal modifier entry for stat resolution.
 * Only op and value are required; full ModifierInstance data lives in ECS components.
 */
export type StatModifier = {
    readonly op: ModifierOp;
    /** Fixed-point value relative to FP_ONE = 1000. */
    readonly value: number;
};
/**
 * Resolves a base fixed-point stat value through a list of modifiers.
 *
 * Stage order per spec 05-modifiers/001-stat-pipeline.md:
 *   1. base value
 *   2. flat additive modifiers (FLAT_ADD)
 *   3. percent additive modifiers (PERCENT_ADD) – percent of base+flat
 *   4. multiplicative modifiers (MULTIPLY) – applied sequentially
 *   5. caps/floors (MIN_CAP, MAX_CAP)
 *   6. final overrides (OVERRIDE)
 *
 * All values are fixed-point (FP_ONE = 1000).
 */
export declare const resolveStats: (base: number, modifiers: readonly StatModifier[]) => number;
//# sourceMappingURL=statPipeline.d.ts.map