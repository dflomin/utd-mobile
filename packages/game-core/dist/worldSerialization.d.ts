import { ComponentStore, EntityAllocator, type EntityId } from './ecs.js';
/** Plain serializable snapshot of a set of named component stores. */
export type WorldSnapshot = {
    readonly nextId: number;
    readonly aliveIds: readonly EntityId[];
    readonly freePool: readonly EntityId[];
    readonly stores: Record<string, Record<string, unknown>>;
    readonly stateHash: string;
};
type StoreMap = Record<string, ComponentStore<unknown>>;
type StoreFactoryMap<T extends StoreMap> = {
    [K in keyof T]: () => T[K];
};
/**
 * Serializes an EntityAllocator and a named map of ComponentStores into a plain JSON-compatible snapshot.
 * The stateHash covers all entity IDs and component data for round-trip verification.
 */
export declare const serializeStores: <T extends StoreMap>(alloc: EntityAllocator, stores: T) => WorldSnapshot;
/**
 * Reconstructs an EntityAllocator and named ComponentStores from a WorldSnapshot.
 * The caller supplies factory functions to create fresh store instances of the correct type.
 */
export declare const deserializeStores: <T extends StoreMap>(snapshot: WorldSnapshot, factories: StoreFactoryMap<T>) => {
    alloc: EntityAllocator;
    stores: T;
};
export {};
//# sourceMappingURL=worldSerialization.d.ts.map