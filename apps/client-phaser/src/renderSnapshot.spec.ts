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
});
