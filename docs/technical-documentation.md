# SupportDesk — Technical Documentation

This document explains how the most important parts of the application work internally. It's written for developers who need to understand the architecture, modify behavior, or debug issues.

---

## Table of Contents

1. [Application Bootstrap](#1-application-bootstrap)
2. [Authentication Flow](#2-authentication-flow)
3. [Redux State Management](#3-redux-state-management)
4. [RTK Query — Server State](#4-rtk-query--server-state)
5. [Mock API Layer (MSW)](#5-mock-api-layer-msw)
6. [Routing & Protected Routes](#6-routing--protected-routes)
7. [Theming System](#7-theming-system)
8. [Data Models](#8-data-models)

---

## 1. Application Bootstrap

**Files:** `src/main.tsx` → `src/App.tsx`

```
main.tsx
  ├── Starts MSW worker (if VITE_API_MOCK=true)
  └── Renders <App />

App.tsx
  ├── <Provider store={store}>     ← Redux access for entire tree
  ├── <BrowserRouter>              ← React Router
  │   ├── <AppRoutes />           ← All routes
  │   └── <Toaster />             ← Toast notifications
```

**Key detail:** MSW must start **before** React renders. If the worker isn't ready, API calls will hit the real network (which doesn't exist in dev). That's why `main.tsx` uses `async/await` before `createRoot().render()`.

---

## 2. Authentication Flow

**Files:** `src/features/auth/authApi.ts` → `authSlice.ts` → `listenerMiddleware`

### Login

```
1. User clicks "Admin" chip → LoginForm autofills email/password
2. User clicks "Sign in"
3. LoginForm calls useLoginMutation() → POST /api/v1/auth/login
4. MSW handler (src/mocks/handlers/auth.ts) intercepts:
   - Validates credentials against demoUsers
   - Returns { user, token }
5. LoginForm calls dispatch(setCredentials({ user, token }))
6. authSlice reducer updates state: { user, token, isAuthenticated: true }
7. listenerMiddleware detects setCredentials action
8. listenerMiddleware calls localStorage.setItem('supportdesk-auth', JSON.stringify(state))
9. ProtectedRoute reads useAppSelector(s => s.auth.isAuthenticated)
10. If true → renders <Outlet /> (page content)
11. If false → redirects to /login
```

### Logout

```
1. User clicks "Log out" button (Header or SettingsPage)
2. dispatch(logout())
3. authSlice reducer clears: { user: null, token: null, isAuthenticated: false }
4. listenerMiddleware persists empty state to localStorage
5. navigate('/login') → redirects to login page
```

### Session Persistence

On page reload:
1. `authSlice.ts` calls `loadInitialState()` at module load
2. Reads `localStorage.getItem('supportdesk-auth')`
3. If valid → initialState = stored state (user stays logged in)
4. If corrupted/missing → initialState = default (user must log in again)

---

## 3. Redux State Management

**Files:** `src/app/store.ts`, `src/features/*/Slice.ts`, `src/middleware/listeners.ts`

### Store Structure

```typescript
{
  auth: { user, token, isAuthenticated },        // authSlice
  settings: { theme, shortcuts },                // settingsSlice
  ticketsApi: { /* RTK Query cache */ },         // ticketsApi
  dashboardApi: { /* RTK Query cache */ },       // dashboardApi
  authApi: { /* RTK Query cache */ },            // authApi
}
```

### Two Types of State

| Type | Source | Purpose | Example |
|------|--------|---------|---------|
| **Slice** | `createSlice()` | Client-only state | auth, settings |
| **RTK Query** | `createApi()` | Server cache | tickets, dashboard |

### Slices (Client State)

Slices are **pure reducers** — they only calculate new state, no side effects.

```typescript
// authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState,  // lazy function
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;    // Immer allows mutation
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});
```

**Why no `persist()` inside the reducer?** Because reducers must be pure functions (no DOM access, no localStorage, no network). Side effects go in `listenerMiddleware`.

### listenerMiddleware (Side Effects)

**File:** `src/middleware/listeners.ts`

```typescript
// When setCredentials or logout fires → persist to localStorage
listenerMiddleware.startListening({
  matcher: isAnyOf(setCredentials, logout),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();
    localStorage.setItem('supportdesk-auth', JSON.stringify(state.auth));
  },
});

// When setTheme fires → persist to localStorage + apply DOM class
listenerMiddleware.startListening({
  matcher: isAnyOf(setTheme, toggleShortcut, resetShortcuts),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    localStorage.setItem('supportdesk-settings', JSON.stringify(state.settings));
    if (setTheme.match(action)) {
      applyTheme(action.payload);  // modifies document.documentElement
    }
  },
});
```

**Why `listenerMiddleware` instead of `subscribe()`?**
- `subscribe()` fires on EVERY state change (wasteful)
- `listenerMiddleware` fires only on matching actions (efficient)
- `listenerApi.cancelActiveListeners()` prevents duplicate effects

---

## 4. RTK Query — Server State

**Files:** `src/features/*/api.ts`

### How RTK Query Works

```
Component calls useGetTicketsQuery()
        │
        ▼
RTK Query checks cache
        ├── Cache HIT → return cached data (no network request)
        └── Cache MISS → fetch from API
                │
                ▼
        MSW intercepts request
                │
                ▼
        Returns faker-generated data
                │
                ▼
        RTK Query stores in cache
                │
                ▼
        Component re-renders with data
```

### Example: ticketsApi.ts

```typescript
export const ticketsApi = createApi({
  reducerPath: 'ticketsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  tagTypes: ['Ticket'],                     // for cache invalidation
  endpoints: (builder) => ({
    getTickets: builder.query<Ticket[], TicketFilters>({
      query: (filters) => ({
        url: '/tickets',
        params: filters,                    // ?status=open&priority=high&page=1
      }),
      providesTags: ['Ticket'],             // "I provide Ticket data"
    }),
    updateTicket: builder.mutation<Ticket, { id: number; changes: Partial<Ticket> }>({
      query: ({ id, ...changes }) => ({
        url: `/tickets/${id}`,
        method: 'PATCH',
        body: changes,
      }),
      invalidatesTags: ['Ticket'],          // "My data is stale, refetch"
    }),
  }),
});
```

### Optimistic Updates

When you change a ticket's status:
1. `updateTicket` mutation fires
2. RTK Query **immediately** updates the cache (optimistic)
3. Sends PATCH request to server
4. If server succeeds → cache stays updated
5. If server fails → cache reverts to previous value

This is why the UI feels instant even though MSW adds a 300-700ms delay.

### Tag-Based Invalidation

```
updateTicket() → invalidatesTags: ['Ticket']
                    │
                    ▼
        getTickets query re-fetches automatically
        (because it providesTags: ['Ticket'])
```

---

## 5. Mock API Layer (MSW)

**Files:** `src/mocks/handlers/*.ts`, `src/mocks/data/*.ts`

### How MSW Works

MSW intercepts HTTP requests at the **network level** (not fetch/XMLHttpRequest). The browser thinks it's making a real request, but MSW catches it.

```
React component calls fetch('/api/v1/tickets')
        │
        ▼
MSW Service Worker intercepts
        │
        ▼
Handler matches URL + method
        │
        ▼
Handler generates faker data
        │
        ▼
Returns HttpResponse.json(data)
        │
        ▼
React receives data as if from real server
```

### Handler Pattern

```typescript
// src/mocks/handlers/tickets.ts
http.get('/api/v1/tickets', async ({ request }) => {
  await delay();                              // simulates network latency
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const page = Number(url.searchParams.get('page') || '1');

  let filtered = [...tickets];
  if (status) filtered = filtered.filter(t => t.status === status);

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return HttpResponse.json({
    data: paginated,
    total: filtered.length,
    page,
    pageSize,
  });
});
```

### getUserFromRequest

Every handler that needs to know "who is acting" reads the Authorization header:

```typescript
function getUserFromRequest(request: Request): User {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  // Find user by token in demoUsers
  return user || demoUsers[0];  // fallback to admin
}
```

This is how the app knows whether an admin or agent made a change.

---

## 6. Routing & Protected Routes

**Files:** `src/app/routes.tsx`, `src/features/auth/ProtectedRoute.tsx`

### Route Structure

```typescript
// routes.tsx
const routes = [
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,    // wraps all authenticated routes
    children: [
      { path: '/tickets', element: <TicketListPage /> },
      { path: '/tickets/:id', element: <TicketDetailPage /> },
      { element: <AppLayout />,     // sidebar + header shell
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
];
```

### ProtectedRoute Logic

```typescript
function ProtectedRoute() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;  // renders child route
}
```

**Key:** Every route inside `ProtectedRoute`'s `children` is guarded. If the user isn't logged in, they're redirected to `/login`.

### Lazy Loading

All page components are lazy-loaded:

```typescript
const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const TicketListPage = lazy(() => import('@/features/tickets/TicketListPage'));
```

This means the login page JS loads first. Ticket/dashboard/settings JS only loads when the user navigates there. This improves initial load time.

---

## 7. Theming System

**Files:** `src/features/settings/settingsSlice.ts`, `src/middleware/listeners.ts`, `src/index.css`

### How Themes Work

1. User clicks theme button → `dispatch(setTheme('dark'))`
2. `settingsSlice` updates `state.settings.theme = 'dark'`
3. `listenerMiddleware` detects `setTheme` action
4. Calls `applyTheme('dark')`:

```typescript
function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.classList.remove('light', 'dark');

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    html.classList.add(theme);
  }
}
```

5. CSS variables in `index.css` respond to the class:

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
}
.dark {
  --color-bg: #0f172a;
  --color-text: #f1f5f9;
}
```

6. Components use `var(--color-*)` → automatic theme switch

### Startup

On app load, `listener.ts` runs `applyTheme(loadInitialState().theme)` to apply the saved theme before React renders.

---

## 8. Data Models

**File:** `src/types/index.ts`

### Ticket

```typescript
interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: User;
  requester: User;
  tags: string[];
  comments: Comment[];
  activityLog: ActivityLogEntry[];
  createdAt: string;
  updatedAt: string;
}
```

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent';
  avatar: string;
}
```

### Comment

```typescript
interface Comment {
  id: string;
  ticketId: number;
  author: User;
  content: string;
  createdAt: string;
}
```

### ActivityLogEntry

```typescript
interface ActivityLogEntry {
  id: string;
  ticketId: number;
  actor: User;
  action: 'status_changed' | 'priority_changed' | 'assigned' | 'commented';
  from?: string;
  to?: string;
  timestamp: string;
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    REACT COMPONENTS                      │
│  Pages → Components → Hooks (useAppSelector/Dispatch)   │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    REDUX STORE                           │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐  │
│  │authSlice │  │settings  │  │ RTK Query APIs      │  │
│  │          │  │Slice     │  │ (auth/tickets/dash) │  │
│  └──────────┘  └──────────┘  └─────────────────────┘  │
│                          │                              │
│  ┌──────────────────────┴──────────────────────────┐   │
│  │          listenerMiddleware                      │   │
│  │  setCredentials → localStorage                   │   │
│  │  setTheme → localStorage + DOM class             │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    RTK QUERY                             │
│  fetchBaseQuery → HTTP requests                         │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    MSW SERVICE WORKER                    │
│  Intercepts /api/v1/* → generates faker data            │
└─────────────────────────────────────────────────────────┘
```
