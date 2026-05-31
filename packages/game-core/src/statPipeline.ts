import type { ModifierOp } from '@utd/shared-types';

import { fpAdd, fpMul, FP_ONE } from './fixedPoint.js';


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
export const resolveStats = (base: number, modifiers: readonly StatModifier[]): number => {
  // Stage 2: flat additive
  let flatSum = 0;
  for (const mod of modifiers) {
    if (mod.op === 'FLAT_ADD') flatSum = fpAdd(flatSum, mod.value);
  }
  let value = fpAdd(base, flatSum);

  // Stage 3: percent additive (stacked sum of percents, then applied once)
  let percentSum = 0;
  for (const mod of modifiers) {
    if (mod.op === 'PERCENT_ADD') percentSum = fpAdd(percentSum, mod.value);
  }
  if (percentSum !== 0) {
    // percentSum is a fixed-point number where intToFp(50) = 50% increase.
    // bonus = value * (percentSum / FP_ONE) / 100
    //       = value * percentSum / (100 * FP_ONE)
    const bonus = Math.round((value * percentSum) / (100 * FP_ONE));
    value = fpAdd(value, bonus);
  }

  // Stage 4: multiplicative
  for (const mod of modifiers) {
    if (mod.op === 'MULTIPLY') {
      value = fpMul(value, mod.value);
    }
  }

  // Stage 5: caps
  let hasMinCap = false;
  let minCap = 0;
  let hasMaxCap = false;
  let maxCap = 0;
  for (const mod of modifiers) {
    if (mod.op === 'MIN_CAP') {
      if (!hasMinCap || mod.value > minCap) { minCap = mod.value; hasMinCap = true; }
    }
    if (mod.op === 'MAX_CAP') {
      if (!hasMaxCap || mod.value < maxCap) { maxCap = mod.value; hasMaxCap = true; }
    }
  }
  if (hasMinCap && value < minCap) value = minCap;
  if (hasMaxCap && value > maxCap) value = maxCap;

  // Stage 6: override (last one wins)
  for (const mod of modifiers) {
    if (mod.op === 'OVERRIDE') value = mod.value;
  }

  return value;
};
