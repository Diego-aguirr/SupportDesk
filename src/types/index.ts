// ── Users ──────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

// ── Tickets ────────────────────────────────────────────────────────────

export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Comment {
  id: string;
  ticketId: number;
  author: User;
  content: string;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  ticketId: number;
  actor: User;
  action: 'created' | 'status_changed' | 'priority_changed' | 'assigned' | 'commented';
  from?: string;
  to?: string;
  timestamp: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: User | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  activityLog: ActivityLogEntry[];
}

// ── API / Query ────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TicketFilters {
  page?: number;
  pageSize?: number;
  status?: TicketStatus[];
  priority?: TicketPriority[];
  assigneeId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority';
  sortDir?: 'asc' | 'desc';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ── Settings ───────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark' | 'system';

export interface KeyboardShortcut {
  id: string;
  label: string;
  keys: string[];
  action: string;
  enabled: boolean;
}

export interface SettingsState {
  theme: Theme;
  shortcuts: KeyboardShortcut[];
}

// ── CSV Export ─────────────────────────────────────────────────────────

export interface CSVExportRow {
  id: number;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}
