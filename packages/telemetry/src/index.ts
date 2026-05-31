import type { SimulationSummary } from '@utd/shared-types';

export type TelemetryEvent =
  | { readonly type: 'damage'; readonly sourceId: string; readonly amount: number }
  | { readonly type: 'kill' }
  | { readonly type: 'leak' }
  | { readonly type: 'commandAccepted'; readonly sourceId: string }
  | { readonly type: 'commandRejected'; readonly sourceId: string };

export const summarizeTelemetry = (options: {
  readonly events: readonly TelemetryEvent[];
  readonly configFingerprint: string;
  readonly commandLogReference: string;
  readonly stateHash: string;
  readonly gold: number;
  readonly lives: number;
  readonly waveReached: number;
}): SimulationSummary => {
  const damageByTower: Record<string, number> = {};
  let kills = 0;
  let leaks = 0;

  for (const event of options.events) {
    if (event.type === 'damage') {
      damageByTower[event.sourceId] = (damageByTower[event.sourceId] ?? 0) + event.amount;
    }
    if (event.type === 'kill') {
      kills += 1;
    }
    if (event.type === 'leak') {
      leaks += 1;
    }
  }

  return {
    waveReached: options.waveReached,
    kills,
    leaks,
    gold: options.gold,
    lives: options.lives,
    damageByTower,
    commandLogReference: options.commandLogReference,
    configFingerprint: options.configFingerprint,
    stateHash: options.stateHash
  };
};
