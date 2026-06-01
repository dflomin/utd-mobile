import { describe, expect, it, vi } from 'vitest';

import { createClientViewModel, createSubmitBuildCommand } from './viewModel.js';

describe('client view model', () => {
  it('creates reusable HUD rows and submits commands through callbacks', () => {
    const submitted: unknown[] = [];
    const submit = vi.fn((command: unknown) => submitted.push(command));
    const viewModel = createClientViewModel();

    expect(viewModel.path.length).toBeGreaterThan(1);
    expect(viewModel.hudRows.map((row) => row.label)).toEqual(['Lives', 'Gold', 'Wave', 'HP']);

    createSubmitBuildCommand(submit)();

    expect(submitted).toHaveLength(1);
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('maps snapshot HUD values into rows in UI order', () => {
    const viewModel = createClientViewModel();

    expect(viewModel.hudRows).toEqual([
      { label: 'Lives', value: '20' },
      { label: 'Gold', value: '12' },
      { label: 'Wave', value: '0' },
      { label: 'HP', value: 'HP' }
    ]);
  });

  it('submits a build-tower command payload', () => {
    const submit = vi.fn();

    createSubmitBuildCommand(submit)();

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'BUILD_TOWER',
        payload: expect.objectContaining({
          slotId: 'slot-1',
          blueprintStackId: 'stack-1',
          towerDefId: 'tower.basic'
        })
      })
    );
  });
});
