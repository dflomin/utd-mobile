declare const STREAMS: readonly ["blueprints", "rerolls", "items", "potions", "waves", "combat", "events"];
type StreamName = (typeof STREAMS)[number];
export type RngStreams = Record<StreamName, number>;
export declare const createRngStreams: (seed: number) => RngStreams;
export declare const nextRandom: (streams: RngStreams, stream: StreamName) => number;
export {};
//# sourceMappingURL=rng.d.ts.map