import { createConfigFingerprint, createContentConfig, validateContentConfig } from '@utd/content-config';
import { translate } from '@utd/localization';
import {
  GAME_SCHEMA_VERSION,
  type AnyGameCommand,
  type BuildTowerCommand,
  type CommandRejectionCode,
  type ReplaceTowerCommand,
  type RenderSnapshot,
  type SellTowerCommand,
  type SimulationSummary,
  type StartWaveCommand
} from '@utd/shared-types';
import { summarizeTelemetry, type TelemetryEvent } from '@utd/telemetry';

import { hashValue } from './hash.js';
import { createRngStreams, nextRandom } from './rng.js';

type TowerState = { id: string; instanceId: string; towerDefId: string; slotId: string; x: number; y: number; range: number; damage: number; cooldownTicks: number; cooldown: number };
type EnemyState = { id: string; instanceId: string; enemyDefId: string; health: number; rewardGold: number; leakDamage: number; speedPerTick: number; pathProgress: number; x: number; y: number };
type InventoryState = { stackId: string; towerDefId: string; count: number }[];
type SimulationState = {
  tick: number;
  seed: number;
  gold: number;
  lives: number;
  waveStarted: boolean;
  waveId: string | null;
  waveStartTick: number | null;
  spawnedEnemies: number;
  commands: AnyGameCommand[];
  acceptedCommandIds: Set<string>;
  lastClientSeq: number;
  towers: TowerState[];
  enemies: EnemyState[];
  inventory: InventoryState;
  telemetry: TelemetryEvent[];
  rng: ReturnType<typeof createRngStreams>;
};
export type ScriptedRunOptions = { readonly seed: number; readonly maxTicks: number; readonly commands?: readonly AnyGameCommand[]; readonly consumeCombatRngSamples?: number };

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sessionId = 'session-1';
const playerId = 'player-1';
const runId = 'run-1';
const pathLength = 360;

const createState = (seed: number): SimulationState => {
  const config = createContentConfig();
  return {
    tick: 0,
    seed,
    gold: config.economy.startingGold,
    lives: config.economy.startingLives,
    waveStarted: false,
    waveId: null,
    waveStartTick: null,
    spawnedEnemies: 0,
    commands: [],
    acceptedCommandIds: new Set<string>(),
    lastClientSeq: -1,
    towers: [],
    enemies: [],
    inventory: config.inventory.map((stack) => ({ ...stack })),
    telemetry: [],
    rng: createRngStreams(seed)
  };
};

const createEnemyPosition = (pathProgress: number) => ({ x: Math.min(pathProgress, pathLength), y: 180 });
const inRange = (tower: TowerState, enemy: EnemyState): boolean => ((tower.x - enemy.x) ** 2) + ((tower.y - enemy.y) ** 2) <= tower.range ** 2;

export const createBuildTowerCommand = (applyAtTick = 0, clientSeq = 1): BuildTowerCommand => ({
  schemaVersion: GAME_SCHEMA_VERSION,
  commandId: '11111111-1111-4111-8111-111111111111',
  sessionId,
  runId,
  playerId,
  clientSeq,
  clientSentAtMs: applyAtTick * 50,
  issuedAtLocalTick: applyAtTick,
  applyAtTick,
  type: 'BUILD_TOWER',
  payload: { slotId: 'slot-1', blueprintStackId: 'stack-1', towerDefId: 'tower.basic' }
});

export const createStartWaveCommand = (applyAtTick = 0): StartWaveCommand => ({
  schemaVersion: GAME_SCHEMA_VERSION,
  commandId: '22222222-2222-4222-8222-222222222222',
  sessionId,
  runId,
  playerId,
  clientSeq: 0,
  clientSentAtMs: applyAtTick * 50,
  issuedAtLocalTick: applyAtTick,
  applyAtTick,
  type: 'START_WAVE',
  payload: { waveId: 'wave-1' }
});

export const createSellTowerCommand = (applyAtTick = 1, clientSeq = 2): SellTowerCommand => ({
  schemaVersion: GAME_SCHEMA_VERSION,
  commandId: '33333333-3333-4333-8333-333333333333',
  sessionId,
  runId,
  playerId,
  clientSeq,
  clientSentAtMs: applyAtTick * 50,
  issuedAtLocalTick: applyAtTick,
  applyAtTick,
  type: 'SELL_TOWER',
  payload: { towerEntityId: 'tower-1', towerInstanceId: 'tower-instance-1', towerDefId: 'tower.basic' }
});

export const createReplaceTowerCommand = (applyAtTick = 1, clientSeq = 2): ReplaceTowerCommand => ({
  schemaVersion: GAME_SCHEMA_VERSION,
  commandId: '44444444-4444-4444-8444-444444444444',
  sessionId,
  runId,
  playerId,
  clientSeq,
  clientSentAtMs: applyAtTick * 50,
  issuedAtLocalTick: applyAtTick,
  applyAtTick,
  type: 'REPLACE_TOWER',
  payload: {
    targetTowerEntityId: 'tower-1',
    targetTowerInstanceId: 'tower-instance-1',
    targetTowerDefId: 'tower.basic',
    replacementBlueprintStackId: 'stack-2',
    replacementTowerDefId: 'tower.arcane.plus'
  }
});

const reject = (state: SimulationState, code: CommandRejectionCode, commandId: string): CommandRejectionCode => {
  state.telemetry.push({ type: 'commandRejected', sourceId: `${commandId}:${code}` });
  return code;
};

const validateCommand = (state: SimulationState, command: AnyGameCommand): CommandRejectionCode | null => {
  const config = createContentConfig();
  if (command.schemaVersion !== GAME_SCHEMA_VERSION) return reject(state, 'INVALID_SCHEMA_VERSION', command.commandId);
  if (!uuidPattern.test(command.commandId)) return reject(state, 'INVALID_COMMAND_ID', command.commandId);
  if (command.sessionId !== sessionId || command.runId !== runId || command.playerId !== playerId) return reject(state, 'INVALID_MEMBERSHIP', command.commandId);
  if (command.clientSeq <= state.lastClientSeq) return reject(state, 'NON_MONOTONIC_CLIENT_SEQ', command.commandId);
  if (command.applyAtTick < state.tick || command.applyAtTick > state.tick + config.economy.schedulingWindowTicks) return reject(state, 'INVALID_SCHEDULE_WINDOW', command.commandId);
  if (state.acceptedCommandIds.has(command.commandId)) return 'DUPLICATE_COMMAND';
  if (state.lives <= 0) return reject(state, 'GAME_OVER', command.commandId);
  if (command.type === 'START_WAVE' && !config.waves.some((wave) => wave.id == command.payload.waveId)) return reject(state, 'UNKNOWN_WAVE', command.commandId);
  if (command.type === 'START_WAVE') return null;
  if (command.type === 'SELL_TOWER') {
    const existing = state.towers.find((entry) => entry.id === command.payload.towerEntityId);
    if (!existing || existing.towerDefId !== command.payload.towerDefId) return reject(state, 'UNKNOWN_TOWER', command.commandId);
    if (existing.instanceId !== command.payload.towerInstanceId) return reject(state, 'UNKNOWN_TOWER_INSTANCE', command.commandId);
    return null;
  }
  if (command.type === 'REPLACE_TOWER') {
    const existing = state.towers.find((entry) => entry.id === command.payload.targetTowerEntityId);
    if (!existing || existing.towerDefId !== command.payload.targetTowerDefId) return reject(state, 'UNKNOWN_TOWER', command.commandId);
    if (existing.instanceId !== command.payload.targetTowerInstanceId) return reject(state, 'UNKNOWN_TOWER_INSTANCE', command.commandId);
    const targetTower = config.towers.find((entry) => entry.id === existing.towerDefId);
    const replacementTower = config.towers.find((entry) => entry.id === command.payload.replacementTowerDefId);
    const replacementStack = state.inventory.find((entry) => entry.stackId === command.payload.replacementBlueprintStackId);
    if (!targetTower || !replacementTower) return reject(state, 'UNKNOWN_TOWER', command.commandId);
    if (!replacementStack || replacementStack.count <= 0) return reject(state, 'BLUEPRINT_NOT_OWNED', command.commandId);
    if (replacementStack.towerDefId !== replacementTower.id) return reject(state, 'BLUEPRINT_MISMATCH', command.commandId);
    if (targetTower.element !== replacementTower.element) return reject(state, 'REPLACEMENT_ELEMENT_MISMATCH', command.commandId);
    if (state.gold < replacementTower.cost) return reject(state, 'INSUFFICIENT_GOLD', command.commandId);
    return null;
  }
  const tower = config.towers.find((entry) => entry.id === command.payload.towerDefId);
  const slot = config.slots.find((entry) => entry.id === command.payload.slotId);
  const stack = state.inventory.find((entry) => entry.stackId === command.payload.blueprintStackId);
  if (!tower) return reject(state, 'UNKNOWN_TOWER', command.commandId);
  if (!slot) return reject(state, 'UNKNOWN_SLOT', command.commandId);
  if (!stack || stack.count <= 0) return reject(state, 'BLUEPRINT_NOT_OWNED', command.commandId);
  if (stack.towerDefId !== tower.id) return reject(state, 'BLUEPRINT_MISMATCH', command.commandId);
  if (state.gold < tower.cost) return reject(state, 'INSUFFICIENT_GOLD', command.commandId);
  if (state.towers.some((entry) => entry.slotId === slot.id)) return reject(state, 'SLOT_OCCUPIED', command.commandId);
  return null;
};

const applyCommand = (state: SimulationState, command: AnyGameCommand): void => {
  const config = createContentConfig();
  const rejection = validateCommand(state, command);
  if (rejection === 'DUPLICATE_COMMAND') return;
  if (rejection) return;
  state.acceptedCommandIds.add(command.commandId);
  state.lastClientSeq = command.clientSeq;
  state.telemetry.push({ type: 'commandAccepted', sourceId: command.commandId });
  if (command.type === 'START_WAVE') {
    state.waveStarted = true;
    state.waveId = command.payload.waveId;
    state.waveStartTick = state.tick;
    return;
  }
  if (command.type === 'SELL_TOWER') {
    const existing = state.towers.find((tower) => tower.id === command.payload.towerEntityId && tower.instanceId === command.payload.towerInstanceId);
    if (existing) {
      state.towers = state.towers.filter((tower) => tower !== existing);
      state.gold += 2;
    }
    return;
  }
  if (command.type === 'REPLACE_TOWER') {
    const targetIndex = state.towers.findIndex((tower) => tower.id === command.payload.targetTowerEntityId && tower.instanceId === command.payload.targetTowerInstanceId);
    const replacementTower = config.towers.find((entry) => entry.id === command.payload.replacementTowerDefId)!;
    const replacementStack = state.inventory.find((entry) => entry.stackId === command.payload.replacementBlueprintStackId)!;
    if (targetIndex >= 0) {
      replacementStack.count -= 1;
      state.gold -= replacementTower.cost;
      state.towers[targetIndex] = {
        ...state.towers[targetIndex],
        instanceId: `${state.towers[targetIndex].id}-instance-${state.tick}`,
        towerDefId: replacementTower.id,
        range: replacementTower.range,
        damage: replacementTower.damage,
        cooldownTicks: replacementTower.cooldownTicks,
        cooldown: 0
      };
    }
    return;
  }
  const tower = config.towers.find((entry) => entry.id === command.payload.towerDefId)!;
  const slot = config.slots.find((entry) => entry.id === command.payload.slotId)!;
  const stack = state.inventory.find((entry) => entry.stackId === command.payload.blueprintStackId)!;
  stack.count -= 1;
  state.gold -= tower.cost;
  state.towers.push({ id: `tower-${state.towers.length + 1}`, instanceId: `tower-instance-${state.towers.length + 1}`, towerDefId: tower.id, slotId: slot.id, x: slot.x, y: slot.y, range: tower.range, damage: tower.damage, cooldownTicks: tower.cooldownTicks, cooldown: 0 });
};

const spawnWaveEnemies = (state: SimulationState): void => {
  if (!state.waveStarted || state.waveStartTick === null) return;
  const config = createContentConfig();
  const wave = config.waves.find((entry) => entry.id === state.waveId);
  const enemyDef = config.enemies.find((entry) => entry.id === wave?.enemyId);
  if (!wave || !enemyDef) return;
  const ticksSinceStart = state.tick - state.waveStartTick;
  while (state.spawnedEnemies < wave.count && ticksSinceStart >= state.spawnedEnemies * wave.spawnIntervalTicks) {
    const pathProgress = Math.floor(nextRandom(state.rng, 'waves') * 0);
    const position = createEnemyPosition(pathProgress);
    const index = state.spawnedEnemies + 1;
    state.enemies.push({ id: `enemy-${index}`, instanceId: `enemy-instance-${index}`, enemyDefId: enemyDef.id, health: enemyDef.health, rewardGold: enemyDef.rewardGold, leakDamage: enemyDef.leakDamage, speedPerTick: enemyDef.speedPerTick, pathProgress, x: position.x, y: position.y });
    state.spawnedEnemies += 1;
  }
};

const attackWithTowers = (state: SimulationState): void => {
  for (const tower of state.towers) {
    if (tower.cooldown > 0) continue;
    const target = state.enemies.filter((enemy) => inRange(tower, enemy)).sort((left, right) => right.pathProgress - left.pathProgress)[0];
    if (!target) continue;
    target.health -= tower.damage;
    state.telemetry.push({ type: 'damage', sourceId: tower.id, amount: tower.damage });
    tower.cooldown = tower.cooldownTicks;
  }
  const survivors: EnemyState[] = [];
  for (const enemy of state.enemies) {
    if (enemy.health <= 0) {
      state.gold += enemy.rewardGold;
      state.telemetry.push({ type: 'kill' });
      continue;
    }
    survivors.push(enemy);
  }
  state.enemies = survivors;
  state.towers.forEach((tower) => {
    tower.cooldown = Math.max(0, tower.cooldown - 1);
  });
};

const moveEnemies = (state: SimulationState): void => {
  const survivors: EnemyState[] = [];
  for (const enemy of state.enemies) {
    enemy.pathProgress += enemy.speedPerTick;
    Object.assign(enemy, createEnemyPosition(enemy.pathProgress));
    if (enemy.pathProgress >= pathLength) {
      state.lives -= enemy.leakDamage;
      state.telemetry.push({ type: 'leak' });
      continue;
    }
    survivors.push(enemy);
  }
  state.enemies = survivors;
};

const runToTick = (options: ScriptedRunOptions, stopAtTick: number) => {
  const config = createContentConfig();
  const errors = validateContentConfig(config);
  if (errors.length > 0) throw new Error(`Invalid config: ${errors.join(', ')}`);
  const state = createState(options.seed);
  const commands = [...(options.commands ?? [createStartWaveCommand(), createBuildTowerCommand()])].sort((left, right) => {
    return left.applyAtTick - right.applyAtTick || left.clientSeq - right.clientSeq || left.commandId.localeCompare(right.commandId);
  });
  state.commands = commands;
  while (state.tick < stopAtTick && state.lives > 0) {
    for (const command of commands.filter((entry) => entry.applyAtTick === state.tick)) {
      applyCommand(state, command);
    }
    for (let index = 0; index < (options.consumeCombatRngSamples ?? 0); index += 1) {
      nextRandom(state.rng, 'combat');
    }
    spawnWaveEnemies(state);
    attackWithTowers(state);
    moveEnemies(state);
    state.tick += 1;
    const wave = config.waves[0];
    if (state.spawnedEnemies >= wave.count && state.enemies.length === 0) break;
  }
  const configFingerprint = createConfigFingerprint(config);
  const commandLogReference = hashValue(commands.map((command) => ({ id: command.commandId, tick: command.applyAtTick, type: command.type })));
  const stateHash = hashValue({ tick: state.tick, gold: state.gold, lives: state.lives, towers: state.towers, enemies: state.enemies, inventory: state.inventory, rng: state.rng, waveId: state.waveId, spawnedEnemies: state.spawnedEnemies });
  return { state, summary: summarizeTelemetry({ events: state.telemetry, configFingerprint, commandLogReference, stateHash, gold: state.gold, lives: state.lives, waveReached: state.waveStarted ? 1 : 0 }) };
};

export const runScriptedSimulation = (options: ScriptedRunOptions): SimulationSummary => runToTick(options, options.maxTicks).summary;

export const createRenderSnapshot = (options: Partial<ScriptedRunOptions> & { readonly tick?: number } = {}): RenderSnapshot => {
  const { state } = runToTick({ seed: options.seed ?? 7, maxTicks: options.tick ?? 0, commands: options.commands, consumeCombatRngSamples: options.consumeCombatRngSamples }, options.tick ?? 0);
  return {
    path: createContentConfig().map.path,
    towers: state.towers.map((tower) => ({ id: tower.id, x: tower.x, y: tower.y })),
    enemies: state.enemies.map((enemy) => ({ id: enemy.id, x: enemy.x, y: enemy.y, health: enemy.health })),
    hud: { lives: state.lives, gold: state.gold, wave: state.waveStarted ? 1 : 0, hpLabel: translate('ui.hp') }
  };
};
