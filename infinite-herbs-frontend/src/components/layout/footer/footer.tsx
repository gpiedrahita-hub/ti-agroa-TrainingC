'use client';

import { useTranslations } from 'next-intl';
import { Leaf } from 'lucide-react';
import { useSidebar } from '@/components/providers/sidebar-provider';

export function Footer() {
  const t = useTranslations('footer');
  const  {isOpen} = useSidebar();

  return (
      <div className={`'bg-linear-to-b bg-background' ${!isOpen ? 'md:pl-72': ''}`}>
        <footer className="border-t bg-card">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400 md:hidden"/>
                <span className="font-semibold text-gray-900 dark:text-white  md:hidden">{t('title')}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © 2026 {t('title')} {t('rights')}.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#"
                   className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm">
                  {t('privacy')}
                </a>
                <a href="#"
                   className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm">
                  {t('terms')}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}