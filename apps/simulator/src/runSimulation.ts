import { runScriptedSimulation, type ScriptedRunOptions, type SimulationSummary } from '@utd/game-core';

export type WeightedElementStrategy = Record<string, number>;

export type SimulatorScenarioOptions = {
  readonly weightedElementStrategies?: WeightedElementStrategy;
  readonly forcedCarryTowerAvailability?: readonly string[];
  readonly biasedCarryTowerAvailability?: Readonly<Record<string, number>>;
  readonly controlledTowerCombinations?: readonly (readonly string[])[];
  readonly dropRateMultiplier?: number;
  readonly enemyScalingMultiplier?: number;
  readonly itemOddsMultiplier?: number;
  readonly potionOddsMultiplier?: number;
  readonly manaRegenMultiplier?: number;
  readonly manaSpendMultiplier?: number;
  readonly auraContributionMultiplier?: number;
};

export type PerWaveLeak = {
  readonly wave: number;
  readonly leaks: number;
};

export type EconomyStage = {
  readonly wave: number;
  readonly gold: number;
  readonly lives: number;
};

export type RunBuildSnapshot = {
  readonly hero: string | null;
  readonly elements: readonly string[];
  readonly towers: readonly string[];
  readonly items: readonly string[];
  readonly potions: readonly string[];
  readonly stats: {
    readonly kills: number;
    readonly leaks: number;
    readonly gold: number;
    readonly lives: number;
  };
  readonly waveReached: number;
  readonly reportData: SimulationSummary;
};

export type SimulatorRunRecord = {
  readonly runIndex: number;
  readonly seed: number;
  readonly summary: SimulationSummary;
  readonly perWaveLeakage: readonly PerWaveLeak[];
  readonly perStageEconomy: readonly EconomyStage[];
  readonly buildSnapshot: RunBuildSnapshot;
};

export type RunHistoryExport = {
  readonly scenario: SimulatorScenarioOptions;
  readonly runs: readonly SimulatorRunRecord[];
};

export type SimulationBatchOptions = ScriptedRunOptions & {
  readonly runs: number;
  readonly seedStep?: number;
  readonly scenario?: SimulatorScenarioOptions;
};

export type SimulationBatchResult = {
  readonly runs: readonly SimulatorRunRecord[];
  readonly averageWaveReached: number;
  readonly averageKills: number;
  readonly averageLeaks: number;
  readonly averageGold: number;
  readonly exportDump: string;
};

const createRunRecord = (runIndex: number, seed: number, summary: SimulationSummary): SimulatorRunRecord => ({
  runIndex,
  seed,
  summary,
  perWaveLeakage: [{ wave: 1, leaks: summary.leaks }],
  perStageEconomy: [{ wave: summary.waveReached, gold: summary.gold, lives: summary.lives }],
  buildSnapshot: {
    hero: null,
    elements: [],
    towers: Object.keys(summary.damageByTower),
    items: [],
    potions: [],
    stats: {
      kills: summary.kills,
      leaks: summary.leaks,
      gold: summary.gold,
      lives: summary.lives
    },
    waveReached: summary.waveReached,
    reportData: summary
  }
});

export const runSimulation = (options: ScriptedRunOptions): SimulationSummary => {
  return runScriptedSimulation(options);
};

export const exportRunHistory = (history: RunHistoryExport): string => {
  return JSON.stringify(history, null, 2);
};

export const runSimulationBatch = (options: SimulationBatchOptions): SimulationBatchResult => {
  if (options.runs <= 0) {
    throw new Error('runs must be greater than zero');
  }
  const seedStep = options.seedStep ?? 1;
  const scenario = options.scenario ?? {};
  const runRecords: SimulatorRunRecord[] = [];

  for (let index = 0; index < options.runs; index += 1) {
    const seed = options.seed + (index * seedStep);
    const summary = runSimulation({ ...options, seed });
    runRecords.push(createRunRecord(index, seed, summary));
  }

  const averageWaveReached = runRecords.reduce((sum, run) => sum + run.summary.waveReached, 0) / runRecords.length;
  const averageKills = runRecords.reduce((sum, run) => sum + run.summary.kills, 0) / runRecords.length;
  const averageLeaks = runRecords.reduce((sum, run) => sum + run.summary.leaks, 0) / runRecords.length;
  const averageGold = runRecords.reduce((sum, run) => sum + run.summary.gold, 0) / runRecords.length;

  return {
    runs: runRecords,
    averageWaveReached,
    averageKills,
    averageLeaks,
    averageGold,
    exportDump: exportRunHistory({ scenario, runs: runRecords })
  };
};
