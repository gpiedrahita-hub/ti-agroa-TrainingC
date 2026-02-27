'use client';

import {useEffect, useState} from 'react';
import {useRouter} from '@/i18n/navigation';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {authService} from '@/services/auth/authService';
import {User} from '@/types/user';
import {useTranslations} from 'next-intl';
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    DollarSign,
    Leaf,
    Package,
    ShoppingCart,
    Star,
    TrendingUp,
    Users
} from 'lucide-react';

export default function DashboardPage() {
    const t = useTranslations();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }

        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setMounted(true);
    }, [router]);

    if (!mounted) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"/>
                    <p className="text-sm text-muted-foreground">{t('legend.loading')}</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div
            className="min-h-screen bg-linear-to-br bg-background p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                            {t('dashboard.welcome')}, {user.firstName}! 👋
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            {t('dashboard.subtitle')}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Total Revenue */}
                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('dashboard.stats.revenue')}
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="flex items-center text-xs text-muted-foreground">
                                <ArrowUpRight className="mr-1 h-3 w-3 text-green-600"/>
                                <span className="text-green-600">+20.1%</span>
                                <span className="ml-1">{t('dashboard.stats.fromLastMonth')}</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Card 2: Active Users */}
                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('dashboard.stats.users')}
                            </CardTitle>
                            <Users className="h-4 w-4 text-blue-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+2,350</div>
                            <p className="flex items-center text-xs text-muted-foreground">
                                <ArrowUpRight className="mr-1 h-3 w-3 text-green-600"/>
                                <span className="text-green-600">+180</span>
                                <span className="ml-1">{t('dashboard.stats.newThisMonth')}</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Card 3: Orders */}
                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('dashboard.stats.orders')}
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-purple-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12,234</div>
                            <p className="flex items-center text-xs text-muted-foreground">
                                <ArrowDownRight className="mr-1 h-3 w-3 text-red-600"/>
                                <span className="text-red-600">-4.2%</span>
                                <span className="ml-1">{t('dashboard.stats.fromLastMonth')}</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Card 4: Products */}
                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('dashboard.stats.products')}
                            </CardTitle>
                            <Package className="h-4 w-4 text-orange-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">573</div>
                            <p className="flex items-center text-xs text-muted-foreground">
                                <ArrowUpRight className="mr-1 h-3 w-3 text-green-600"/>
                                <span className="text-green-600">+24</span>
                                <span className="ml-1">{t('dashboard.stats.newProducts')}</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Activity */}
                    <Card className="col-span-full lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5"/>
                                {t('dashboard.recentActivity')}
                            </CardTitle>
                            <CardDescription>
                                {t('dashboard.recentActivityDesc')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    {
                                        icon: ShoppingCart,
                                        color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
                                        text: 'Nueva orden recibida',
                                        time: 'Hace 2 min'
                                    },
                                    {
                                        icon: Users,
                                        color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200',
                                        text: 'Nuevo usuario registrado',
                                        time: 'Hace 15 min'
                                    },
                                    {
                                        icon: Package,
                                        color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200',
                                        text: 'Producto actualizado',
                                        time: 'Hace 1 hora'
                                    },
                                    {
                                        icon: Star,
                                        color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200',
                                        text: 'Nueva reseña 5 estrellas',
                                        time: 'Hace 3 horas'
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
                                            <item.icon className="h-5 w-5"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{item.text}</p>
                                            <p className="text-xs text-muted-foreground">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="col-span-full lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5"/>
                                {t('dashboard.quickActions')}
                            </CardTitle>
                            <CardDescription>
                                {t('dashboard.quickActionsDesc')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => router.push('/products')}
                            >
                                <Package className="mr-2 h-4 w-4"/>
                                {t('dashboard.actions.manageProducts')}
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => router.push('/users')}
                            >
                                <Users className="mr-2 h-4 w-4"/>
                                {t('dashboard.actions.manageUsers')}
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => router.push('/orders')}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4"/>
                                {t('dashboard.actions.viewOrders')}
                            </Button>
                            <Button
                                className="w-full justify-start bg-green-400"
                                onClick={() => router.push('/products/new')}
                            >
                                <Leaf className="mr-2 h-4 w-4"/>
                                {t('dashboard.actions.addProduct')}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                {t('dashboard.topProducts')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {['Lavanda Orgánica', 'Té Verde Premium', 'Menta Fresca'].map((product, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-8 w-8 rounded bg-green-400"/>
                                            <span className="text-sm font-medium">{product}</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">{234 - i * 30} ventas</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                {t('dashboard.inventory')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.inStock')}</span>
                                    <span className="font-semibold">543</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.lowStock')}</span>
                                    <span className="font-semibold text-orange-600">23</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.outOfStock')}</span>
                                    <span className="font-semibold text-red-600">7</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                {t('dashboard.performance')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span>{t('dashboard.sales')}</span>
                                        <span className="font-semibold">87%</span>
                                    </div>
                                    <div className="mt-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            className="h-2 w-[87%] rounded-full bg-green-400"/>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span>{t('dashboard.satisfaction')}</span>
                                        <span className="font-semibold">94%</span>
                                    </div>
                                    <div className="mt-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            className="h-2 w-[94%] rounded-full bg-green-400"/>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span>{t('dashboard.delivery')}</span>
                                        <span className="font-semibold">78%</span>
                                    </div>
                                    <div className="mt-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            className="h-2 w-[78%] rounded-full bg-green-400"/>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
