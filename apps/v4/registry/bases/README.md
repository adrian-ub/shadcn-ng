# Registry bases

This folder holds **parallel registries** for different component primitives:

- **`radix-ng/`** — Components built on `@radix-ng/primitives`
- **`base/`** — *(future)* Native Angular components without external primitives
- **`aria/`** — *(future)* ARIA-based components using Angular CDK

## Keep patterns consistent

For any shared surface (same block, same card, same example intent), changes should be applied to all relevant bases. Adjust only what must differ: imports and primitive APIs.

> This structure follows [shadcn/ui](https://ui.shadcn.com)'s multi-base registry pattern.
