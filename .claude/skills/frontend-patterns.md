---
name: frontend-patterns
description: Frontend development patterns for Next.js, React, TanStack Query, and UI best practices.
---

# Frontend Development Patterns

Modern frontend patterns for vibebase Next.js application.

## Component Patterns

### Composition Over Inheritance

```typescript
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined'
}

export function Card({ children, variant = 'default' }: CardProps) {
  return <div className={cn('card', `card-${variant}`)}>{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>
}

// Usage
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

### Client vs Server Components

```typescript
// Server Component (default) - for data fetching
// frontend/src/app/[locale]/users/page.tsx
import { getTranslations } from 'next-intl/server'

export default async function UsersPage() {
  const t = await getTranslations('users')
  const users = await fetchUsers()  // Server-side fetch

  return (
    <div>
      <h1>{t('title')}</h1>
      <UserList users={users} />
    </div>
  )
}

// Client Component - for interactivity
// frontend/src/components/user-search.tsx
"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export function UserSearch() {
  const [query, setQuery] = useState('')

  const { data, isPending } = useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 2
  })

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {isPending && <Spinner />}
      {data && <SearchResults results={data} />}
    </div>
  )
}
```

## TanStack Query Patterns (v5)

### Basic Query

```typescript
import { useQuery } from '@tanstack/react-query'

export function UserList() {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/v1/users')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,  // 5 minutes
  })

  if (isPending) return <Spinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {data.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

### Mutation

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function CreateUserForm() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: CreateUserData) => {
      const res = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to create')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData) }}>
      {mutation.isPending && <Spinner />}
      {mutation.isError && <ErrorMessage error={mutation.error} />}
    </form>
  )
}
```

## Internationalization (next-intl)

### Server Component

```typescript
// frontend/src/app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('home')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

### Client Component

```typescript
// frontend/src/components/greeting.tsx
"use client"

import { useTranslations } from 'next-intl'

export function Greeting({ name }: { name: string }) {
  const t = useTranslations('common')

  return <h1>{t('welcome', { name })}</h1>
}
```

### Message Files

```json
// frontend/src/i18n/messages/en.json
{
  "common": {
    "welcome": "Welcome, {name}!"
  },
  "home": {
    "title": "Home",
    "description": "Welcome to vibebase"
  }
}

// frontend/src/i18n/messages/ko.json
{
  "common": {
    "welcome": "{name}님, 환영합니다!"
  },
  "home": {
    "title": "홈",
    "description": "vibebase에 오신 것을 환영합니다"
  }
}
```

## Custom Hooks

### useDebounce

```typescript
// frontend/src/hooks/use-debounce.ts
import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

## Styling with Tailwind CSS

### cn() Utility

```typescript
// frontend/src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<button className={cn(
  'px-4 py-2 rounded-md',
  variant === 'primary' && 'bg-blue-600 text-white',
  className
)} />
```

### Dark Mode (next-themes)

```typescript
"use client"

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}

// In components
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

## Performance

### Memoization

```typescript
import { useMemo, useCallback, memo } from 'react'

// useMemo for expensive computations
const sortedItems = useMemo(() => {
  return items.sort((a, b) => b.score - a.score)
}, [items])

// useCallback for callbacks passed to children
const handleClick = useCallback((id: string) => {
  setSelected(id)
}, [])

// memo for pure components
export const ItemCard = memo(function ItemCard({ item }: { item: Item }) {
  return <div>{item.name}</div>
})
```

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyChart />
    </Suspense>
  )
}
```

## Error Handling

### Next.js Error Boundary

```typescript
// frontend/src/app/[locale]/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-4 text-center">
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```
