# Vibebase Web UI

Next.js 16 frontend with React 19, Tailwind CSS, shadcn/ui, i18n, and dark mode.

## Setup

```bash
pnpm install
pnpm dev
```

## Features

- **i18n** - Multi-language support (en, ko) via `next-intl`
- **Dark/Light Mode** - Theme switching via `next-themes`
- **shadcn/ui** - Pre-configured UI components
- **React Query** - Data fetching and caching

## Directory Structure

```
src/
├── app/
│   ├── [locale]/           # i18n route group
│   │   ├── layout.tsx      # Locale layout with providers
│   │   └── page.tsx        # Home page
│   ├── globals.css         # Tailwind + CSS variables
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   └── button.tsx
│   ├── theme-toggle.tsx
│   └── language-switcher.tsx
├── providers/              # All providers
│   ├── index.tsx           # Combined Providers wrapper
│   ├── theme-provider.tsx
│   └── query-provider.tsx
├── i18n/                   # i18n configuration & messages
│   ├── config.ts           # Locales, default locale
│   ├── navigation.ts       # Link, useRouter, etc.
│   ├── request.ts          # Server request handler
│   ├── index.ts            # Public exports
│   └── messages/
│       ├── en.json
│       └── ko.json
├── lib/
│   ├── query-client.ts
│   └── utils.ts            # cn() helper
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript types
```

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add dialog
```

## Adding New Languages

1. Add locale to `src/i18n/config.ts`
2. Create translation file `src/i18n/messages/{locale}.json`
3. Update middleware matcher in `src/middleware.ts`
