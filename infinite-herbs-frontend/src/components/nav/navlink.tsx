'use client';

import { Link , usePathname } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function NavLink({
                          href ,
                          label ,
                        }: {
  href: string;
  label: string;
}) {
  const t = useTranslations('sidebar');
  const pathname = usePathname();

  const norm = (s: string) => (s.length > 1 ? s.replace(/\/+$/ , '') : s);
  const active = norm(pathname) === norm(href) || norm(pathname).startsWith(norm(href) + '/');

  return (
      <Link
          prefetch={false}
          href={href}
          aria-current={active ? 'page' : undefined}
          className={[
            'group relative flex items-center justify-between rounded-2xl transition' ,
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/30' ,
            'px-4 py-3 text-[15px] md:px-3 md:py-2.5 md:text-sm' ,
            active
                ? 'bg-green-400 text-white shadow-[0_12px_28px_-16px_rgba(16,185,129,1)]'
                : 'text-foreground/80 hover:bg-muted hover:text-foreground' ,
          ].join(' ')}
      >
      <span
          className={[
            'absolute left-2 top-3 h-6 md:h-4 w-1 rounded-full' ,
            active ? 'bg-white/80' : 'bg-transparent group-hover:bg-border' ,
          ].join(' ')}
      />
        <span className="pl-3 font-semibold">{t(label)}</span>
        <ChevronRight
            className={[
              'transition-opacity' ,
              'size-5 md:size-4' ,
              active ? 'opacity-100' : 'opacity-40 group-hover:opacity-60' ,
            ].join(' ')}
            aria-hidden="true"
        />
      </Link>
  );
}