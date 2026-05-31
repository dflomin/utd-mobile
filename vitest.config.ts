import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const fromRoot = (relativePath: string): string => {
  return fileURLToPath(new URL(relativePath, import.meta.url));
};

export default defineConfig({
  resolve: {
    alias: {
      '@utd/shared-types': fromRoot('./packages/shared-types/src/index.ts'),
      '@utd/localization': fromRoot('./packages/localization/src/index.ts'),
      '@utd/content-config': fromRoot('./packages/content-config/src/index.ts'),
      '@utd/telemetry': fromRoot('./packages/telemetry/src/index.ts'),
      '@utd/game-core': fromRoot('./packages/game-core/src/index.ts')
    }
  },
  test: {
    include: ['apps/**/*.spec.ts', 'packages/**/*.spec.ts'],
    exclude: ['**/dist/**']
  }
});
