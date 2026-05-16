# Vibebase Web UI

Next.js 16 frontend with React 19, Tailwind CSS, shadcn/ui, i18n, dark mode, and NextAuth (Google / Kakao).

## Setup

```bash
pnpm install
pnpm dev           # Webpack dev server
pnpm dev:turbo     # Optional: Turbopack
```

## Features

- **Auth** - NextAuth v5 (Google, Kakao) with backend JWT exchange (`src/auth.ts`)
- **i18n** - Multi-language support (en, ko) via `next-intl`
- **Dark/Light Mode** - Theme switching via `next-themes`
- **shadcn/ui** - Pre-configured UI primitives (`button`, `input`)
- **React Query** - Data fetching and caching
- **Motion** - Landing animations via `motion`

## Directory Structure

```
src/
├── app/
│   ├── [locale]/                # i18n route group
│   │   ├── (landing)/           # Public pages (landing layout)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # Landing
│   │   │   └── login/page.tsx   # OAuth sign-in
│   │   └── (app)/               # Protected pages (sidebar layout)
│   │       ├── layout.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── admin/page.tsx   # Admin console (users, stats)
│   │       └── help/page.tsx
│   ├── api/auth/[...nextauth]/  # NextAuth route handler
│   ├── globals.css              # Tailwind + CSS variables
│   └── layout.tsx               # Root layout
├── auth.ts                      # NextAuth config + backend token exchange
├── middleware.ts                # i18n + auth middleware
├── components/
│   ├── admin/                   # Admin console (data table, tabs, users panel)
│   ├── landing/                 # Landing sections (hero, features, CTA, etc.)
│   ├── layout/sidebar.tsx       # App shell sidebar
│   ├── ui/                      # shadcn/ui components (button, input)
│   ├── theme-toggle.tsx
│   └── language-switcher.tsx
├── providers/                   # All providers
│   ├── index.tsx                # Combined Providers wrapper
│   ├── auth-provider.tsx        # NextAuth SessionProvider
│   ├── theme-provider.tsx
│   └── query-provider.tsx
├── i18n/                        # i18n configuration & messages
│   ├── config.ts                # Locales, default locale
│   ├── navigation.ts            # Link, useRouter, etc.
│   ├── request.ts               # Server request handler
│   ├── index.ts                 # Public exports
│   └── messages/{en,ko}.json
├── lib/
│   ├── api/
│   │   ├── client.ts            # Typed API client with auth injection
│   │   └── admin.ts             # Admin API helpers
│   └── utils.ts                 # cn() helper
├── hooks/
│   ├── use-auth.ts              # Session, role, backendToken
│   ├── use-debounce.ts
│   ├── use-outside-click.ts
│   └── use-window-size.ts
└── types/
    ├── admin.ts                 # Admin DTOs
    └── next-auth.d.ts           # NextAuth type extensions
```

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dialog
```

## Adding New Languages

1. Add locale to `src/i18n/config.ts`
2. Create translation file `src/i18n/messages/{locale}.json`
3. Update middleware matcher in `src/middleware.ts`

## Auth Notes

- Set `AUTH_DISABLED=true` in `.env.local` to bypass auth in development.
- `INTERNAL_API_SECRET` must match the backend value — it authenticates the NextAuth → backend `POST /api/v1/auth/callback` request.
