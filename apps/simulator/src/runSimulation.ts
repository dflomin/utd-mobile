import { runScriptedSimulation, type ScriptedRunOptions, type SimulationSummary } from '@utd/game-core';

export const runSimulation = (options: ScriptedRunOptions): SimulationSummary => {
  return runScriptedSimulation(options);
};
