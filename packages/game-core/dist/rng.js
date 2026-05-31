const STREAMS = ['blueprints', 'rerolls', 'items', 'potions', 'waves', 'combat', 'events'];
const hashSeed = (seed, label) => {
    let value = seed ^ 0x9e3779b9;
    for (const character of label) {
        value = Math.imul(value ^ character.charCodeAt(0), 1664525) + 1013904223;
    }
    return value >>> 0;
};
export const createRngStreams = (seed) => {
    return Object.fromEntries(STREAMS.map((stream) => [stream, hashSeed(seed, stream)]));
};
export const nextRandom = (streams, stream) => {
    const next = (Math.imul(streams[stream], 1664525) + 1013904223) >>> 0;
    streams[stream] = next;
    return next / 0xffffffff;
};
//# sourceMappingURL=rng.js.map