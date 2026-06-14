**Task:** "Deep clone this object."

## Without Needless

```ts
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date((obj as Date).getTime()) as unknown as T;
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags) as unknown as T;
  if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;

  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}
```

15 lines, misses `Map`, `Set`, `ArrayBuffer`, and circular references. Each
missed type is a bug waiting for the right data to trigger it.

## With Needless

```ts
// needless: native, handles circular refs, Map, Set, ArrayBuffer, and more
structuredClone(obj)
```

**15 lines -> 1 line.** `structuredClone` is available in Node 17+, all
modern browsers, and Deno. It handles every structured-cloneable type
correctly and throws a clear error on the ones it cannot clone -- instead of
silently producing wrong output.
