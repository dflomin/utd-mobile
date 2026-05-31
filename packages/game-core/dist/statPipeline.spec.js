import { describe, expect, it } from 'vitest';
import { intToFp } from './fixedPoint.js';
import { resolveStats } from './statPipeline.js';
describe('resolveStats', () => {
    it('returns base value when no modifiers present', () => {
        expect(resolveStats(intToFp(10), [])).toBe(intToFp(10));
    });
    it('applies FLAT_ADD modifiers summed together', () => {
        const result = resolveStats(intToFp(10), [
            { op: 'FLAT_ADD', value: intToFp(3) },
            { op: 'FLAT_ADD', value: intToFp(2) },
        ]);
        expect(result).toBe(intToFp(15));
    });
    it('applies PERCENT_ADD after flat add (percent of base+flat)', () => {
        // base=10, flat+2 => 12, then +50% => 12 * 1.5 = 18
        const result = resolveStats(intToFp(10), [
            { op: 'FLAT_ADD', value: intToFp(2) },
            { op: 'PERCENT_ADD', value: intToFp(50) }, // 50%
        ]);
        expect(result).toBe(intToFp(18));
    });
    it('applies MULTIPLY after percent-add stage', () => {
        // base=10, flat=0, percent=0, multiply by 2.0 => 20
        const result = resolveStats(intToFp(10), [
            { op: 'MULTIPLY', value: intToFp(2) }, // x2
        ]);
        expect(result).toBe(intToFp(20));
    });
    it('applies MIN_CAP as a floor', () => {
        // base=5, min cap=10 => result must be at least 10
        const result = resolveStats(intToFp(5), [
            { op: 'MIN_CAP', value: intToFp(10) },
        ]);
        expect(result).toBe(intToFp(10));
    });
    it('MIN_CAP does not raise a value already above it', () => {
        const result = resolveStats(intToFp(15), [
            { op: 'MIN_CAP', value: intToFp(10) },
        ]);
        expect(result).toBe(intToFp(15));
    });
    it('applies MAX_CAP as a ceiling', () => {
        // base=20, max cap=15 => result must be at most 15
        const result = resolveStats(intToFp(20), [
            { op: 'MAX_CAP', value: intToFp(15) },
        ]);
        expect(result).toBe(intToFp(15));
    });
    it('OVERRIDE replaces all prior computation', () => {
        const result = resolveStats(intToFp(10), [
            { op: 'FLAT_ADD', value: intToFp(5) },
            { op: 'OVERRIDE', value: intToFp(99) },
        ]);
        expect(result).toBe(intToFp(99));
    });
    it('multiple PERCENT_ADD values stack additively before applying', () => {
        // base=100, +10% +20% => effectively +30% => 130
        const result = resolveStats(intToFp(100), [
            { op: 'PERCENT_ADD', value: intToFp(10) },
            { op: 'PERCENT_ADD', value: intToFp(20) },
        ]);
        expect(result).toBe(intToFp(130));
    });
    it('follows spec stage order: flat -> percent -> multiply -> caps -> override', () => {
        // base=10, +5flat=15, +100%=30, x2=60, min cap=1, max cap=50 => 50
        const result = resolveStats(intToFp(10), [
            { op: 'FLAT_ADD', value: intToFp(5) },
            { op: 'PERCENT_ADD', value: intToFp(100) },
            { op: 'MULTIPLY', value: intToFp(2) },
            { op: 'MIN_CAP', value: intToFp(1) },
            { op: 'MAX_CAP', value: intToFp(50) },
        ]);
        expect(result).toBe(intToFp(50));
    });
});
//# sourceMappingURL=statPipeline.spec.js.map