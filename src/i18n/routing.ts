import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en"],
  defaultLocale: "ko",
  // Korean is the default market — don't prefix it with /ko, but /en is explicit.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
