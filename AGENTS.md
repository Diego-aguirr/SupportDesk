# AGENTS.md — SupportDesk

## Project Overview

**Name**: SupportDesk
**Type**: Support ticket management system (Zendesk-lite)
**Repository**: git@github.com:Diego-aguirr/SupportDesk.git
**Branch Strategy**: feature-branch-chain (chained PRs)
**Working Branch**: feature/supportdesk

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18+ |
| Language | TypeScript | 5.x (strict mode) |
| Build Tool | Vite | 8.x |
| State Management | Redux Toolkit | — |
| Server State | RTK Query | — |
| Styling | Tailwind CSS | v4 |
| Mock API | MSW | v2 |
| Fake Data | Faker.js | — |
| Forms | react-hook-form + Zod | v4 |
| Charts | Recharts | — |
| Drag & Drop | @dnd-kit | — |
| Notifications | Sonner | — |
| Keyboard Shortcuts | react-hotkeys-hook | — |
| Routing | react-router-dom | v7 |
| Testing | Vitest + Testing Library | — |

## Project Architecture

```
src/
├── app/                    # Store configuration, routes, App shell
│   ├── store.ts            # Redux store (auth, settings, RTK Query APIs)
│   └── routes.tsx          # Lazy-loaded routes with ProtectedRoute
├── features/               # Feature-based module structure
│   ├── auth/               # Authentication: login, authSlice, authApi
│   ├── tickets/            # Tickets: API, list, filters, table, detail, comments
│   ├── dashboard/          # Dashboard: API, stat cards, charts (pie, bar, line)
│   ├── settings/           # Settings: theme selector, keyboard shortcuts
│   └── shared/             # Reusable components: SearchInput, Pagination
├── components/layout/      # App shell: Sidebar, Header, AppLayout
├── hooks/                  # Typed Redux hooks, useDebounce
├── mocks/                  # MSW handlers, faker data generators
│   ├── browser.ts          # MSW service worker setup
│   ├── handlers/           # API endpoint handlers (auth, tickets, dashboard, settings)
│   └── data/               # Faker-generated users and tickets
├── types/                  # TypeScript interfaces and type aliases
└── lib/                    # Utilities (cn, formatDate) and constants
```

## Development Workflow

### Delivery Strategy

- **PR Model**: Chained PRs with feature-branch-chain
- **Each PR** builds on the previous one
- **Only the final branch** merges to main
- **User approves** before any push to remote

### PR Progress

| PR | Branch | Status | Description |
|----|--------|--------|-------------|
| PR 1 | feature/supportdesk | ✅ Merged | Foundation: Vite, types, utils, constants |
| PR 2 | feature/supportdesk | ✅ Merged | Mock API: MSW handlers, faker data |
| PR 3 | feature/supportdesk | ✅ Merged | Auth: store, slices, API, login, routing |
| PR 4 | pr/ticket-table | ✅ Pushed | Tickets: table, filters, search, pagination |
| PR 4b | pr/ticket-detail | ✅ Pushed | Ticket detail: info, comments, activity log |
| PR 5 | pr/dashboard-settings | ✅ Pushed | Dashboard charts + Settings theme/shortcuts |
| PR 6 | pr/app-shell | ✅ Pushed | Sidebar navigation, header, responsive layout |
| PR 7 | pr/tests-polish | ✅ Pushed | Tests, type fixes, dead code cleanup, README |

### Code Review Protocol

1. Developer creates branch and commits changes
2. Developer pushes branch to remote (after user approval)
3. User reviews and merges manually
4. No automated merges without explicit approval

## Coding Conventions

### Language

- **Code**: English (identifiers, comments, UI copy)
- **Communication**: Spanish (user preference)
- **Documentation**: English

### TypeScript

- Strict mode enabled
- No `any` types
- Path aliases: `@/*` → `src/*`
- Types imported from `@/types`

### Styling

- Tailwind CSS v4 utility classes
- CSS variables via `var(--color-*)` for theme tokens
- Dark mode: `.dark` class on `<html>`

### State Management

| Layer | Tool | Purpose |
|-------|------|---------|
| Server cache | RTK Query | API data, automatic cache invalidation |
| Client state | Redux Toolkit slices | Auth, settings, UI state |
| Side effects | RTK `listenerMiddleware` | Auth persistence, theme application |
| URL state | `useSearchParams` | Filters, pagination, search |
| Form state | react-hook-form | Login, comment forms |

### Component Patterns

- Named exports for components, default exports for pages
- Feature-based folder structure
- Each feature owns its API, components, and state
- RTK Query hooks: `use<Operation><Query|Mutation>`

## Key Technical Decisions

1. **MSW + Faker.js** — Dynamic mock data, realistic on every load, removable when real backend arrives
2. **URL-driven filters** — Bookmarkable, shareable, back-button compatible
3. **RTK Query for all API** — Automatic caching, optimistic updates, tag-based invalidation
4. **Feature-based folders** — Each screen is self-contained with its own API
5. **Tailwind v4 with @theme inline** — CSS variables for dynamic theming
6. **Zod v4** — Schema validation with `z.email()` syntax
7. **Sonner** — Lighter than react-toastify, better TypeScript support
8. **@dnd-kit** — Better accessibility than react-beautiful-dnd
9. **`listenerMiddleware`** — Reducers stay pure; side effects (localStorage, DOM) handled by RTK listener middleware

## Testing

- **Unit tests**: `npm run test` (Vitest)
- **Test files**: Co-located with source (`*.test.ts`)
- **Coverage**: utils, authSlice
- **TDD mode**: Disabled (current phase)

## User Preferences

- Wants to understand every component and architectural decision
- Prefers to see changes live in the browser before proceeding
- Expects explanations in Spanish, code in English
- Requires approval before any git push
- Values simplicity over complexity
- Treats this as a learning experience, not just code delivery
