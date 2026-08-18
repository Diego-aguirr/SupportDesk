# SupportDesk

Support ticket management system built with React 18, TypeScript, Redux Toolkit, RTK Query, and MSW. Features real-time filtering, drag & drop, charts, and keyboard shortcuts. Greenfield project for mastering modern React architecture patterns.

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build**: Vite
- **State**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS v4
- **Mock API**: MSW + Faker.js
- **Forms**: react-hook-form + Zod
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Notifications**: Sonner
- **Keyboard**: react-hotkeys-hook

## Getting Started

```bash
npm install
npm run dev
```

Set `VITE_API_MOCK=true` in `.env` to enable the mock API layer.

## Features

- Authentication simulation (admin/agent roles)
- Ticket CRUD with pagination, filtering, sorting
- Real-time search with debounce
- Drag & drop status board (kanban)
- Dashboard with charts (pie, bar, line)
- Dark/Light/System theme toggle
- Keyboard shortcuts (Ctrl+K, Ctrl+N, J/K navigation)
- Bulk actions (status change, delete)
- CSV export
- Activity/audit log
- Accessible (WCAG AA)
- Responsive (mobile-first)
