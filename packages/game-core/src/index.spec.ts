import { describe, expect, it } from 'vitest';

import { runScriptedSimulation } from './index.js';

describe('runScriptedSimulation', () => {
  it('replays the same seed and commands into the same summary and hash', () => {
    const first = runScriptedSimulation({ seed: 7, maxTicks: 1000 });
    const second = runScriptedSimulation({ seed: 7, maxTicks: 1000 });

    expect(first).toEqual(second);
    expect(first.waveReached).toBe(1);
    expect(first.kills).toBe(3);
    expect(first.leaks).toBe(0);
    expect(first.gold).toBeGreaterThan(12);
    expect(first.commandLogReference).toMatch(/[a-f0-9]{8,}/);
    expect(first.stateHash).toMatch(/[a-f0-9]{8,}/);
  });
});
