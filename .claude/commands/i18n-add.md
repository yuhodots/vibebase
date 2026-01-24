# Add Internationalization (i18n)

Add new translations to the project:

## Message Files

```
frontend/src/i18n/messages/
├── en.json    # English (default)
└── ko.json    # Korean
```

## Adding New Translations

### 1. Add to English file
```json
// frontend/src/i18n/messages/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "feature": {
    "title": "Feature Title",
    "description": "Feature description"
  }
}
```

### 2. Add to Korean file
```json
// frontend/src/i18n/messages/ko.json
{
  "common": {
    "save": "저장",
    "cancel": "취소"
  },
  "feature": {
    "title": "기능 제목",
    "description": "기능 설명"
  }
}
```

## Using Translations

### In Components
```tsx
"use client";

import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("feature");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
```

### With Variables
```json
{
  "greeting": "Hello, {name}!"
}
```

```tsx
t("greeting", { name: "John" })
```

### With Plurals
```json
{
  "items": "{count, plural, =0 {No items} =1 {One item} other {# items}}"
}
```

```tsx
t("items", { count: 5 })
```

## Supported Locales

Configured in `frontend/src/i18n/config.ts`:
- `en` - English (default)
- `ko` - Korean

## Checklist

- [ ] Add key to en.json
- [ ] Add translation to ko.json
- [ ] Use useTranslations hook in component
- [ ] Test both languages using language switcher
- [ ] Verify no hardcoded strings remain

## Tips

- Keep translation keys short and descriptive
- Group related translations under feature namespaces
- Use ICU message format for complex strings
- Test RTL (right-to-left) if adding RTL languages
