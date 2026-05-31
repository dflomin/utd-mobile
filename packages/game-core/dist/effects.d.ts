import type { ArmorType, DamageElement, HookName } from '@utd/shared-types';
/** Maximum effect chain depth before loop-detection abort (spec: 06-effects/001-effect-system-principles.md). */
export declare const MAX_EFFECT_DEPTH = 10;
/** Curated hook registry (spec: 06-effects/010-hook-registry.md). */
export declare const HOOK_NAMES: readonly HookName[];
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
export declare const DAMAGE_MATCHUP: Record<DamageElement, ElementMatchup>;
/**
 * Returns the fixed-point damage multiplier for an element attacking a given armor type.
 *
 * Priority order:
 *   1. VOID attacker always deals 1.0x to all armor types.
 *   2. VOID armor takes 1.0x from all elements.
 *   3. RESISTANT armor takes 0.7x from all non-VOID elements.
 *   4. Element vs armor matchup table.
 */
export declare const resolveDamageElement: (element: DamageElement, armor: ArmorType) => number;
export {};
//# sourceMappingURL=effects.d.ts.map