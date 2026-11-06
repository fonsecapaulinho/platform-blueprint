"use client";

import { useLocale } from "./locale-provider";
import { skipLinkMessages } from "./skip-link.translations";

export function SkipLink() {
  const { locale } = useLocale();
  return <a className="skip-link" href="#main-content">{skipLinkMessages[locale]}</a>;
}
