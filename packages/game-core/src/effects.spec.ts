import { describe, expect, it } from 'vitest';

import type { ArmorType, DamageElement } from '@utd/shared-types';

import { DAMAGE_MATCHUP, HOOK_NAMES, MAX_EFFECT_DEPTH, resolveDamageElement } from './effects.js';

describe('MAX_EFFECT_DEPTH', () => {
  it('is 10 per spec', () => {
    expect(MAX_EFFECT_DEPTH).toBe(10);
  });
});

describe('HOOK_NAMES', () => {
  it('contains all required hook names', () => {
    const required = [
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
    ];
    for (const name of required) {
      expect(HOOK_NAMES).toContain(name);
    }
  });

  it('has no duplicates', () => {
    expect(new Set(HOOK_NAMES).size).toBe(HOOK_NAMES.length);
  });
});

describe('DAMAGE_MATCHUP', () => {
  it('VOID attacker deals 1.0x to all armor types', () => {
    const armorTypes: ArmorType[] = ['FIRE', 'ICE', 'NATURE', 'LIGHT', 'DARK', 'MACHINE', 'VOID', 'RESISTANT'];
    for (const armor of armorTypes) {
      expect(resolveDamageElement('VOID', armor)).toBe(1000); // 1.0x in FP
    }
  });

  it('RESISTANT armor takes 0.7x from non-VOID elements', () => {
    const elements: DamageElement[] = ['FIRE', 'ICE', 'NATURE', 'LIGHT', 'DARK', 'MACHINE'];
    for (const element of elements) {
      expect(resolveDamageElement(element, 'RESISTANT')).toBe(700); // 0.7x in FP
    }
  });

  it('VOID armor takes 1.0x from all elements', () => {
    const elements: DamageElement[] = ['FIRE', 'ICE', 'NATURE', 'LIGHT', 'DARK', 'MACHINE', 'VOID'];
    for (const element of elements) {
      expect(resolveDamageElement(element, 'VOID')).toBe(1000); // 1.0x in FP
    }
  });

  it('matching element (strong) returns 1.3x in FP', () => {
    // Elements are strong against the next in the wheel
    const { strong } = DAMAGE_MATCHUP['FIRE'];
    expect(strong.length).toBeGreaterThan(0);
    expect(resolveDamageElement('FIRE', strong[0]!)).toBe(1300);
  });

  it('weak matchup returns 0.7x in FP', () => {
    const { weak } = DAMAGE_MATCHUP['FIRE'];
    expect(weak.length).toBeGreaterThan(0);
    expect(resolveDamageElement('FIRE', weak[0]!)).toBe(700);
  });

  it('neutral matchup returns 1.0x in FP', () => {
    // FIRE vs FIRE (same element should be neutral, unless specified)
    const { neutral } = DAMAGE_MATCHUP['FIRE'];
    if (neutral.length > 0) {
      expect(resolveDamageElement('FIRE', neutral[0]!)).toBe(1000);
    }
  });
});
