import { type AnyGameCommand, type BuildTowerCommand, type RenderSnapshot, type SimulationSummary, type StartWaveCommand } from '@utd/shared-types';
export type ScriptedRunOptions = {
    readonly seed: number;
    readonly maxTicks: number;
    readonly commands?: readonly AnyGameCommand[];
    readonly consumeCombatRngSamples?: number;
};
export declare const createBuildTowerCommand: (applyAtTick?: number, clientSeq?: number) => BuildTowerCommand;
export declare const createStartWaveCommand: (applyAtTick?: number) => StartWaveCommand;
export declare const runScriptedSimulation: (options: ScriptedRunOptions) => SimulationSummary;
export declare const createRenderSnapshot: (options?: Partial<ScriptedRunOptions> & {
    readonly tick?: number;
}) => RenderSnapshot;
//# sourceMappingURL=simulation.d.ts.map