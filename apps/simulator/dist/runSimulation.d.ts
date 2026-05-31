import { type ScriptedRunOptions, type SimulationSummary } from '@utd/game-core';
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
export declare const runSimulation: (options: ScriptedRunOptions) => SimulationSummary;
export declare const exportRunHistory: (history: RunHistoryExport) => string;
export declare const runSimulationBatch: (options: SimulationBatchOptions) => SimulationBatchResult;
//# sourceMappingURL=runSimulation.d.ts.map