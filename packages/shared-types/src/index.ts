export const GAME_SCHEMA_VERSION = 1;
export const FIXED_TPS = 20;
export const TICK_MS = 50;

export type GameCommand<TType extends string, TPayload> = {
  readonly schemaVersion: number;
  readonly commandId: string;
  readonly sessionId: string;
  readonly runId: string;
  readonly playerId: string;
  readonly clientSeq: number;
  readonly clientSentAtMs: number;
  readonly issuedAtLocalTick: number;
  readonly applyAtTick: number;
  readonly type: TType;
  readonly payload: TPayload;
  readonly preStateHash?: string;
  readonly clientStateVersion?: number;
};

export type BuildTowerPayload = {
  readonly slotId: string;
  readonly blueprintStackId: string;
  readonly towerDefId: string;
};

export type SellTowerPayload = {
  readonly towerEntityId: string;
  readonly towerInstanceId: string;
  readonly towerDefId: string;
};

export type ReplaceTowerPayload = {
  readonly targetTowerEntityId: string;
  readonly targetTowerInstanceId: string;
  readonly targetTowerDefId: string;
  readonly replacementBlueprintStackId: string;
  readonly replacementTowerDefId: string;
};

export type StartWavePayload = {
  readonly waveId: string;
};

export type BuildTowerCommand = GameCommand<'BUILD_TOWER', BuildTowerPayload>;
export type SellTowerCommand = GameCommand<'SELL_TOWER', SellTowerPayload>;
export type ReplaceTowerCommand = GameCommand<'REPLACE_TOWER', ReplaceTowerPayload>;
export type StartWaveCommand = GameCommand<'START_WAVE', StartWavePayload>;
export type AnyGameCommand = BuildTowerCommand | SellTowerCommand | ReplaceTowerCommand | StartWaveCommand;

export type CommandRejectionCode =
  | 'INVALID_SCHEMA_VERSION'
  | 'INVALID_COMMAND_ID'
  | 'INVALID_MEMBERSHIP'
  | 'NON_MONOTONIC_CLIENT_SEQ'
  | 'INVALID_SCHEDULE_WINDOW'
  | 'DUPLICATE_COMMAND'
  | 'GAME_OVER'
  | 'UNKNOWN_WAVE'
  | 'BLUEPRINT_NOT_OWNED'
  | 'BLUEPRINT_MISMATCH'
  | 'INSUFFICIENT_GOLD'
  | 'SLOT_OCCUPIED'
  | 'UNKNOWN_SLOT'
  | 'UNKNOWN_TOWER'
  | 'UNKNOWN_TOWER_INSTANCE'
  | 'REPLACEMENT_ELEMENT_MISMATCH';

export type RenderPoint = { readonly x: number; readonly y: number };

export type RenderSnapshot = {
  readonly path: readonly RenderPoint[];
  readonly towers: readonly {
    readonly id: string;
    readonly x: number;
    readonly y: number;
  }[];
  readonly enemies: readonly {
    readonly id: string;
    readonly x: number;
    readonly y: number;
    readonly health: number;
  }[];
  readonly hud: {
    readonly lives: number;
    readonly gold: number;
    readonly wave: number;
    readonly hpLabel: string;
  };
};

export type SimulationSummary = {
  readonly waveReached: number;
  readonly kills: number;
  readonly leaks: number;
  readonly gold: number;
  readonly lives: number;
  readonly damageByTower: Record<string, number>;
  readonly commandLogReference: string;
  readonly configFingerprint: string;
  readonly stateHash: string;
};

// ---------------------------------------------------------------------------
// Stat and Modifier types (spec: 05-modifiers)
// ---------------------------------------------------------------------------

/** First-class stat identifiers (spec: 05-modifiers/006-core-stat-ids.md). */
export type StatId =
  | 'DAMAGE'
  | 'ATTACK_COOLDOWN_TICKS'
  | 'ATTACK_SPEED_MULTIPLIER'
  | 'RANGE'
  | 'TARGET_COUNT'
  | 'CAN_TARGET_FLYING'
  | 'CAN_TARGET_GROUND'
  | 'CAN_ATTACK'
  | 'CAN_CAST'
  | 'MANA_MAX'
  | 'MANA_REGEN_PER_TICK'
  | 'MANA_COST_MULTIPLIER'
  | 'ABILITY_COOLDOWN_MULTIPLIER'
  | 'SPLASH_RADIUS'
  | 'SPLASH_DAMAGE_MULTIPLIER'
  | 'CHAIN_COUNT'
  | 'CHAIN_RANGE'
  | 'CHAIN_DAMAGE_MULTIPLIER'
  | 'DOT_DAMAGE_MULTIPLIER'
  | 'DOT_DURATION_MULTIPLIER'
  | 'SLOW_PERCENT'
  | 'STATUS_DURATION_MULTIPLIER'
  | 'CRIT_CHANCE'
  | 'CRIT_MULTIPLIER'
  | 'PROC_CHANCE_MULTIPLIER'
  | 'GOLD_GAIN_MULTIPLIER'
  | 'INTEREST_RATE'
  | 'INTEREST_CAP'
  | 'SELL_RATIO'
  | 'ITEM_DROP_CHANCE'
  | 'POTION_DROP_CHANCE'
  | 'REROLL_RECHARGE_INTERVAL'
  | 'REROLL_WINDOW_ROUNDS'
  | 'RARITY_BONUS'
  | 'ENEMY_MAX_HP'
  | 'ENEMY_SPEED'
  | 'ENEMY_SHIELD_HP'
  | 'ENEMY_GOLD_REWARD'
  | 'ENEMY_XP_REWARD';

/** Modifier operation types (spec: 05-modifiers/002-modifier-types.md). */
export type ModifierOp =
  | 'FLAT_ADD'
  | 'PERCENT_ADD'
  | 'MULTIPLY'
  | 'MIN_CAP'
  | 'MAX_CAP'
  | 'OVERRIDE';

/** Modifier scope targets (spec: 05-modifiers/004-targeting-filters.md). */
export type ModifierTarget =
  | 'SELF'
  | 'TOWER'
  | 'ENEMY'
  | 'PLAYER'
  | 'ALL_PLAYER_TOWERS'
  | 'ALL_ENEMIES'
  | 'AURA_RECEIVERS'
  | 'RUN_GLOBAL';

/** Modifier stacking modes (spec: 05-modifiers/005-stacking-rules.md). */
export type ModifierStackMode =
  | 'STACK'
  | 'UNIQUE_BY_SOURCE'
  | 'UNIQUE_BY_DEF'
  | 'HIGHEST_ONLY'
  | 'REFRESH_DURATION'
  | 'ADD_STACK_REFRESH_DURATION';

/**
 * Static modifier definition stored in content config.
 * (spec: 05-modifiers/003-modifier-def-instance.md)
 */
export type ModifierDef = {
  readonly modifierDefId: string;
  readonly statId: StatId;
  readonly op: ModifierOp;
  /** Fixed-point value relative to FP_ONE = 1000. */
  readonly value: number;
  readonly sourceType: string;
  readonly sourceId: string;
  readonly target: ModifierTarget;
  readonly stackMode?: ModifierStackMode;
  readonly durationTicks?: number;
  readonly tags?: readonly string[];
};

/**
 * Runtime modifier instance active on an entity.
 * (spec: 05-modifiers/003-modifier-def-instance.md)
 */
export type ModifierInstance = {
  readonly modifierInstanceId: string;
  readonly modifierDefId: string;
  readonly sourceEntityId?: number;
  readonly sourcePlayerId?: string;
  readonly sourceInstanceId?: string;
  readonly targetEntityId?: number;
  readonly targetPlayerId?: string;
  readonly appliedAtTick: number;
  readonly expiresAtTick?: number;
  /** Override value if different from the def. Fixed-point. */
  readonly valueOverride?: number;
};

// ---------------------------------------------------------------------------
// Effect system types (spec: 06-effects)
// ---------------------------------------------------------------------------

/** Damage element identifiers (spec: 06-effects/005-damage-elements-armor.md). */
export type DamageElement = 'FIRE' | 'ICE' | 'NATURE' | 'LIGHT' | 'DARK' | 'MACHINE' | 'VOID';

/** Enemy armor type identifiers (spec: 06-effects/005-damage-elements-armor.md). */
export type ArmorType = 'FIRE' | 'ICE' | 'NATURE' | 'LIGHT' | 'DARK' | 'MACHINE' | 'VOID' | 'RESISTANT';

/** Effect type identifiers (spec: 06-effects/003-effect-types.md). */
export type EffectType =
  | 'DIRECT_DAMAGE'
  | 'SPLASH_DAMAGE'
  | 'CHAIN_DAMAGE'
  | 'APPLY_STATUS'
  | 'APPLY_BUFF'
  | 'APPLY_DEBUFF'
  | 'SUMMON_TRAP'
  | 'SUMMON_STRUCTURE'
  | 'HEAL'
  | 'EXECUTE'
  | 'PERCENT_MAX_HP_DAMAGE'
  | 'PERCENT_CURRENT_HP_DAMAGE'
  | 'MODIFY_MANA'
  | 'MODIFY_GOLD'
  | 'MODIFY_LIVES'
  | 'TRANSFORM_DAMAGE'
  | 'TRIGGER_EFFECT';

/** Conditions under which a child effect fires (spec: 06-effects/002-effect-graph.md). */
export type EffectTrigger =
  | 'ON_SUCCESS'
  | 'ON_FAIL'
  | 'ON_CRIT'
  | 'ON_KILL'
  | 'ON_STATUS_APPLIED'
  | 'ON_PROJECTILE_IMPACT'
  | 'ON_EXPIRE';

/** Curated hook names (spec: 06-effects/010-hook-registry.md). */
export type HookName =
  | 'BEFORE_TARGETING'
  | 'ON_TARGET_SELECTED'
  | 'BEFORE_ATTACK'
  | 'ON_ATTACK_CREATED'
  | 'BEFORE_PROJECTILE_IMPACT'
  | 'ON_PROJECTILE_IMPACT'
  | 'BEFORE_DAMAGE'
  | 'ON_DAMAGE_RESOLVED'
  | 'AFTER_DAMAGE'
  | 'BEFORE_STATUS_APPLIED'
  | 'ON_STATUS_APPLIED'
  | 'BEFORE_KILL'
  | 'ON_KILL'
  | 'AFTER_KILL'
  | 'ON_CRIT'
  | 'ON_TOWER_DISABLED'
  | 'ON_WAVE_START'
  | 'ON_WAVE_END';

/** Hook behavior modes (spec: 06-effects/009-hooks-lifecycle.md). */
export type HookBehavior = 'MUTATE' | 'CANCEL' | 'REPLACE' | 'REACT';

/**
 * A child effect node in an effect graph.
 * (spec: 06-effects/002-effect-graph.md)
 */
export type EffectChildDef = {
  readonly trigger: EffectTrigger;
  readonly effectDefId: string;
};

/**
 * Static effect definition stored in content config.
 * (spec: 06-effects/001-effect-system-principles.md, 002-effect-graph.md)
 */
export type EffectDef = {
  readonly effectDefId: string;
  readonly effectType: EffectType;
  /** Fixed-point value (FP_ONE = 1000). Meaning depends on effectType. */
  readonly value: number;
  readonly element?: DamageElement;
  readonly children?: readonly EffectChildDef[];
  /** Numeric priority for hook ordering. Higher runs first. */
  readonly hookPriority?: number;
  readonly tags?: readonly string[];
};
