'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {BarChart3, Shield, Users} from 'lucide-react';

export default function LandingPage() {
    const t = useTranslations('landing');

    return (
        <div className="min-h-screen bg-linear-to-b bg-background">
            <section className="container mx-auto px-4 py-20 md:py-32">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        {t('hero.title')}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        {t('hero.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register">
                            <Button size="lg" className="w-full sm:w-auto">
                                {t('hero.cta_primary')}
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                            {t('hero.cta_secondary')}
                        </Button>
                    </div>
                </div>
            </section>

            <section id="features" className="container mx-auto px-4 py-20 bg-popover">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('features.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t('features.subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-2 hover:border-green-500 transition bg-card">
                        <CardHeader>
                            <Users className="h-10 w-10 text-green-600 dark:text-green-400 mb-2"/>
                            <CardTitle>{t('features.feature1_title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{t('features.feature1_desc')}</CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-blue-500 transition bg-card">
                        <CardHeader>
                            <BarChart3 className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-2"/>
                            <CardTitle>{t('features.feature2_title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{t('features.feature2_desc')}</CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-purple-500 transition bg-card">
                        <CardHeader>
                            <BarChart3 className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-2"/>
                            <CardTitle>{t('features.feature3_title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{t('features.feature3_desc')}</CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-red-500 transition bg-card">
                        <CardHeader>
                            <Shield className="h-10 w-10 text-red-600 dark:text-red-400 mb-2"/>
                            <CardTitle>{t('features.feature4_title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{t('features.feature4_desc')}</CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="container mx-auto px-4 py-20">
                <div
                    className="bg-linear-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-2xl p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t('cta.title')}
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        {t('cta.subtitle')}
                    </p>
                    <Link href="/register">
                        <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-gray-100">
                            {t('cta.button')}
                        </Button>
                    </Link>
                </div>
            </section>

        </div>
    );
}