'use client';

import React , { useEffect , useState } from 'react';
import { usePathname , useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/providers/auth-provider';
import Sidebar from '@/components/layout/sidebar/sidebar';

export default function ProtectedLayout({children}: { children: React.ReactNode }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const {user , loading , refresh} = useAuth();
  const [mounted , setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    refresh();
  } , [refresh]);

  useEffect(() => {
    if (mounted && !loading && !user) {
      const locale = pathname.split('/')[1] || 'es';
      router.replace(`/${locale}/login`);
    }
  } , [mounted , loading , user , pathname , router]);

  if (!mounted || loading) {
    return (
        <div className="flex min-h-dvh items-center justify-center bg-background">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"/>
        </div>
    );
  }

  if (!user) return null;

  return (
      <div className="min-h-dvh bg-background">
        <Sidebar/>
        <main className="md:pl-72 overflow-auto">{children}</main>
      </div>
  );
}