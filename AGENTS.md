# Repository Guidelines

## Project Structure & Module Organization

- Source code: `src/` (App Router in `src/app/`, UI in `src/components/`, hooks in `src/hooks/`, utilities in `src/utils/`, shared libs in `src/lib/`).
- Static assets: `public/`. Build and ops scripts: `scripts/` (e.g., `build-static.sh`).
- Tests: unit/integration under `src/**/__tests__/` or `src/**/*.{test,spec}.(ts|tsx)`; E2E under `tests/` (Playwright).
- See `PROJECT_STRUCTURE.md` for feature locations (editor, API routes, storage, etc.).

## Build, Test, and Development Commands

- `yarn dev` — Run Next.js dev server at `http://localhost:3000`.
- `yarn build` — Production build. `yarn start` serves the build.
- `yarn build:static` — Static build for S3; handles API route adjustments.
- `yarn lint` / `yarn lint:fix` — ESLint checks and autofix.
- `yarn type-check` — TypeScript type checking (strict mode).
- `yarn format` / `yarn format:check` — Prettier format or verify.
- `yarn test` / `yarn test:watch` / `yarn test:coverage` — Jest unit/integration.
- `yarn test:e2e` / `yarn test:e2e:ui` — Playwright E2E (auto-starts dev server).

## Coding Style & Naming Conventions

- Language: TypeScript, strict; path alias `@/*` → `src/*`.
- Components: PascalCase (`Button.tsx`, `NewUploadModal.tsx`); hooks prefix `use` (`useStore.ts`).
- Utilities and non-components: camelCase (`logger.ts`), re-export via `index.ts` where practical.
- Formatting: Prettier (2 spaces, semver-managed). Linting: ESLint (`next/core-web-vitals`).
- Git hooks: Husky runs lint-staged on commit and `type-check` on push.

## Testing Guidelines

- Frameworks: Jest + Testing Library (jsdom) for unit/integration; Playwright for E2E.
- Name tests as `*.test.tsx`/`*.spec.tsx` or use `__tests__` folders.
- Coverage: generated to `coverage/` via `yarn test:coverage` (thresholds not enforced; keep meaningful coverage for changed code).
- E2E: put specs in `tests/`; prefer stable locators and mock external services when possible.

## Commit & Pull Request Guidelines

- Commit style: use clear prefixes (Feat, Fix, Chore, Refactor, Docs, Test). Example: `Feat: Add clip timeline zoom`.
- PRs: include summary, context/linked issue, screenshots for UI, and testing notes. Ensure `yarn lint`, `yarn type-check`, and tests pass.
- See `PR_AUTOMATION_GUIDE.md` for the `prm` command and workflow.

## Security & Configuration Tips

- Create `.env.local` from `.env.local.example`; never commit secrets. For Docker/local tips and health checks, see `README.md`.
