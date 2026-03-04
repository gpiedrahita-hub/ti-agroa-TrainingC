'use client';

import { usePathname } from '@/i18n/navigation';
import { filterNavByRole , NAV_ITEMS } from '@/lib/auth/roles';
import { useAuth } from '@/components/providers/auth-provider';
import { NavLink } from '@/components/nav/nav-link';

export default function SidebarLinks() {
  const {user} = useAuth();
  const pathname = usePathname();

  const items = filterNavByRole(NAV_ITEMS , user?.role.name || 'user');

  return (
      <div className="space-y-1">
        {items.map((item) => {
          const norm = (s: string) => (s.length > 1 ? s.replace(/\/+$/ , '') : s);
          const active = norm(pathname) === norm(item.href) || norm(pathname).startsWith(norm(item.href) + '/');

          return (
              <NavLink
                  key={item.key}
                  href={item.href}
                  label={item.label}
                  active={active}
              />
          );
        })}
      </div>
  );
}