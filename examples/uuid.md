**Task:** "Generate a unique ID for this record."

## Without Needless

```bash
npm install uuid
```

```ts
import { v4 as uuidv4 } from 'uuid';

class IdGenerator {
  private prefix: string;

  constructor(prefix = '') {
    this.prefix = prefix;
  }

  generate(): string {
    return this.prefix ? `${this.prefix}-${uuidv4()}` : uuidv4();
  }
}

export const idGenerator = new IdGenerator();

export function generateId(prefix?: string): string {
  return new IdGenerator(prefix).generate();
}
```

1 dependency, 1 class, 1 wrapper function, a constructor, and an exported
singleton -- to generate a UUID.

## With Needless

```ts
// needless: browser and Node 14.17+ have this built in
crypto.randomUUID()
```

**1 dependency + 20 lines -> 0 dependencies + 1 line.** `crypto.randomUUID()`
is available in every modern browser and Node 14.17+. No install, no class,
no wrapper. The runtime already did the work.
