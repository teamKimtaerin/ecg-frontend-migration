# Repository Guidelines

## Project Structure & Module Organization

- Source code: `src/` — Next.js App Router in `src/app/`, UI in `src/components/`, hooks in `src/hooks/`, utilities in `src/utils/`, shared libs in `src/lib/`.
- Static assets: `public/`. Scripts: `scripts/` (e.g., `scripts/build-static.sh`).
- Tests: unit/integration under `src/**/__tests__/` or `src/**/*.{test,spec}.(ts|tsx)`; E2E in `tests/` (Playwright).

## Build, Test, and Development Commands

- `yarn dev` — Start Next.js dev server at `http://localhost:3000`.
- `yarn build` / `yarn start` — Production build and serve.
- `yarn build:static` — Static build for S3; adjusts API routes.
- `yarn lint` / `yarn lint:fix` — ESLint check and autofix.
- `yarn type-check` — TypeScript strict type checking.
- `yarn format` / `yarn format:check` — Prettier format or verify.
- `yarn test` / `yarn test:watch` / `yarn test:coverage` — Jest unit/integration.
- `yarn test:e2e` / `yarn test:e2e:ui` — Playwright E2E (auto-starts dev server).

## Coding Style & Naming Conventions

- Language: TypeScript (strict). Path alias `@/*` → `src/*`.
- Components: PascalCase (e.g., `NewUploadModal.tsx`). Hooks: `use*` (e.g., `useStore.ts`). Utilities/non-components: camelCase (e.g., `logger.ts`). Re-export via `index.ts` when practical.
- Lint: ESLint (`next/core-web-vitals`). Format: Prettier (2 spaces). Husky runs lint-staged on commit and `type-check` on push.

## Testing Guidelines

- Frameworks: Jest + Testing Library (jsdom) for unit/integration; Playwright for E2E.
- Name tests `*.test.tsx`/`*.spec.tsx` or place in `__tests__/`.
- Run coverage with `yarn test:coverage` (outputs to `coverage/`; keep meaningful coverage for changed code).

## Commit & Pull Request Guidelines

- Commits: use clear prefixes — Feat, Fix, Chore, Refactor, Docs, Test. Example: `Feat: Add clip timeline zoom`.
- PRs: include summary, context/linked issue, screenshots for UI, and testing notes.
- Ensure `yarn lint`, `yarn type-check`, and tests pass. Prefer small, focused changes matching existing patterns.

## Security & Configuration Tips

- Create `.env.local` from `.env.local.example`; never commit secrets.
- See `README.md` for Docker/local tips and health checks.
- Prefer repository scripts over ad-hoc commands; avoid introducing new build tools without discussion.
