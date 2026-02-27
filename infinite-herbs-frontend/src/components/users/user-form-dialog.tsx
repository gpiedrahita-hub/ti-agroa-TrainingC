'use client';

import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Switch} from '@/components/ui/switch';
import {userService} from '@/services/users/userService';
import {CreateUserRequest, User} from '@/types/user';
import {useTranslations} from 'next-intl';
import {Edit, Loader2, Plus} from 'lucide-react';

interface UserFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onSuccess: () => void;
}

export function UserFormDialog({open, onOpenChange, user, onSuccess}: UserFormDialogProps) {
    const t = useTranslations('users.form');
    const [isLoading, setIsLoading] = useState(false);

    const userSchema = z.object({
        userName: z.string().min(3, t('error.messages.username')),
        email: z.email(t('error.messages.email')),
        firstName: z.string().min(2, t('error.messages.firstName')),
        lastName: z.string().min(2, t('error.messages.lastName')),
        password: z.string().min(6, t('error.messages.password')).optional().or(z.literal('')),
        role: z.enum(['admin', 'user', 'viewer']),
        isActive: z.boolean(),
    });

    type UserFormData = z.infer<typeof userSchema>;

    const form = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            userName: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            role: 'user',
            isActive: true,
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                userName: user.userName,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: '',
                role: user.role as 'admin' | 'user' | 'viewer',
                isActive: user.isActive,
            });
        } else {
            form.reset({
                userName: '',
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                role: 'user',
                isActive: true,
            });
        }
    }, [user, form]);

    const onSubmit = async (data: UserFormData) => {
        setIsLoading(true);
        try {
            if (user) {
                // Editar
                const updateData = {...data};
                if (!updateData.password) {
                    delete updateData.password;
                }
                await userService.update(user.id, updateData);
            } else {
                await userService.create(data as CreateUserRequest);
            }
            onSuccess();
            form.reset();
        } catch (error: any) {
            console.error('Error:', error);
            alert(error.response?.data?.message || t('error.messages.saved'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="rounded-lg bg-green-400 p-2">
                            <span className="text-lg text-white">
                                {user ? <Edit className="h-4 w-4"/> : <Plus className="h-4 w-4"/>}
                            </span>
                        </div>
                        {user ? t('editTitle') : t('createTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {user ? t('editDescription') : t('createDescription')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* First Name */}
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>{t('firstName')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Juan" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Last Name */}
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>{t('lastName')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Pérez" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Username */}
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t('username')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="juanperez" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {t('usernameDesc')}
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t('email')}</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="juan@ejemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('password')} {user && t('passwordOptional')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={user ? t('passwordPlaceholder') : '••••••••'}
                                            {...field}
                                        />
                                    </FormControl>
                                    {user && (
                                        <FormDescription>
                                            {t('passwordDesc')}
                                        </FormDescription>
                                    )}
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Role */}
                            <FormField
                                control={form.control}
                                name="role"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>{t('role')}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('selectRole')}/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="user">{t('roleUser')}</SelectItem>
                                                <SelectItem value="viewer">{t('roleViewer')}</SelectItem>
                                                <SelectItem value="admin">{t('roleAdmin')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Active Status */}
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({field}) => (
                                    <FormItem
                                        className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                {t('active')}
                                            </FormLabel>
                                            <FormDescription>
                                                {t('activeDesc')}
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                {t('cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-linear-to-r bg-green-400 text-white hover:bg-green-500"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {user ? t('update') : t('create')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}