import { describe, expect, it } from 'vitest';

import { runSimulation } from './runSimulation.js';

describe('runSimulation', () => {
  it('returns deterministic JSON-friendly simulator output', () => {
    const summary = runSimulation({ seed: 11, maxTicks: 120 });

    expect(summary.waveReached).toBe(1);
    expect(summary.commandLogReference.length).toBeGreaterThan(0);
    expect(summary.configFingerprint.length).toBeGreaterThan(0);
    expect(summary.damageByTower['tower-1']).toBeGreaterThan(0);
    expect(JSON.parse(JSON.stringify(summary))).toEqual(summary);
  });
});
