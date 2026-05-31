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

export type StartWavePayload = {
  readonly waveId: string;
};

export type BuildTowerCommand = GameCommand<'BUILD_TOWER', BuildTowerPayload>;
export type SellTowerCommand = GameCommand<'SELL_TOWER', SellTowerPayload>;
export type StartWaveCommand = GameCommand<'START_WAVE', StartWavePayload>;
export type AnyGameCommand = BuildTowerCommand | SellTowerCommand | StartWaveCommand;

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
  | 'UNKNOWN_TOWER_INSTANCE';

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
