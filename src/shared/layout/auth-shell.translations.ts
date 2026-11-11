import type { Locale } from "./locale";

export const authShellMessages = {
  "en-US": {
    copyright: "© {year} Fonseca Consulting. All rights reserved.",
    // Shown on every auth screen for the whole MVP phase: every record in
    // this environment is sample data. Remove when real services land.
    demoNotice:
      "Demonstration environment — sample data only. Please don't enter real passwords or personal details.",
  },
} satisfies Record<Locale, { copyright: string; demoNotice: string }>;
