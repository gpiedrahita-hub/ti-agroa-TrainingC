'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Globe } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

import { LANGS } from '@/lib/languages';

export function LanguageToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    function switchLocale(nextLocale: (typeof routing.locales)[number]) {
        router.replace(pathname, { locale: nextLocale });
    }

    return (
        <div className="flex items-center gap-2 md:mr-2">

            <Select value={locale} onValueChange={switchLocale}>
                <SelectTrigger className="h-9 w-35">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                </SelectTrigger>

                <SelectContent align="end">
                    {LANGS.map((l) => (
                        <SelectItem key={l.locale} value={l.locale}>
                            <div className="flex w-full items-center justify-between gap-6">
                                <span>{l.label}</span>
                                <span className="text-xs text-muted-foreground">{l.short}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
