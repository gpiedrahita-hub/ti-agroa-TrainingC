import { RoleType } from '@/types/role';

export type NavItem = {
  key: string;
  label: string;
  href: string;
  roles: RoleType[];
};

export const NAV_ITEMS: NavItem[] = [
  {key: 'home' , label: 'labels.home' , href: '/dashboard' , roles: ['admin' , 'user' , 'viewer']} ,
  {key: 'users' , label: 'labels.users' , href: '/users' , roles: ['admin' , 'viewer']}
];

export function filterNavByRole(items: NavItem[] , role: RoleType) {
  return items.filter(i => i.roles.includes(role));
}
