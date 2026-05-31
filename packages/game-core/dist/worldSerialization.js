import { EntityAllocator } from './ecs.js';
import { hashValue } from './hash.js';
/**
 * Serializes an EntityAllocator and a named map of ComponentStores into a plain JSON-compatible snapshot.
 * The stateHash covers all entity IDs and component data for round-trip verification.
 */
export const serializeStores = (alloc, stores) => {
    const allocState = alloc;
    const nextId = allocState._next;
    const aliveIds = [...allocState._alive].sort((a, b) => a - b);
    const freePool = [...allocState._pool];
    const serializedStores = {};
    for (const [name, store] of Object.entries(stores)) {
        const storeData = {};
        for (const [id, component] of store.entries()) {
            storeData[String(id)] = component;
        }
        serializedStores[name] = storeData;
    }
    const stateHash = hashValue({ nextId, aliveIds, stores: serializedStores });
    return { nextId, aliveIds, freePool, stores: serializedStores, stateHash };
};
/**
 * Reconstructs an EntityAllocator and named ComponentStores from a WorldSnapshot.
 * The caller supplies factory functions to create fresh store instances of the correct type.
 */
export const deserializeStores = (snapshot, factories) => {
    const alloc = new EntityAllocator();
    const allocState = alloc;
    allocState._next = snapshot.nextId;
    allocState._pool = [...snapshot.freePool];
    allocState._alive = new Set(snapshot.aliveIds);
    const stores = {};
    for (const [name, factory] of Object.entries(factories)) {
        const store = factory();
        const storeData = snapshot.stores[name] ?? {};
        for (const [idStr, component] of Object.entries(storeData)) {
            store.set(Number(idStr), component);
        }
        stores[name] = store;
    }
    return { alloc, stores };
};
//# sourceMappingURL=worldSerialization.js.map