import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const collectFiles = (dir: string): string[] => {
  return readdirSync(dir).flatMap((entry) => {
    const file = join(dir, entry);
    return statSync(file).isDirectory() ? collectFiles(file) : [file];
  });
};

describe('game-core boundaries', () => {
  it('does not import renderer or mobile runtime globals', () => {
    const root = new URL('.', import.meta.url).pathname;
    const files = collectFiles(root).filter((file) => file.endsWith('.ts'));

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      expect(source).not.toMatch(/from ['"]phaser['"]/);
      expect(source).not.toMatch(/from ['"]@capacitor/);
      expect(source).not.toMatch(/document\./);
      expect(source).not.toMatch(/window\./);
    }
  });
});
