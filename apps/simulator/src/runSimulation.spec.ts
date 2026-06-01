import { describe, expect, it } from 'vitest';

import { exportRunHistory, runSimulation, runSimulationBatch } from './runSimulation.js';

describe('runSimulation', () => {
  it('returns deterministic JSON-friendly simulator output', () => {
    const summary = runSimulation({ seed: 11, maxTicks: 120 });

    expect(summary.waveReached).toBe(1);
    expect(summary.commandLogReference.length).toBeGreaterThan(0);
    expect(summary.configFingerprint.length).toBeGreaterThan(0);
    expect(summary.damageByTower['tower-1']).toBeGreaterThan(0);
    expect(JSON.parse(JSON.stringify(summary))).toEqual(summary);
  });

  it('changes state hash when seed changes', () => {
    const first = runSimulation({ seed: 11, maxTicks: 120 });
    const second = runSimulation({ seed: 12, maxTicks: 120 });

    expect(first.commandLogReference).toBe(second.commandLogReference);
    expect(first.stateHash).not.toBe(second.stateHash);
  });
});

describe('runSimulationBatch', () => {
  it('supports seeded Monte Carlo runs and exports run history', () => {
    const batch = runSimulationBatch({ seed: 11, maxTicks: 120, runs: 3, seedStep: 0, scenario: { weightedElementStrategies: { arcane: 1 } } });

    expect(batch.runs).toHaveLength(3);
    expect(batch.runs[0].summary).toEqual(batch.runs[1].summary);
    expect(batch.averageWaveReached).toBe(1);
    expect(batch.runs[0].perWaveLeakage).toEqual([{ wave: 1, leaks: batch.runs[0].summary.leaks }]);
    expect(batch.runs[0].perStageEconomy[0]?.gold).toBe(batch.runs[0].summary.gold);

    const exported = JSON.parse(batch.exportDump);
    expect(exported.runs[0].buildSnapshot.reportData).toEqual(batch.runs[0].summary);
    expect(exported.scenario.weightedElementStrategies.arcane).toBe(1);

    const directExport = exportRunHistory({ scenario: {}, runs: batch.runs });
    expect(JSON.parse(directExport).runs).toHaveLength(3);
  });

  it('rejects zero-run batches', () => {
    expect(() => runSimulationBatch({ seed: 1, maxTicks: 1, runs: 0 })).toThrow('runs must be greater than zero');
  });

  it('increments per-run seeds by seedStep and computes averages from runs', () => {
    const batch = runSimulationBatch({ seed: 3, seedStep: 2, maxTicks: 120, runs: 3 });

    expect(batch.runs.map((run) => run.seed)).toEqual([3, 5, 7]);

    const averageWaveReached = batch.runs.reduce((sum, run) => sum + run.summary.waveReached, 0) / batch.runs.length;
    const averageKills = batch.runs.reduce((sum, run) => sum + run.summary.kills, 0) / batch.runs.length;
    const averageLeaks = batch.runs.reduce((sum, run) => sum + run.summary.leaks, 0) / batch.runs.length;
    const averageGold = batch.runs.reduce((sum, run) => sum + run.summary.gold, 0) / batch.runs.length;

    expect(batch.averageWaveReached).toBe(averageWaveReached);
    expect(batch.averageKills).toBe(averageKills);
    expect(batch.averageLeaks).toBe(averageLeaks);
    expect(batch.averageGold).toBe(averageGold);
  });
});
