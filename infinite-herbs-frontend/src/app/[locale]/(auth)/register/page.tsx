'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth/authService';
import {Link} from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {RegisterRequest} from "@/types/user";

export default function RegisterPage() {
    const t = useTranslations('register');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const registerSchema = z.object({
        firstName: z.string().min(2, t('error.messages.firstName')),
        lastName: z.string().min(2, t('error.messages.lastName')),
        email: z.email(t('error.messages.email')),
        userName: z.string().min(3, t('error.messages.username')),
        password: z.string().min(6, t('error.messages.password')),
        confirmPassword: z.string().min(6, t('error.messages.confirmPassword')),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('error.messages.passwordMatch'),
        path: ['confirmPassword'],
    });

    type RegisterFormData = z.infer<typeof registerSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const body: RegisterRequest = {
                userName: data.userName,
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName
            }
            await authService.signUp(body);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || t('error.register'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-background px-4 py-30">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">{t('label.firstName')}</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder={t('placeholder.firstName')}
                                    {...register('firstName')}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">{t('label.lastName')}</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder={t('placeholder.lastName')}
                                    {...register('lastName')}
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{t('label.email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('placeholder.email')}
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="N">{t('label.username')}</Label>
                            <Input
                                id="userName"
                                type="text"
                                placeholder={t('placeholder.username')}
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
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{t('label.confirmPassword')}</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? t('button.loading') : t('button.register')}
                        </Button>

                        <div className="flex flex-col gap-2 text-center">
                            <Link href="/login" className="text-sm text-blue-600 hover:underline">
                                {t('link.login')}
                            </Link>
                            <Link href="/" className="text-sm text-gray-500 hover:underline">
                                {t('link.home')}
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}