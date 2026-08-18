# AGENTS.md — SupportDesk

## Project Identity

**Name**: SupportDesk
**Type**: Support ticket management system (Zendesk-lite)
**Path**: /home/clyde/Documentos/react2
**Repo**: git@github.com:Diego-aguirr/SupportDesk.git
**Branch**: feature/supportdesk (feature-branch-chain)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18+ with TypeScript |
| Build | Vite v8 |
| State | Redux Toolkit + RTK Query |
| Styling | Tailwind CSS v4 |
| Mock API | MSW v2 + Faker.js |
| Forms | react-hook-form + Zod v4 |
| Charts | Recharts |
| Drag & Drop | @dnd-kit |
| Notifications | Sonner |
| Keyboard | react-hotkeys-hook |
| Routing | react-router-dom v7 |
| Testing | Vitest + Testing Library |

## Architecture

```
src/
├── app/                    # Store, routes, App shell
│   ├── store.ts            # Redux store (auth, settings, APIs)
│   └── routes.tsx          # Lazy-loaded routes + ProtectedRoute
├── features/               # Feature-based structure
│   ├── auth/               # Login, authSlice, authApi
│   ├── tickets/            # ticketsApi, TicketListPage, filters, table, detail
│   ├── dashboard/          # dashboardApi, charts, stats
│   ├── settings/           # settingsSlice, theme, shortcuts
│   └── shared/             # Reusable: SearchInput, Pagination, ConfirmDialog
├── hooks/                  # useAppDispatch, useAppSelector, useDebounce
├── mocks/                  # MSW handlers + faker data
│   ├── browser.ts          # setupWorker
│   ├── handlers/           # auth, tickets, dashboard, settings
│   └── data/               # users.ts, tickets.ts
├── types/                  # All TypeScript interfaces
└── lib/                    # utils.ts (cn, formatDate), constants.ts
```

## How We Work

### Delivery Strategy
- **Chained PRs** with feature-branch-chain
- Each PR builds on the previous one
- Only the final branch merges to main
- User wants to see EVERY component mounted and explained one by one

### Teaching Approach
- **Component by component**: create one, explain it, user sees it in browser, then next
- Explain WHY each piece exists, not just WHAT it does
- User wants to understand the architecture deeply
- Never skip explanations — user is learning

### PR Progress
| PR | Status | Description |
|----|--------|-------------|
| PR 1 | ✅ Done | Foundation: Vite, types, utils, constants |
| PR 2 | ✅ Done | Mock API: MSW handlers, faker data |
| PR 3 | ✅ Done | Auth: store, slices, API, login page, routing |
| PR 4 | 🔲 Pending | Tickets: list, filters, table, pagination, detail |
| PR 5 | 🔲 Pending | Dashboard + Settings |
| PR 6 | 🔲 Pending | App shell, integration, tests |

### SDD Workflow
- Persistence: hybrid (openspec + engram)
- Execution mode: interactive (pause between phases)
- Review budget: 400 lines

## Key Decisions

1. **MSW + Faker.js** over static JSON — dynamic data, realistic every load
2. **URL-driven filters** — bookmarkable, shareable, back-button works
3. **RTK Query for all API** — automatic caching, optimistic updates
4. **Feature-based folders** — each screen is a feature with its own API
5. **Tailwind v4** with `@theme inline` — CSS variables for theming
6. **Zod v4** for validation — `z.email()` instead of `z.string().email()`
7. **Sonner** over react-toastify — lighter, better TypeScript
8. **@dnd-kit** over react-beautiful-dnd — better accessibility

## Coding Conventions

- All code in English (identifiers, comments, UI copy)
- Path aliases: `@/*` → `src/*`
- Tailwind utility classes for styling
- CSS variables via `var(--color-*)` for theme tokens
- Export named exports for components, default for pages
- RTK Query hooks: `use<Operation><Query|Mutation>`
- Types imported from `@/types`
- No `any` types — strict TypeScript

## Testing (when enabled)

- Unit tests: `npx vitest`
- Component tests: `@testing-library/react`
- Integration tests: MSW + Testing Library
- TDD mode: disabled (current phase)

## User Preferences

- Wants to understand EVERYTHING — no magic, no skipping
- Prefers to see changes live in browser
- Spanish speaker — explain in Spanish when chatting
- Code/artifacts in English
- Frustrated by unnecessary complexity — keep it simple
- Wants to be treated as a student, not a client
