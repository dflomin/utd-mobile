import { describe, expect, it } from 'vitest';
import { createContentConfig, validateContentConfig } from './index.js';
describe('validateContentConfig', () => {
    it('accepts the placeholder configuration and rejects broken references', () => {
        expect(validateContentConfig(createContentConfig())).toEqual([]);
        const broken = createContentConfig();
        const invalid = {
            ...broken,
            waves: [{ ...broken.waves[0], enemyId: 'missing-enemy' }]
        };
        expect(validateContentConfig(invalid)).toContain('waves[0].enemyId');
    });
});
//# sourceMappingURL=index.spec.js.map