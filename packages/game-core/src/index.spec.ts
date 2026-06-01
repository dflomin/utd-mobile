import { describe, expect, it } from 'vitest';

import { createBuildTowerCommand, createStartWaveCommand, runScriptedSimulation } from './index.js';

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

  it('supports custom command lists', () => {
    const summary = runScriptedSimulation({ seed: 7, maxTicks: 100, commands: [] });

    expect(summary.waveReached).toBe(0);
    expect(summary.kills).toBe(0);
    expect(summary.leaks).toBe(0);
    expect(summary.gold).toBe(12);
  });

  it('changes results when commands change', () => {
    const startOnly = runScriptedSimulation({ seed: 7, maxTicks: 1000, commands: [createStartWaveCommand()] });
    const startAndBuild = runScriptedSimulation({ seed: 7, maxTicks: 1000, commands: [createStartWaveCommand(), createBuildTowerCommand()] });

    expect(startAndBuild.kills).toBeGreaterThan(startOnly.kills);
    expect(startAndBuild.leaks).toBeLessThan(startOnly.leaks);
    expect(startAndBuild.stateHash).not.toBe(startOnly.stateHash);
  });
});
