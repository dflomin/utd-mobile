import { describe, expect, it } from 'vitest';

import { ComponentStore, EntityAllocator } from './ecs.js';

describe('EntityAllocator', () => {
  it('allocates sequential numeric IDs starting at 1', () => {
    const alloc = new EntityAllocator();
    expect(alloc.alloc()).toBe(1);
    expect(alloc.alloc()).toBe(2);
    expect(alloc.alloc()).toBe(3);
  });

  it('free returns IDs to a pool and they are reused before advancing counter', () => {
    const alloc = new EntityAllocator();
    const id1 = alloc.alloc();
    const id2 = alloc.alloc();
    alloc.free(id1);
    expect(alloc.alloc()).toBe(id1);
    expect(alloc.alloc()).toBe(3); // id2 was 2, so next new is 3
    void id2;
  });

  it('isAlive returns true only for allocated IDs', () => {
    const alloc = new EntityAllocator();
    const id = alloc.alloc();
    expect(alloc.isAlive(id)).toBe(true);
    alloc.free(id);
    expect(alloc.isAlive(id)).toBe(false);
  });

  it('reset clears all state', () => {
    const alloc = new EntityAllocator();
    alloc.alloc();
    alloc.alloc();
    alloc.reset();
    expect(alloc.alloc()).toBe(1);
  });
});

describe('ComponentStore', () => {
  it('set and get a component', () => {
    const store = new ComponentStore<{ value: number }>();
    store.set(1, { value: 42 });
    expect(store.get(1)).toEqual({ value: 42 });
  });

  it('get returns undefined for missing entity', () => {
    const store = new ComponentStore<{ x: number }>();
    expect(store.get(99)).toBeUndefined();
  });

  it('has returns true only when component exists', () => {
    const store = new ComponentStore<string>();
    store.set(5, 'hello');
    expect(store.has(5)).toBe(true);
    expect(store.has(6)).toBe(false);
  });

  it('delete removes a component', () => {
    const store = new ComponentStore<number>();
    store.set(1, 100);
    store.delete(1);
    expect(store.has(1)).toBe(false);
  });

  it('entries iterates all components', () => {
    const store = new ComponentStore<number>();
    store.set(1, 10);
    store.set(2, 20);
    store.set(3, 30);
    const result = [...store.entries()];
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([1, 10]);
  });

  it('clear removes all components', () => {
    const store = new ComponentStore<number>();
    store.set(1, 1);
    store.set(2, 2);
    store.clear();
    expect([...store.entries()]).toHaveLength(0);
  });

  it('size returns the number of stored components', () => {
    const store = new ComponentStore<string>();
    expect(store.size).toBe(0);
    store.set(1, 'a');
    store.set(2, 'b');
    expect(store.size).toBe(2);
  });
});
