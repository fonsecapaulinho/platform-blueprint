import type { Locale } from "./locale";

export const authShellMessages = {
  "en-US": {
    copyright: "© {year} Fonseca Consulting. All rights reserved.",
  },
} satisfies Record<Locale, { copyright: string }>;
