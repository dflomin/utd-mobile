import { describe, expect, it } from 'vitest';
import { ComponentStore, EntityAllocator } from './ecs.js';
import { deserializeStores, serializeStores } from './worldSerialization.js';
describe('serializeStores / deserializeStores', () => {
    it('round-trips an empty world', () => {
        const alloc = new EntityAllocator();
        const hp = new ComponentStore();
        const original = serializeStores(alloc, { hp });
        const { alloc: alloc2, stores } = deserializeStores(original, { hp: () => new ComponentStore() });
        expect(stores.hp.size).toBe(0);
        expect(alloc2.alloc()).toBe(alloc.alloc()); // both allocate the same next ID
    });
    it('round-trips entities with components', () => {
        const alloc = new EntityAllocator();
        const id1 = alloc.alloc();
        const id2 = alloc.alloc();
        const hp = new ComponentStore();
        hp.set(id1, { current: 10, max: 10 });
        hp.set(id2, { current: 5, max: 10 });
        const snapshot = serializeStores(alloc, { hp });
        const { stores } = deserializeStores(snapshot, {
            hp: () => new ComponentStore(),
        });
        expect(stores.hp.get(id1)).toEqual({ current: 10, max: 10 });
        expect(stores.hp.get(id2)).toEqual({ current: 5, max: 10 });
    });
    it('preserves entity alive state across round-trip', () => {
        const alloc = new EntityAllocator();
        const id1 = alloc.alloc();
        const id2 = alloc.alloc();
        alloc.free(id1);
        const snapshot = serializeStores(alloc, {});
        const { alloc: alloc2 } = deserializeStores(snapshot, {});
        expect(alloc2.isAlive(id1)).toBe(false);
        expect(alloc2.isAlive(id2)).toBe(true);
    });
    it('snapshot is JSON-serializable (plain object)', () => {
        const alloc = new EntityAllocator();
        const id = alloc.alloc();
        const pos = new ComponentStore();
        pos.set(id, { x: 10, y: 20 });
        const snapshot = serializeStores(alloc, { pos });
        const json = JSON.stringify(snapshot);
        const parsed = JSON.parse(json);
        const { stores } = deserializeStores(parsed, {
            pos: () => new ComponentStore(),
        });
        expect(stores.pos.get(id)).toEqual({ x: 10, y: 20 });
    });
    it('stateHash is stable across identical worlds', () => {
        const buildWorld = () => {
            const alloc = new EntityAllocator();
            const id = alloc.alloc();
            const hp = new ComponentStore();
            hp.set(id, 42);
            return serializeStores(alloc, { hp });
        };
        expect(buildWorld().stateHash).toBe(buildWorld().stateHash);
    });
    it('stateHash changes when component data changes', () => {
        const buildWorld = (value) => {
            const alloc = new EntityAllocator();
            const id = alloc.alloc();
            const hp = new ComponentStore();
            hp.set(id, value);
            return serializeStores(alloc, { hp }).stateHash;
        };
        expect(buildWorld(10)).not.toBe(buildWorld(20));
    });
});
//# sourceMappingURL=worldSerialization.spec.js.map