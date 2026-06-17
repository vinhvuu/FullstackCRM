# Phase 4: Frontend-Backend Integration — Detailed Implementation Plan

**Date:** Jun 07, 2026  
**Prerequisite:** Phase 3 complete  
**Goal:** Connect frontend to real API, replace mock data, add loading/error/UX improvements

---

## Task 4.1 — API Client Layer

### Files to Create/Modify

| File | Action |
|------|--------|
| `lib/api-client.ts` | NEW — fetch wrapper with auth |
| `lib/api-endpoints.ts` | NEW — endpoint URL constants |
| `lib/auth-context.tsx` | NEW — auth state management |
| `app/(auth)/login/page.tsx` | MODIFY — use API |
| `app/(auth)/register/page.tsx` | MODIFY — use API |

### Steps

**4.1.1 — Create lib/api-endpoints.ts**

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const endpoints = {
  // Auth
  login: `${API_BASE}/api/auth/login`,
  register: `${API_BASE}/api/auth/register`,
  me: `${API_BASE}/api/auth/me`,

  // Dashboard
  dashboardStats: `${API_BASE}/api/dashboard/stats`,
  dashboardInsights: `${API_BASE}/api/dashboard/insights`,
  reports: `${API_BASE}/api/reports`,

  // Search
  search: `${API_BASE}/api/search`,

  // Leads
  leads: `${API_BASE}/api/leads`,
  lead: (id: number) => `${API_BASE}/api/leads/${id}`,
  leadConvert: (id: number) => `${API_BASE}/api/leads/${id}/convert`,
  leadTags: (id: number) => `${API_BASE}/api/leads/${id}/tags`,
  leadTag: (leadId: number, tagId: number) => `${API_BASE}/api/leads/${leadId}/tags/${tagId}`,
  leadReminders: (leadId: number) => `${API_BASE}/api/leads/${leadId}/reminders`,

  // Deals
  deals: `${API_BASE}/api/deals`,
  deal: (id: number) => `${API_BASE}/api/deals/${id}`,

  // Contacts
  contacts: `${API_BASE}/api/contacts`,
  contact: (id: number) => `${API_BASE}/api/contacts/${id}`,

  // Activities
  activities: `${API_BASE}/api/activities`,
  activity: (id: number) => `${API_BASE}/api/activities/${id}`,

  // Tags
  tags: `${API_BASE}/api/tags`,

  // Reminders
  remindersUpcoming: `${API_BASE}/api/reminders/upcoming`,
  reminderComplete: (id: number) => `${API_BASE}/api/reminders/${id}/complete`,
  reminderSnooze: (id: number) => `${API_BASE}/api/reminders/${id}/snooze`,
  reminder: (id: number) => `${API_BASE}/api/reminders/${id}`,
};
```

**4.1.2 — Create lib/api-client.ts**

```typescript
import { endpoints } from './api-endpoints';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || data.message || 'An error occurred'
    );
  }

  return data;
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: User; token: string }>(endpoints.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    request<{ user: User; token: string }>(endpoints.register, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  me: () => request<{ user: User }>(endpoints.me),
};

// Dashboard
export const dashboardApi = {
  getStats: () => request<DashboardStats>(endpoints.dashboardStats),
  getInsights: () => request<{ data: AIInsights }>(endpoints.dashboardInsights),
  getReports: () => request<ReportsData>(endpoints.reports),
  search: (q: string) =>
    request<SearchResults>(`${endpoints.search}?q=${encodeURIComponent(q)}`),
};

// Leads
export const leadsApi = {
  getAll: (params?: LeadsQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) searchParams.set(k, String(v));
      });
    }
    const query = searchParams.toString();
    return request<PaginatedResponse<Lead>>(`${endpoints.leads}${query ? `?${query}` : ''}`);
  },

  getById: (id: number) => request<{ data: Lead }>(endpoints.lead(id)),

  create: (data: CreateLeadInput) =>
    request<{ data: Lead }>(endpoints.leads, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Lead>) =>
    request<{ data: Lead }>(endpoints.lead(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<{ deleted: boolean }>(endpoints.lead(id), { method: 'DELETE' }),

  convert: (id: number, data: ConvertLeadInput) =>
    request<{ data: { deal: Deal; contact: Contact | null } }>(
      endpoints.leadConvert(id),
      { method: 'POST', body: JSON.stringify(data) }
    ),

  addTag: (leadId: number, tagId: number) =>
    request<{ data: Lead }>(endpoints.leadTags(leadId), {
      method: 'POST',
      body: JSON.stringify({ tagId }),
    }),

  removeTag: (leadId: number, tagId: number) =>
    request<{ data: Lead }>(endpoints.leadTag(leadId, tagId), {
      method: 'DELETE',
    }),

  getReminders: (leadId: number) =>
    request<{ data: Reminder[] }>(endpoints.leadReminders(leadId)),

  createReminder: (leadId: number, data: CreateReminderInput) =>
    request<{ data: Reminder }>(endpoints.leadReminders(leadId), {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Deals
export const dealsApi = {
  getAll: (params?: DealsQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) searchParams.set(k, String(v));
      });
    }
    const query = searchParams.toString();
    return request<PaginatedResponse<Deal>>(`${endpoints.deals}${query ? `?${query}` : ''}`);
  },

  getById: (id: number) => request<{ data: Deal }>(endpoints.deal(id)),

  create: (data: CreateDealInput) =>
    request<{ data: Deal }>(endpoints.deals, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Deal>) =>
    request<{ data: Deal }>(endpoints.deal(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<{ deleted: boolean }>(endpoints.deal(id), { method: 'DELETE' }),
};

// Contacts
export const contactsApi = {
  getAll: (params?: ContactsQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) searchParams.set(k, String(v));
      });
    }
    const query = searchParams.toString();
    return request<PaginatedResponse<Contact>>(`${endpoints.contacts}${query ? `?${query}` : ''}`);
  },

  getById: (id: number) => request<{ data: Contact }>(endpoints.contact(id)),

  create: (data: CreateContactInput) =>
    request<{ data: Contact }>(endpoints.contacts, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Contact>) =>
    request<{ data: Contact }>(endpoints.contact(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<{ deleted: boolean }>(endpoints.contact(id), { method: 'DELETE' }),
};

// Activities
export const activitiesApi = {
  getAll: (params?: ActivitiesQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) searchParams.set(k, String(v));
      });
    }
    const query = searchParams.toString();
    return request<PaginatedResponse<Activity>>(`${endpoints.activities}${query ? `?${query}` : ''}`);
  },

  getById: (id: number) => request<{ data: Activity }>(endpoints.activity(id)),

  create: (data: CreateActivityInput) =>
    request<{ data: Activity }>(endpoints.activities, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Activity>) =>
    request<{ data: Activity }>(endpoints.activity(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<{ deleted: boolean }>(endpoints.activity(id), {
      method: 'DELETE',
    }),
};

// Tags
export const tagsApi = {
  getAll: () => request<{ data: Tag[] }>(endpoints.tags),
};

// Reminders
export const remindersApi = {
  getUpcoming: () => request<{ data: Reminder[] }>(endpoints.remindersUpcoming),

  complete: (id: number) =>
    request<{ data: Reminder }>(endpoints.reminderComplete(id), {
      method: 'PUT',
    }),

  snooze: (id: number, newDate: string) =>
    request<{ data: Reminder }>(endpoints.reminderSnooze(id), {
      method: 'PUT',
      body: JSON.stringify({ newDate }),
    }),

  delete: (id: number) =>
    request<{ deleted: boolean }>(endpoints.reminder(id), { method: 'DELETE' }),
};

export { ApiError };
```

**4.1.3 — Create lib/auth-context.tsx**

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from './api-client';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      authApi.me()
        .then((res) => {
          setUser(res.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const res = await authApi.register(email, password, name);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

**4.1.4 — Update root layout to wrap with AuthProvider**

Modify `app/layout.tsx`:

```typescript
import { AuthProvider } from '@/lib/auth-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

**4.1.5 — Update login page to use API**

Modify `app/(auth)/login/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

**4.1.6 — Update register page similarly**

---

## Task 4.2 — Replace Mock Data in Dashboard Page

### Files to Modify

| File | Action |
|------|--------|
| `app/(dashboard)/page.tsx` | MODIFY — use dashboardApi |
| `app/(dashboard)/layout.tsx` | MODIFY — add auth guard |

### Steps

**4.2.1 — Create app/(dashboard)/layout.tsx with auth redirect**

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F5F3FF]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
```

**4.2.2 — Update dashboard page to use real API**

Replace mock data imports and calls with API calls:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { dashboardApi } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

// Replace mock data imports
// import { dashboardStats, chartData, aiInsights } from '@/lib/mock-data';

// Use real data fetching
const [stats, setStats] = useState(null);
const [insights, setInsights] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchData() {
    try {
      const [statsData, insightsData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getInsights(),
      ]);
      setStats(statsData);
      setInsights(insightsData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

---

## Task 4.3 — Replace Mock Data in Leads Page

### Files to Modify

| File | Action |
|------|--------|
| `app/(dashboard)/leads/page.tsx` | MODIFY — use leadsApi |
| `app/(dashboard)/leads/[id]/page.tsx` | MODIFY — use leadsApi |

### Steps

**4.3.1 — Update leads page to use real API**

Replace:
```typescript
import { leads as mockLeads } from '@/lib/mock-data';
```

With:
```typescript
import { leadsApi } from '@/lib/api-client';
```

Replace state initialization with API calls:
```typescript
const [leads, setLeads] = useState<Lead[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchLeads() {
    try {
      const response = await leadsApi.getAll({
        page: 1,
        limit: 100,
        status: selectedStatus || undefined,
        source: selectedSource || undefined,
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  }
  fetchLeads();
}, [selectedStatus, selectedSource, viewMode]);
```

**4.3.2 — Update lead form submission to use API**

```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSubmitting(true);
  try {
    if (editingLead) {
      await leadsApi.update(editingLead.id, formData);
      toast.success('Lead updated successfully');
    } else {
      await leadsApi.create(formData);
      toast.success('Lead created successfully');
    }
    router.push('/leads');
  } catch (err: any) {
    toast.error(err.message || 'Failed to save lead');
  } finally {
    setSubmitting(false);
  }
}
```

**4.3.3 — Update leads detail page similarly**

---

## Task 4.4 — Replace Mock Data in Deals, Contacts, Activities Pages

### Files to Modify

| File | Action |
|------|--------|
| `app/(dashboard)/deals/page.tsx` | MODIFY |
| `app/(dashboard)/deals/[id]/page.tsx` | MODIFY |
| `app/(dashboard)/contacts/page.tsx` | MODIFY |
| `app/(dashboard)/contacts/[id]/page.tsx` | MODIFY |
| `app/(dashboard)/activities/page.tsx` | MODIFY |

### Steps

Repeat pattern from Task 4.3 for each page:
1. Import API functions
2. Replace mock data state with loading state
3. Use useEffect to fetch from API
4. Replace form submissions with API calls
5. Add toast notifications

---

## Task 4.5 — Add Toast Notifications

### Files to Create/Modify

| File | Action |
|------|--------|
| `components/ui/toast.tsx` | NEW — toast component |
| `components/ui/toaster.tsx` | NEW — toaster container |
| `lib/toast.ts` | NEW — toast utility functions |
| `app/layout.tsx` | MODIFY — add toaster |
| All form pages | MODIFY — add toast on success/error |

### Steps

**4.5.1 — Create lib/toast.ts**

```typescript
'use client';

import { create } from 'react-hot-toast';

export const toast = {
  success: (message: string) => create.success(message, { duration: 3000 }),
  error: (message: string) => create.error(message, { duration: 4000 }),
  loading: (message: string) => create.loading(message),
  dismiss: (toastId: string) => create.dismiss(toastId),
};
```

**4.5.2 — Install react-hot-toast**

```bash
npm install react-hot-toast
```

**4.5.3 — Add toaster to root layout**

```typescript
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## Task 4.6 — Add Loading States & Skeletons

### Files to Create/Modify

| File | Action |
|------|--------|
| `components/ui/skeleton.tsx` | NEW |
| All list pages | MODIFY — add loading skeletons |

### Steps

**4.6.1 — Create components/ui/skeleton.tsx**

```typescript
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-8 w-1/2 mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-3"><Skeleton className="h-4 w-4" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
    </tr>
  );
}
```

**4.6.2 — Add to pages**

In each page, show skeleton when loading:
```typescript
if (loading) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
    </div>
  );
}
```

---

## Task 4.7 — Add Error Boundaries

### Files to Create/Modify

| File | Action |
|------|--------|
| `components/error-boundary.tsx` | NEW |
| `app/(dashboard)/layout.tsx` | MODIFY — wrap with error boundary |

### Steps

**4.7.1 — Create components/error-boundary.tsx**

```typescript
'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**4.7.2 — Wrap dashboard layout**

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

export default function DashboardLayout({ children }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {/* existing layout */}
      </AuthProvider>
    </ErrorBoundary>
  );
}
```

---

## Task 4.8 — Form Validation with Zod

### Files to Create/Modify

| File | Action |
|------|--------|
| `lib/validations.ts` | NEW — Zod schemas |
| All form components | MODIFY — add validation |

### Steps

**4.8.1 — Install zod**

```bash
npm install zod
```

**4.8.2 — Create lib/validations.ts**

```typescript
import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']).optional(),
  score: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export const dealSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  value: z.number().min(0, 'Value must be positive').optional(),
  stage: z.enum(['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost']).optional(),
  probability: z.number().min(0).max(100).optional(),
  expected_close_date: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  position: z.string().optional(),
});

export const activitySchema = z.object({
  type: z.enum(['call', 'email', 'meeting', 'task']),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  due_date: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});
```

**4.8.3 — Update form components to validate before submit**

Example for lead form:
```typescript
import { leadSchema } from '@/lib/validations';

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const result = leadSchema.safeParse(formData);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    setFormErrors(errors as any);
    return;
  }

  // Proceed with API call
}
```

---

## Verification Steps

```bash
# Run frontend
npm run dev

# Test login flow
# 1. Go to /login, enter credentials
# 2. Should redirect to / on success
# 3. Dashboard should load real data from API

# Test CRUD operations
# 1. Create a lead → should appear in list
# 2. Edit a lead → should update
# 3. Delete a lead → should remove from list

# Test error states
# 1. Disconnect backend → should show error boundary
# 2. Invalid form → should show validation errors

# Test loading states
# 1. Refresh page → should show skeletons before data loads
```

---

## File Summary

| File | Action |
|------|--------|
| `lib/api-endpoints.ts` | NEW |
| `lib/api-client.ts` | NEW |
| `lib/auth-context.tsx` | NEW |
| `lib/toast.ts` | NEW |
| `lib/validations.ts` | NEW |
| `components/ui/toast.tsx` | NEW |
| `components/ui/toaster.tsx` | NEW |
| `components/ui/skeleton.tsx` | NEW |
| `components/error-boundary.tsx` | NEW |
| `app/layout.tsx` | MODIFY |
| `app/(auth)/login/page.tsx` | MODIFY |
| `app/(auth)/register/page.tsx` | MODIFY |
| `app/(dashboard)/layout.tsx` | MODIFY |
| `app/(dashboard)/page.tsx` | MODIFY |
| `app/(dashboard)/leads/page.tsx` | MODIFY |
| `app/(dashboard)/leads/[id]/page.tsx` | MODIFY |
| `app/(dashboard)/deals/page.tsx` | MODIFY |
| `app/(dashboard)/deals/[id]/page.tsx` | MODIFY |
| `app/(dashboard)/contacts/page.tsx` | MODIFY |
| `app/(dashboard)/contacts/[id]/page.tsx` | MODIFY |
| `app/(dashboard)/activities/page.tsx` | MODIFY |