/** Numeric entity ID. Starts at 1; 0 is the null/invalid sentinel. */
export type EntityId = number;

/** Null sentinel for "no entity". */
export const NULL_ENTITY: EntityId = 0;

/**
 * Allocates and frees numeric entity IDs.
 * Freed IDs are pooled and reused before the counter advances.
 */
export class EntityAllocator {
  private _next = 1;
  private _pool: EntityId[] = [];
  private _alive = new Set<EntityId>();

  alloc(): EntityId {
    const id = this._pool.length > 0 ? (this._pool.pop() as EntityId) : this._next++;
    this._alive.add(id);
    return id;
  }

  free(id: EntityId): void {
    if (!this._alive.has(id)) return;
    this._alive.delete(id);
    this._pool.push(id);
  }

  isAlive(id: EntityId): boolean {
    return this._alive.has(id);
  }

  reset(): void {
    this._next = 1;
    this._pool = [];
    this._alive.clear();
  }
}

/**
 * Generic component store backed by a Map.
 * Components must be plain serializable objects.
 */
export class ComponentStore<T> {
  private _data = new Map<EntityId, T>();

  get(id: EntityId): T | undefined {
    return this._data.get(id);
  }

  set(id: EntityId, component: T): void {
    this._data.set(id, component);
  }

  has(id: EntityId): boolean {
    return this._data.has(id);
  }

  delete(id: EntityId): void {
    this._data.delete(id);
  }

  entries(): IterableIterator<[EntityId, T]> {
    return this._data.entries();
  }

  get size(): number {
    return this._data.size;
  }

  clear(): void {
    this._data.clear();
  }
}
