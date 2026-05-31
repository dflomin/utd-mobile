/** Fixed-point scale: 1 real unit = FP_ONE internal units (3 decimal places). */
export const FP_ONE = 1000;
/** Convert a plain integer to fixed-point. */
export const intToFp = (n) => n * FP_ONE;
/** Truncate a fixed-point value to its integer part (floor toward zero). */
export const fpToInt = (fp) => Math.trunc(fp / FP_ONE);
/** Convert fixed-point to a JavaScript float (visuals/debugging only). */
export const fpToFloat = (fp) => fp / FP_ONE;
/** Convert a float to the nearest fixed-point value (config init only). */
export const fpFromFloat = (n) => Math.round(n * FP_ONE);
/** Add two fixed-point values. */
export const fpAdd = (a, b) => a + b;
/** Subtract two fixed-point values. */
export const fpSub = (a, b) => a - b;
/**
 * Multiply two fixed-point values.
 * Uses Math.imul for the lower 32 bits to stay integer-safe.
 */
export const fpMul = (a, b) => Math.round((a * b) / FP_ONE);
/**
 * Divide two fixed-point values.
 * Rounds toward nearest integer.
 */
export const fpDiv = (a, b) => Math.round((a * FP_ONE) / b);
/** Floor a fixed-point value down to the nearest integer boundary. */
export const fpFloor = (fp) => Math.floor(fp / FP_ONE) * FP_ONE;
/** Clamp a fixed-point value to [min, max]. */
export const fpClamp = (fp, min, max) => fp < min ? min : fp > max ? max : fp;
//# sourceMappingURL=fixedPoint.js.map