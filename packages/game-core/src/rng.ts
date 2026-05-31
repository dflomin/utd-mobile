const STREAMS = ['blueprints', 'rerolls', 'items', 'potions', 'waves', 'combat', 'events'] as const;

type StreamName = (typeof STREAMS)[number];
export type RngStreams = Record<StreamName, number>;

const hashSeed = (seed: number, label: string): number => {
  let value = seed ^ 0x9e3779b9;
  for (const character of label) {
    value = Math.imul(value ^ character.charCodeAt(0), 1664525) + 1013904223;
  }
  return value >>> 0;
};

export const createRngStreams = (seed: number): RngStreams => {
  return Object.fromEntries(STREAMS.map((stream) => [stream, hashSeed(seed, stream)])) as RngStreams;
};

export const nextRandom = (streams: RngStreams, stream: StreamName): number => {
  const next = (Math.imul(streams[stream], 1664525) + 1013904223) >>> 0;
  streams[stream] = next;
  return next / 0xffffffff;
};
