/** Null sentinel for "no entity". */
export const NULL_ENTITY = 0;
/**
 * Allocates and frees numeric entity IDs.
 * Freed IDs are pooled and reused before the counter advances.
 */
export class EntityAllocator {
    _next = 1;
    _pool = [];
    _alive = new Set();
    alloc() {
        const id = this._pool.length > 0 ? this._pool.pop() : this._next++;
        this._alive.add(id);
        return id;
    }
    free(id) {
        if (!this._alive.has(id))
            return;
        this._alive.delete(id);
        this._pool.push(id);
    }
    isAlive(id) {
        return this._alive.has(id);
    }
    reset() {
        this._next = 1;
        this._pool = [];
        this._alive.clear();
    }
}
/**
 * Generic component store backed by a Map.
 * Components must be plain serializable objects.
 */
export class ComponentStore {
    _data = new Map();
    get(id) {
        return this._data.get(id);
    }
    set(id, component) {
        this._data.set(id, component);
    }
    has(id) {
        return this._data.has(id);
    }
    delete(id) {
        this._data.delete(id);
    }
    entries() {
        return this._data.entries();
    }
    get size() {
        return this._data.size;
    }
    clear() {
        this._data.clear();
    }
}
//# sourceMappingURL=ecs.js.map