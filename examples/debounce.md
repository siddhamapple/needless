**Task:** "Debounce this search input so it doesn't fire on every keystroke."

## Without Needless

```ts
class Debounce<T extends (...args: any[]) => any> {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private lastArgs: Parameters<T> | null = null;

  constructor(private fn: T, private delay: number) {}

  call(...args: Parameters<T>): void {
    this.lastArgs = args;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fn(...(this.lastArgs as Parameters<T>));
      this.timer = null;
    }, this.delay);
  }

  cancel(): void {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
  }

  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.fn(...(this.lastArgs as Parameters<T>));
      this.timer = null;
    }
  }
}

const debouncedSearch = new Debounce(search, 300);
input.addEventListener('input', e => debouncedSearch.call(e.target.value));
```

`cancel` and `flush` were added because a class felt incomplete without them.
Neither is called anywhere in the codebase.

## With Needless

```ts
// needless: cancel/flush added if someone actually asks for them
let t: ReturnType<typeof setTimeout>;
const debouncedSearch = (v: string) => { clearTimeout(t); t = setTimeout(() => search(v), 300); };
input.addEventListener('input', e => debouncedSearch((e.target as HTMLInputElement).value));
```

**32 lines -> 3 lines.** A closure is a debounce. The class adds two methods
nobody called and a generic nobody needed.
