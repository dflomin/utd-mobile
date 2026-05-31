/**
 * Canonical list of core ECS system names in deterministic execution order.
 * Order must not change between ticks, replays, or registrations.
 * Per spec 04-ecs/010-core-systems.md.
 */
export declare const SYSTEM_ORDER: readonly ["CommandApply", "WaveSpawn", "PathMovement", "SpatialIndex", "AuraMembership", "ModifierResolution", "Targeting", "TowerAttack", "AbilityAutocast", "Projectile", "Trap", "AreaEffect", "RuntimeStatus", "DamageResolution", "DeathAndLeak", "RewardDrop", "Economy", "TowerXp", "CooldownMana", "Telemetry", "Cleanup", "CheckpointSerialization"];
export type SystemName = (typeof SYSTEM_ORDER)[number];
//# sourceMappingURL=systems.d.ts.map