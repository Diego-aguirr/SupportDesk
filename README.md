# SupportDesk

Support ticket management system built with React 18, TypeScript, Redux Toolkit, RTK Query, and MSW. Simulates a Zendesk-lite with full CRUD, filtering, pagination, drag & drop, charts, and keyboard shortcuts.

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
├── features/               # Feature-based structure
│   ├── auth/               # Login, authSlice, authApi
│   ├── tickets/            # ticketsApi, TicketListPage, filters, table, detail
│   ├── dashboard/          # dashboardApi, charts, stats
│   ├── settings/           # settingsSlice, theme, shortcuts
│   └── shared/             # Reusable: SearchInput, Pagination
├── components/layout/      # Sidebar, Header, AppLayout
├── hooks/                  # useAppDispatch, useAppSelector, useDebounce
├── mocks/                  # MSW handlers + faker data
├── types/                  # All TypeScript interfaces
└── lib/                    # utils.ts, constants.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
git clone git@github.com:Diego-aguirr/SupportDesk.git
cd SupportDesk
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Credentials

Click the **Admin** or **Agent** chip on the login page to autofill credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@supportdesk.com | password123 |
| Agent | agent@supportdesk.com | password123 |

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
npm run test
```

## Features

- **Authentication** — Login/logout simulation with role-based access (admin/agent)
- **Ticket Management** — Full CRUD with 37 dynamically generated tickets
- **Advanced Filtering** — Filter by status, priority, search with debounce
- **Sortable Table** — Click column headers to sort ascending/descending
- **Pagination** — Server-side pagination with page size selector (10/20/50)
- **Ticket Detail** — View/edit ticket, change status/priority inline
- **Comments** — Add comments to tickets with real-time append
- **Activity Log** — Timeline of all changes (status, priority, assignment, comments)
- **Dashboard** — Stat cards + pie/bar/line charts with click-to-filter
- **Theme Toggle** — Light, Dark, and System theme with instant apply
- **Keyboard Shortcuts** — Configurable shortcuts with toggle switches
- **Responsive Design** — Mobile-first with collapsible sidebar
- **Accessible** — ARIA labels, focus management, keyboard navigation
- **URL-Driven Filters** — Bookmarkable, shareable filter states

## What Is SupportDesk?

SupportDesk is a **support ticket management system** — think Zendesk, Freshdesk, or Jira Service Desk, but simpler. It's designed for teams that need to track, prioritize, and resolve customer or internal support requests.

### Who is it for?

- **Support agents** who handle incoming tickets and need to track their progress
- **Team leads** who need visibility into workload distribution and resolution trends
- **Small teams** that want a lightweight alternative to heavy enterprise tools

### What can you do?

| Action | How |
|--------|-----|
| Log in | Use the demo chips (Admin or Agent) on the login page |
| View tickets | Navigate to **Tickets** — see all tickets with status, priority, assignee |
| Filter & search | Use the filter toggles (status, priority) and the search bar |
| Sort | Click any column header to sort ascending/descending |
| Open a ticket | Click any row to see full details, comments, and activity log |
| Update a ticket | Change status or priority directly from the detail view |
| Add a comment | Type in the comment box and submit — it appears in the timeline |
| Check stats | Go to **Dashboard** to see charts: tickets by status, priority, and trend over time |
| Customize | Go to **Settings** to switch theme (light/dark/system) and configure keyboard shortcuts |

### The workflow

```
Customer reports issue → Ticket created → Agent picks it up → 
Agent updates status/priority → Agent adds comments → Issue resolved → Ticket closed
```

Every action (status change, priority update, comment) is logged in the **Activity Log** so there's a full audit trail of what happened and when.

## How It Works

### Mock API Layer

The app uses **MSW (Mock Service Worker)** to intercept HTTP requests in the browser. No backend is needed. **Faker.js** generates 37 realistic tickets with random statuses, priorities, comments, and activity logs on every page load.

Set `VITE_API_MOCK=true` in `.env` to enable mocking (enabled by default).

### State Management

| Layer | Tool | Purpose |
|-------|------|---------|
| Server cache | RTK Query | All API data, automatic cache invalidation |
| Client state | Redux Toolkit slices | Auth, settings, UI state |
| Side effects | RTK `listenerMiddleware` | Auth persistence, theme application |
| URL state | `useSearchParams` | Filters, pagination, search — bookmarkable |
| Form state | react-hook-form | Login form, comment form |

### Data Flow

```
User Action → RTK Query Hook → MSW Handler → Faker Data → RTK Query Cache → React Re-render
```

RTK Query handles caching, optimistic updates, and automatic refetching. When you change a ticket status, the UI updates instantly (optimistic) and reverts if the server fails.

## Project Structure

### Features

Each feature is self-contained with its own API, components, and state:

- **auth** — Login, logout, session persistence (localStorage)
- **tickets** — List, detail, filters, table, pagination, comments, activity
- **dashboard** — Stats aggregation, charts (pie, bar, line)
- **settings** — Theme selector, keyboard shortcut configuration, usage instructions

### Key Decisions

1. **MSW + Faker.js** — Dynamic data, realistic every load, removable when real backend arrives
2. **URL-driven filters** — Filters survive refresh, shareable, back-button works
3. **RTK Query** — Automatic caching, no manual fetch calls, optimistic updates
4. **Feature-based folders** — Each screen is a feature with its own API
5. **Tailwind v4** — CSS variables for theming via `@theme inline`
6. **Sonner** — Lighter than react-toastify, better TypeScript support
7. **@dnd-kit** — Better accessibility than react-beautiful-dnd
8. **`listenerMiddleware`** — Reducers stay pure; side effects (localStorage, DOM) handled by RTK listener middleware

## License

MIT
