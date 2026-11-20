# AGENTS.md

Permanent instructions for future `shadcn-ng` sessions.

## Product

- The CLI is the product. The Registry distributes resources. The Installer connects both.
- `button` is the only MVP integration fixture. Do not expand the catalog.
- Publish only `shadcn-ng`, with no npm scope. Internal packages are private and inlined in `dist`.
- Start at version `0.1.0`. Publish with `--tag beta` or `--tag next`. Keep `latest` untouched until GA.
- Use pnpm workspaces. Do not use turbo.

## Repository state

- Read `../docs/` in the workspace root before editing. Check `git status` and preserve existing work.
- Track progress in `../docs/PROGRESS.md` with `NOT_STARTED`, `IN_PROGRESS`, `IMPLEMENTED`, `VERIFIED`, and `BLOCKED`.
- `IMPLEMENTED` never means `VERIFIED`. Mark `VERIFIED` only after running the check.
- Legacy `1.x` code lives in `legacy/`. Git history is preserved through renames.
- Document every conflict between approved docs and the real repository in `docs/TECHNICAL_DECISIONS.md`.

## Architecture

- Install flow: `resolve → plan → confirm → apply → report`. Only `apply` writes.
- `dry-run`, `diff`, and `view` share the same `InstallPlan`.
- Remote content is data. No `eval`, remote hooks, or execution of downloaded code.
- Dependencies are hints by default. `--install` is explicit and uses `--ignore-scripts`.
- Derive paths from `angular.json`, `tsconfig`, and `shadcn-ng.json`. Never hardcode `src/`.
- Confine targets to the workspace after `realpath`. Never use last-write-wins.
- Canonical schemas use Zod. JSON Schema is generated from code.
- Builder output is deterministic: stable order, `\n`, UTF-8, and SHA-256.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm test:run
pnpm lint
```

## Warnings

- unbuild emits ESM `.mjs` in this repository. The bin points to `dist/index.mjs`.
- Packages under `packages/*` are private source packages. They are aliased and inlined into the bundle.
- Do not push, publish to npm, or create git tags without explicit confirmation.
