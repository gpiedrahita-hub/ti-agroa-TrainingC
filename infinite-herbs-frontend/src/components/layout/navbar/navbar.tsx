'use client';

import { useSidebar } from '@/components/providers/sidebar-provider';
import { LanguageToggle } from '@/components/toggles/language-toggle';
import { ThemeToggle } from '@/components/toggles/theme-toggle';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Leaf, Menu, X } from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { useTranslations } from 'next-intl';
import { User } from "@/types/user";

export default function Navbar() {
    const t = useTranslations('navbar');
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen, setIsOpen } = useSidebar();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [mounted, setMounted] = useState(false);

    const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');
    const isLoginPage = pathname?.includes('/login');
    const isRegisterPage = pathname?.includes('/register');

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
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
                        {!isAuthPage && !isAuthenticated && (
                            <>
                                <Link
                                    href="#features"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    {t('features')}
                                </Link>
                                <Link
                                    href="#about"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    {t('about')}
                                </Link>
                                <Link
                                    href="#contact"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    {t('contact')}
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="hidden md:flex md:items-center md:gap-2">
                        {isAuthenticated && (
                            <>
                                <ThemeToggle />
                                <LanguageToggle />
                                {user && (
                                    <div
                                        className="flex items-center gap-3 rounded-xl ">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div
                                                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-400">
                                                    <span className="text-base font-bold text-white">
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="absolute -bottom-1 -right-1">
                                                    <svg className="h-4 w-4 text-green-500" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="hidden lg:block min-w-30">
                                                <p className="text-sm font-bold">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <div className="mt-1 flex items-center gap-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        {user.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {!isAuthenticated && (
                            <>
                                {isLoginPage && (
                                    <>
                                        <ThemeToggle />
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
                                        <ThemeToggle />
                                        <LanguageToggle />
                                    </>
                                )}

                                {!isAuthPage && (
                                    <>
                                        <ThemeToggle />
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
                            </>
                        )}
                    </div>

                    <div className="ml-auto flex items-center gap-2 md:hidden">
                        <ThemeToggle />
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

                {isOpen && !isAuthenticated && (
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
