# React Component

Create a new React component following project conventions:

## Component Structure

```
frontend/src/components/
├── ui/                    # Base UI components (shadcn/ui)
└── {feature}/             # Feature-specific components
    ├── {component}.tsx
    └── {component}.test.tsx
```

## Template (Function Component)

```tsx
// frontend/src/components/{feature}/{ComponentName}.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface {ComponentName}Props {
  className?: string;
  // Add other props
}

export function {ComponentName}({ className, ...props }: {ComponentName}Props) {
  const t = useTranslations("{feature}");
  const [state, setState] = useState<string>("");

  return (
    <div className={cn("", className)} {...props}>
      {/* Component content */}
    </div>
  );
}
```

## With React Query

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";

export function {ComponentName}() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["{resource}"],
    queryFn: async () => {
      const res = await fetch("/api/v1/{resource}");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Render data */}
    </div>
  );
}
```

## Internationalization (i18n)

Add translations to:
- `frontend/src/i18n/messages/en.json`
- `frontend/src/i18n/messages/ko.json`

```json
{
  "{feature}": {
    "title": "Title",
    "description": "Description"
  }
}
```

## Styling

- Use Tailwind CSS classes
- Use `cn()` utility for conditional classes
- Follow existing component patterns in `components/ui/`

## Checklist

- [ ] TypeScript types/interfaces defined
- [ ] Props interface with proper types
- [ ] Internationalization with useTranslations
- [ ] Responsive design (mobile-first)
- [ ] Dark mode support (Tailwind dark: variants)
- [ ] Accessibility (aria-labels, keyboard navigation)
- [ ] Loading states
- [ ] Error handling
- [ ] Unit tests
