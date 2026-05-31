import { describe, expect, it } from 'vitest';

import {
  FP_ONE,
  fpAdd,
  fpClamp,
  fpDiv,
  fpFloor,
  fpFromFloat,
  fpMul,
  fpSub,
  fpToFloat,
  fpToInt,
  intToFp,
} from './fixedPoint.js';

describe('fixed-point math', () => {
  it('FP_ONE equals 1000', () => {
    expect(FP_ONE).toBe(1000);
  });

  it('intToFp converts integer to fixed-point', () => {
    expect(intToFp(3)).toBe(3000);
    expect(intToFp(0)).toBe(0);
    expect(intToFp(-5)).toBe(-5000);
  });

  it('fpToInt truncates fixed-point to integer', () => {
    expect(fpToInt(3500)).toBe(3);
    expect(fpToInt(3000)).toBe(3);
    expect(fpToInt(999)).toBe(0);
  });

  it('fpToFloat converts to float', () => {
    expect(fpToFloat(3500)).toBeCloseTo(3.5);
    expect(fpToFloat(3000)).toBe(3.0);
  });

  it('fpFromFloat converts float to nearest fixed-point', () => {
    expect(fpFromFloat(1.5)).toBe(1500);
    expect(fpFromFloat(3.0)).toBe(3000);
    expect(fpFromFloat(0.1)).toBe(100);
  });

  it('fpAdd adds two fixed-point values', () => {
    expect(fpAdd(1500, 500)).toBe(2000);
    expect(fpAdd(0, 1000)).toBe(1000);
  });

  it('fpSub subtracts two fixed-point values', () => {
    expect(fpSub(2000, 500)).toBe(1500);
    expect(fpSub(1000, 1000)).toBe(0);
  });

  it('fpMul multiplies two fixed-point values', () => {
    expect(fpMul(2000, 1500)).toBe(3000); // 2.0 * 1.5 = 3.0
    expect(fpMul(1000, 1000)).toBe(1000); // 1.0 * 1.0 = 1.0
    expect(fpMul(3000, 500)).toBe(1500);  // 3.0 * 0.5 = 1.5
  });

  it('fpDiv divides two fixed-point values', () => {
    expect(fpDiv(3000, 2000)).toBe(1500); // 3.0 / 2.0 = 1.5
    expect(fpDiv(6000, 3000)).toBe(2000); // 6.0 / 3.0 = 2.0
  });

  it('fpFloor rounds down to integer fixed-point', () => {
    expect(fpFloor(1500)).toBe(1000); // floor(1.5) = 1.0
    expect(fpFloor(3000)).toBe(3000); // floor(3.0) = 3.0
    expect(fpFloor(999)).toBe(0);     // floor(0.999) = 0.0
  });

  it('fpClamp clamps to min/max range', () => {
    expect(fpClamp(500, 1000, 3000)).toBe(1000);  // below min
    expect(fpClamp(4000, 1000, 3000)).toBe(3000); // above max
    expect(fpClamp(2000, 1000, 3000)).toBe(2000); // within range
  });

  it('multiplication is associative for integer inputs', () => {
    const a = intToFp(6);
    const b = intToFp(7);
    expect(fpToInt(fpMul(a, b))).toBe(42);
  });
});
