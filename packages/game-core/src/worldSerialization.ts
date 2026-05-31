import { ComponentStore, EntityAllocator, type EntityId } from './ecs.js';
import { hashValue } from './hash.js';

/** Plain serializable snapshot of a set of named component stores. */
export type WorldSnapshot = {
  readonly nextId: number;
  readonly aliveIds: readonly EntityId[];
  readonly freePool: readonly EntityId[];
  readonly stores: Record<string, Record<string, unknown>>;
  readonly stateHash: string;
};

type StoreMap = Record<string, ComponentStore<unknown>>;
type StoreFactoryMap<T extends StoreMap> = { [K in keyof T]: () => T[K] };

/**
 * Serializes an EntityAllocator and a named map of ComponentStores into a plain JSON-compatible snapshot.
 * The stateHash covers all entity IDs and component data for round-trip verification.
 */
export const serializeStores = <T extends StoreMap>(
  alloc: EntityAllocator,
  stores: T,
): WorldSnapshot => {
  const allocState = (alloc as unknown as { _next: number; _pool: EntityId[]; _alive: Set<EntityId> });
  const nextId = allocState._next;
  const aliveIds = [...allocState._alive].sort((a, b) => a - b);
  const freePool = [...allocState._pool];

  const serializedStores: Record<string, Record<string, unknown>> = {};
  for (const [name, store] of Object.entries(stores)) {
    const storeData: Record<string, unknown> = {};
    for (const [id, component] of (store as ComponentStore<unknown>).entries()) {
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
export const deserializeStores = <T extends StoreMap>(
  snapshot: WorldSnapshot,
  factories: StoreFactoryMap<T>,
): { alloc: EntityAllocator; stores: T } => {
  const alloc = new EntityAllocator();
  const allocState = (alloc as unknown as { _next: number; _pool: EntityId[]; _alive: Set<EntityId> });
  allocState._next = snapshot.nextId;
  allocState._pool = [...snapshot.freePool];
  allocState._alive = new Set(snapshot.aliveIds);

  const stores = {} as T;
  for (const [name, factory] of Object.entries(factories)) {
    const store = factory() as ComponentStore<unknown>;
    const storeData = snapshot.stores[name] ?? {};
    for (const [idStr, component] of Object.entries(storeData)) {
      store.set(Number(idStr) as EntityId, component);
    }
    (stores as Record<string, unknown>)[name] = store;
  }

  return { alloc, stores };
};
