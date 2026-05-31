import { describe, expect, it } from 'vitest';

import { createBuildTowerCommand, createReplaceTowerCommand, createSellTowerCommand, createStartWaveCommand, runScriptedSimulation } from './index.js';

describe('command behaviors', () => {
  it('applies SELL_TOWER and removes damage output', () => {
    const baseline = runScriptedSimulation({ seed: 7, maxTicks: 1000 });
    const sold = runScriptedSimulation({
      seed: 7,
      maxTicks: 1000,
      commands: [createStartWaveCommand(0), createBuildTowerCommand(0, 1), createSellTowerCommand(1, 2)]
    });

    expect(sold.kills).toBeLessThan(baseline.kills);
    expect(sold.leaks).toBeGreaterThan(baseline.leaks);
  });

  it('applies REPLACE_TOWER with same element when requirements are met', () => {
    const baseline = runScriptedSimulation({ seed: 7, maxTicks: 1000 });
    const replaced = runScriptedSimulation({
      seed: 7,
      maxTicks: 1000,
      commands: [createStartWaveCommand(0), createBuildTowerCommand(0, 1), createReplaceTowerCommand(1, 2)]
    });

    expect(replaced.kills).toBe(baseline.kills);
    expect(replaced.gold).toBe(baseline.gold - 7);
  });

  it('rejects REPLACE_TOWER when replacement element differs from target', () => {
    const baseline = runScriptedSimulation({ seed: 7, maxTicks: 1000 });
    const rejected = runScriptedSimulation({
      seed: 7,
      maxTicks: 1000,
      commands: [
        createStartWaveCommand(0),
        createBuildTowerCommand(0, 1),
        {
          ...createReplaceTowerCommand(1, 2),
          commandId: '55555555-5555-4555-8555-555555555555',
          payload: {
            targetTowerEntityId: 'tower-1',
            targetTowerInstanceId: 'tower-instance-1',
            targetTowerDefId: 'tower.basic',
            replacementBlueprintStackId: 'stack-3',
            replacementTowerDefId: 'tower.fire.basic'
          }
        }
      ]
    });

    expect(rejected.kills).toBe(baseline.kills);
    expect(rejected.leaks).toBe(baseline.leaks);
    expect(rejected.gold).toBe(baseline.gold);
    expect(rejected.lives).toBe(baseline.lives);
    expect(rejected.waveReached).toBe(baseline.waveReached);
    expect(rejected.damageByTower).toEqual(baseline.damageByTower);
    expect(rejected.stateHash).toBe(baseline.stateHash);
  });
});
