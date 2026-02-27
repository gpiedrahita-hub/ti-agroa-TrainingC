'use client';

import { useSidebar } from '@/components/providers/sidebar-provider';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { filterNavByRole, NAV_ITEMS } from '@/lib/auth/roles';
import { authService } from '@/services/auth/authService';
import { useTranslations } from 'next-intl';
import type { Role } from '@/types/role';
import NavLink from '@/components/nav/navlink';
import { Button } from '@/components/ui/button';
import { X, LogOut } from 'lucide-react';

export default function Sidebar() {
  const t = useTranslations('sidebar');
  const { isOpen, toggle, close } = useSidebar();
  const pathname = usePathname();
  const [role, setRole] = useState<Role>('user');

  useEffect(() => {
    const user = authService.getCurrentUser();
    setRole(user?.role ?? 'user');
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') toggle();
    }
    if (isOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const items = useMemo(() => filterNavByRole(NAV_ITEMS, role), [role]);

  async function handleLogout() {
    await authService.logout?.();
  }

  const renderNav = (onNavigate?: () => void) => (
    <div className="flex h-full min-h-0 flex-col bg-background md:mt-16">
      <nav className="p-3 flex-1 min-h-0 overflow-auto">
        <div className="px-2 pb-2 text-[11px] font-semibold tracking-wide text-muted-foreground">
          {t('navigation')}
        </div>

        <div className="space-y-1">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <NavLink
                key={item.key}
                href={item.href}
                label={item.label}
                active={active}
                onClick={onNavigate}
              />
            );
          })}
        </div>
      </nav>

      <div className="mt-auto border-t border-border p-3">
        <Button
          type="button"
          variant="ghost"
          onClick={async () => {
            onNavigate?.();
            await handleLogout();
          }}
          className="w-full justify-center gap-2 rounded-xl px-3 py-2.5 bg-slate-500/10 hover:text-rose-600"
        >
          <LogOut className="h-4 w-4" />
          <span>{t('logout')}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-72 md:flex-col md:border-r md:border-border md:bg-background">
        {renderNav()}
      </aside>

      {/* Mobile drawer */}
      <div
        className={
          'md:hidden fixed inset-0 z-50 ' +
          (isOpen ? 'pointer-events-auto' : 'pointer-events-none')
        }
        aria-hidden={!isOpen}
      >
        <div
          className={
            'absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity ' +
            (isOpen ? 'opacity-100' : 'opacity-0')
          }
          onClick={close}
        />

        <div
          id="mobile-sidebar"
          role="dialog"
          aria-modal="true"
          className={'absolute right-0 top-0 h-full w-[86%] max-w-sm bg-background shadow-2xl' + 
            'border-l border-border flex flex-col transition-transform duration-200 ease-out ' +
            (isOpen ? 'translate-x-0' : 'translate-x-full')
          }
        >

          {/* Close icon */}
          <div className="h-14 px-3 flex items-center justify-end border-b border-border">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={close}
              aria-label={t('close')}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {renderNav(close)}
        </div>
      </div>

      {/* Spacer desktop */}
      <div className="hidden md:block md:w-72" />
    </>
  );
}