'use client';

import {useMemo, useState} from 'react';
import {useRouter} from '@/i18n/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {authService} from '@/services/auth/authService';
import {Link} from '@/i18n/navigation';
import {useTranslations} from "next-intl";

export default function LoginPage() {
    const t = useTranslations('login');
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const loginSchema = useMemo(() => z.object({
        userName: z.string().min(3, {message: t('error.messages.username')}),
        password: z.string().min(6, {message: t('error.messages.password')})
    }), [t]);

    type LoginFormData = z.infer<typeof loginSchema>;

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {userName: '', password: ''}
    });

    const {register, handleSubmit, formState: {errors, isSubmitting}} = form;

    const onSubmit = handleSubmit(async (data) => {
        setError(null);
        try {
            await authService.login(data);
            router.replace('/dashboard');
        } catch (err: any) {
            setError(err?.response?.data?.message || t('error.login'));
        }
    });

    return (
        <div className="flex items-center justify-center bg-background py-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="userName">{t('label.user')}</Label>
                            <Input
                                id="userName"
                                type="text"
                                placeholder={t('placeholder.user')}
                                autoComplete="username"
                                {...register('userName')}
                            />
                            {errors.userName && (
                                <p className="text-sm text-red-500">{errors.userName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">{t('label.password')}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? t('button.loading') : t('button.login')}
                        </Button>

                        <Link href={'/'} className="block text-center text-sm text-gray-500">
                            {t('link.home')}
                        </Link>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}