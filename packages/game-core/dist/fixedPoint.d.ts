/** Fixed-point scale: 1 real unit = FP_ONE internal units (3 decimal places). */
export declare const FP_ONE = 1000;
/** Convert a plain integer to fixed-point. */
export declare const intToFp: (n: number) => number;
/** Truncate a fixed-point value to its integer part (floor toward zero). */
export declare const fpToInt: (fp: number) => number;
/** Convert fixed-point to a JavaScript float (visuals/debugging only). */
export declare const fpToFloat: (fp: number) => number;
/** Convert a float to the nearest fixed-point value (config init only). */
export declare const fpFromFloat: (n: number) => number;
/** Add two fixed-point values. */
export declare const fpAdd: (a: number, b: number) => number;
/** Subtract two fixed-point values. */
export declare const fpSub: (a: number, b: number) => number;
/**
 * Multiply two fixed-point values.
 * Uses Math.imul for the lower 32 bits to stay integer-safe.
 */
export declare const fpMul: (a: number, b: number) => number;
/**
 * Divide two fixed-point values.
 * Rounds toward nearest integer.
 */
export declare const fpDiv: (a: number, b: number) => number;
/** Floor a fixed-point value down to the nearest integer boundary. */
export declare const fpFloor: (fp: number) => number;
/** Clamp a fixed-point value to [min, max]. */
export declare const fpClamp: (fp: number, min: number, max: number) => number;
//# sourceMappingURL=fixedPoint.d.ts.map