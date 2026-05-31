import { describe, expect, it } from 'vitest';

import { SYSTEM_ORDER, type SystemName } from './systems.js';

describe('SYSTEM_ORDER', () => {
  it('contains all required core systems', () => {
    const required: SystemName[] = [
      'CommandApply',
      'WaveSpawn',
      'PathMovement',
      'SpatialIndex',
      'AuraMembership',
      'ModifierResolution',
      'Targeting',
      'TowerAttack',
      'AbilityAutocast',
      'Projectile',
      'Trap',
      'AreaEffect',
      'RuntimeStatus',
      'DamageResolution',
      'DeathAndLeak',
      'RewardDrop',
      'Economy',
      'TowerXp',
      'CooldownMana',
      'Telemetry',
      'Cleanup',
      'CheckpointSerialization',
    ];
    for (const name of required) {
      expect(SYSTEM_ORDER).toContain(name);
    }
  });

  it('has no duplicates', () => {
    const unique = new Set(SYSTEM_ORDER);
    expect(unique.size).toBe(SYSTEM_ORDER.length);
  });

  it('CommandApply is first', () => {
    expect(SYSTEM_ORDER[0]).toBe('CommandApply');
  });

  it('CheckpointSerialization is last', () => {
    expect(SYSTEM_ORDER[SYSTEM_ORDER.length - 1]).toBe('CheckpointSerialization');
  });

  it('Cleanup comes before CheckpointSerialization', () => {
    const cleanupIdx = SYSTEM_ORDER.indexOf('Cleanup');
    const checkpointIdx = SYSTEM_ORDER.indexOf('CheckpointSerialization');
    expect(cleanupIdx).toBeLessThan(checkpointIdx);
  });

  it('ModifierResolution precedes Targeting and TowerAttack', () => {
    const modIdx = SYSTEM_ORDER.indexOf('ModifierResolution');
    const tgtIdx = SYSTEM_ORDER.indexOf('Targeting');
    const atkIdx = SYSTEM_ORDER.indexOf('TowerAttack');
    expect(modIdx).toBeLessThan(tgtIdx);
    expect(modIdx).toBeLessThan(atkIdx);
  });

  it('DeathAndLeak follows DamageResolution', () => {
    const dmgIdx = SYSTEM_ORDER.indexOf('DamageResolution');
    const deathIdx = SYSTEM_ORDER.indexOf('DeathAndLeak');
    expect(dmgIdx).toBeLessThan(deathIdx);
  });
});
