'use client'

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Leaf, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageToggle } from '@/components/toggles/language-toggle';

export default function Navbar() {
    const t = useTranslations('navbar');
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');
    const isLoginPage = pathname?.includes('/login');
    const isRegisterPage = pathname?.includes('/register');

    useEffect(() => {
        setMounted(true);
    }, [pathname]);

    const toggleMenu = () => setIsOpen(!isOpen);

    if (!mounted) {
        return null;
    }

    return (
        <nav
            className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center">
                    <Link href="#" className="flex items-center space-x-2">
                        <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
                        <span className="text-xl font-bold">{t('title')}</span>
                    </Link>
                    <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:gap-6">

                    </div>

                    <div className="hidden md:flex md:items-center md:gap-2">
                        {isLoginPage && (
                            <>
                                <LanguageToggle />
                                <Button
                                    onClick={() => router.push('/register')}
                                    variant="default"
                                    size="sm"
                                >
                                    {t('register')}
                                </Button>
                            </>
                        )}

                        {isRegisterPage && (
                            <>
                                <LanguageToggle />
                            </>
                        )}

                        {!isAuthPage && (
                            <>
                                <LanguageToggle />
                                <Button
                                    onClick={() => router.push('/login')}
                                    variant="outline"
                                    size="sm"
                                >
                                    {t('login')}
                                </Button>
                                <Button
                                    onClick={() => router.push('/register')}
                                    variant="default"
                                    size="sm"
                                >
                                    {t('register')}
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="ml-auto flex items-center gap-2 md:hidden">
                        <LanguageToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {isOpen && (
                    <div className="border-t py-4 md:hidden">
                        <div className="flex flex-col space-y-3">
                            <>
                                {isLoginPage && (
                                    <Button
                                        onClick={() => {
                                            router.push('/register');
                                            setIsOpen(false);
                                        }}
                                        variant="default"
                                        className="w-full"
                                    >
                                        {t('register')}
                                    </Button>
                                )}

                                {!isAuthPage && (
                                    <>
                                        <Button
                                            onClick={() => {
                                                router.push('/login');
                                                setIsOpen(false);
                                            }}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            {t('login')}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                router.push('/register');
                                                setIsOpen(false);
                                            }}
                                            variant="default"
                                            className="w-full"
                                        >
                                            {t('register')}
                                        </Button>
                                    </>
                                )}
                            </>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
