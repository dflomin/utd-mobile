/**
 * Canonical list of core ECS system names in deterministic execution order.
 * Order must not change between ticks, replays, or registrations.
 * Per spec 04-ecs/010-core-systems.md.
 */
export const SYSTEM_ORDER = [
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
//# sourceMappingURL=systems.js.map