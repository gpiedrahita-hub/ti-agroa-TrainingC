import { LAGUAGES } from "@/lib/languages";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: LAGUAGES,
    defaultLocale: 'es',
    localePrefix: 'always'
})