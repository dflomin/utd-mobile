/** Numeric entity ID. Starts at 1; 0 is the null/invalid sentinel. */
export type EntityId = number;
/** Null sentinel for "no entity". */
export declare const NULL_ENTITY: EntityId;
/**
 * Allocates and frees numeric entity IDs.
 * Freed IDs are pooled and reused before the counter advances.
 */
export declare class EntityAllocator {
    private _next;
    private _pool;
    private _alive;
    alloc(): EntityId;
    free(id: EntityId): void;
    isAlive(id: EntityId): boolean;
    reset(): void;
}
/**
 * Generic component store backed by a Map.
 * Components must be plain serializable objects.
 */
export declare class ComponentStore<T> {
    private _data;
    get(id: EntityId): T | undefined;
    set(id: EntityId, component: T): void;
    has(id: EntityId): boolean;
    delete(id: EntityId): void;
    entries(): IterableIterator<[EntityId, T]>;
    get size(): number;
    clear(): void;
}
//# sourceMappingURL=ecs.d.ts.map