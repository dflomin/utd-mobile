import type { SimulationSummary } from '@utd/shared-types';

export type TelemetryEvent = {
  readonly type: string;
  readonly sourceId?: string;
  readonly amount?: number;
};

export const summarizeTelemetry = (): SimulationSummary => ({
  waveReached: 0,
  kills: 0,
  leaks: 0,
  gold: 0,
  lives: 0,
  damageByTower: {},
  commandLogReference: '',
  configFingerprint: '',
  stateHash: ''
});
