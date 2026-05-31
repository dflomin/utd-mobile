import type { RenderSnapshot, SimulationSummary } from '@utd/shared-types';

export type ScriptedRunOptions = {
  readonly seed: number;
  readonly maxTicks: number;
};

export const runScriptedSimulation = (_options: ScriptedRunOptions): SimulationSummary => {
  throw new Error('TODO: implement deterministic simulation');
};

export const createRenderSnapshot = (): RenderSnapshot => ({
  path: [],
  towers: [],
  enemies: [],
  hud: { lives: 0, gold: 0, wave: 0, hpLabel: '' }
});
