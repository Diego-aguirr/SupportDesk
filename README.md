# HelpFlow

A modern support ticket management system built with React, TypeScript, Redux Toolkit, RTK Query, and MSW — designed to practice decoupled architecture patterns.

## Architecture

```
React → Redux Toolkit → RTK Query → MSW → Faker.js (dynamic mock data)
```

## Features

- Ticket management (CRUD)
- Search, filters, sorting, pagination
- Drag & drop status changes
- Dashboard with charts
- Dark/light theme
- Keyboard shortcuts
- Responsive design
- Simulated authentication

## Tech Stack

- React 18+ TypeScript
- Vite
- Redux Toolkit + RTK Query
- MSW + @faker-js/faker
- React Router v6
- react-hook-form + Zod
- @dnd-kit
- recharts
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run test     # Run tests
```
