'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function NoPermissionView() {
    const t = useTranslations('permissions.unAuthorize');

    return (
        <div className="fixed inset-0 z-70 grid min-h-dvh place-items-center px-6 py-16 md:pl-72">
            <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
                <div className="select-none text-center mb-8">
                    <div className="text-[120px] font-black leading-none tracking-tight text-foreground/10 sm:text-[180px]">
                        403
                    </div>
                    <div className="mt-2 text-[26px] font-semibold tracking-tight text-foreground/10 sm:text-[44px]">
                        {t('title')}
                    </div>
                </div>
                <p className="max-w-md text-sm text-muted-foreground sm:text-base mb-8 ">
                    {t('message')}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                        href="/dashboard"
                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 pr-8 pl-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-primary/25 transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                        <span className="inline-block transition group-hover:translate-x-0.5">
                            →
                        </span>
                        {t('button')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
