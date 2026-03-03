'use client';

import { createContext, useContext, useMemo, useState } from 'react';

type SidebarCtx = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  toggle: () => void;
  close: () => void;
};

const Ctx = createContext<SidebarCtx | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      toggle: () => setIsOpen((v) => !v),
      close: () => setIsOpen(false),
    }),
    [isOpen]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSidebar() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}
