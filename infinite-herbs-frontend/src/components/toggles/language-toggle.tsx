'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { LANGS, routing } from '@/i18n/routing';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

export function LanguageToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    function switchLocale(nextLocale: (typeof routing.locales)[number]) {
        startTransition(() => {
            const query = Object.fromEntries(searchParams.entries());
            router.replace({ pathname, query } as never, { locale: nextLocale });
            router.refresh();
        });
    }

    return (
        <div className="flex items-center gap-2 md:mr-2">
            <Select value={locale} onValueChange={switchLocale}>
                <SelectTrigger className="h-9 w-35">
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
