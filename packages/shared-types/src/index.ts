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
