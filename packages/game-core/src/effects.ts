import type { ArmorType, DamageElement, HookName } from '@utd/shared-types';

/** Maximum effect chain depth before loop-detection abort (spec: 06-effects/001-effect-system-principles.md). */
export const MAX_EFFECT_DEPTH = 10;

/** Curated hook registry (spec: 06-effects/010-hook-registry.md). */
export const HOOK_NAMES: readonly HookName[] = [
  'BEFORE_TARGETING',
  'ON_TARGET_SELECTED',
  'BEFORE_ATTACK',
  'ON_ATTACK_CREATED',
  'BEFORE_PROJECTILE_IMPACT',
  'ON_PROJECTILE_IMPACT',
  'BEFORE_DAMAGE',
  'ON_DAMAGE_RESOLVED',
  'AFTER_DAMAGE',
  'BEFORE_STATUS_APPLIED',
  'ON_STATUS_APPLIED',
  'BEFORE_KILL',
  'ON_KILL',
  'AFTER_KILL',
  'ON_CRIT',
  'ON_TOWER_DISABLED',
  'ON_WAVE_START',
  'ON_WAVE_END',
] as const;

type ElementMatchup = {
  readonly strong: readonly ArmorType[];
  readonly weak: readonly ArmorType[];
  readonly neutral: readonly ArmorType[];
};

/**
 * Element-vs-armor matchup table.
 * Strong = 1.3x, Neutral = 1.0x, Weak = 0.7x.
 * VOID armor and RESISTANT armor are handled separately in resolveDamageElement.
 * (spec: 06-effects/005-damage-elements-armor.md)
 *
 * Cycle A: FIRE > ICE > NATURE > FIRE
 * Cycle B: LIGHT > DARK > MACHINE > LIGHT
 * VOID element and armor are cross-cycle neutralizers.
 */
export const DAMAGE_MATCHUP: Record<DamageElement, ElementMatchup> = {
  FIRE:    { strong: ['ICE'],     weak: ['NATURE',  'MACHINE'], neutral: ['FIRE',  'LIGHT', 'DARK',  'VOID'] },
  ICE:     { strong: ['NATURE'],  weak: ['FIRE',    'LIGHT'],   neutral: ['ICE',   'DARK',  'MACHINE','VOID'] },
  NATURE:  { strong: ['FIRE'],    weak: ['ICE',     'DARK'],    neutral: ['NATURE','LIGHT', 'MACHINE','VOID'] },
  LIGHT:   { strong: ['DARK'],    weak: ['MACHINE', 'ICE'],     neutral: ['LIGHT', 'FIRE',  'NATURE', 'VOID'] },
  DARK:    { strong: ['MACHINE'], weak: ['LIGHT',   'FIRE'],    neutral: ['DARK',  'ICE',   'NATURE', 'VOID'] },
  MACHINE: { strong: ['LIGHT'],   weak: ['DARK',    'NATURE'],  neutral: ['MACHINE','FIRE', 'ICE',    'VOID'] },
  VOID:    { strong: [],          weak: [],                     neutral: ['FIRE','ICE','NATURE','LIGHT','DARK','MACHINE','VOID'] },
};

/** Fixed-point multipliers for matchup outcomes (FP_ONE = 1000). */
const FP_STRONG = 1300; // 1.3x
const FP_NEUTRAL = 1000; // 1.0x
const FP_WEAK = 700;    // 0.7x

/**
 * Returns the fixed-point damage multiplier for an element attacking a given armor type.
 *
 * Priority order:
 *   1. VOID attacker always deals 1.0x to all armor types.
 *   2. VOID armor takes 1.0x from all elements.
 *   3. RESISTANT armor takes 0.7x from all non-VOID elements.
 *   4. Element vs armor matchup table.
 */
export const resolveDamageElement = (element: DamageElement, armor: ArmorType): number => {
  if (element === 'VOID') return FP_NEUTRAL;
  if (armor === 'VOID') return FP_NEUTRAL;
  if (armor === 'RESISTANT') return FP_WEAK;

  const matchup = DAMAGE_MATCHUP[element];
  if ((matchup.strong as readonly string[]).includes(armor)) return FP_STRONG;
  if ((matchup.weak as readonly string[]).includes(armor)) return FP_WEAK;
  return FP_NEUTRAL;
};
