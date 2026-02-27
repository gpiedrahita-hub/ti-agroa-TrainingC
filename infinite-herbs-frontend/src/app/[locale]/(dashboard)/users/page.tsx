'use client';

import {useEffect, useState} from 'react';
import {useRouter} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {userService} from '@/services/users/userService';
import {authService} from '@/services/auth/authService';
import {User} from '@/types/user';
import {Edit, Filter, Mail, MoreVertical, Plus, Search, Shield, Trash2, UserCheck, Users, UserX} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {UserFormDialog} from '@/components/users/user-form-dialog';
import {useTranslations} from 'next-intl';

export default function UsersPage() {
    const t = useTranslations('users');
    useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [allowAdmin, setAllowAdmin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    useEffect(() => {
        loadUsers();
        setAllowAdmin(authService.hasRole('admin'));
    }, []);

    useEffect(() => {
        if(searchTerm !== '') {
            const filteredUsers = users.filter(user =>
                user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setUsers(filteredUsers);
        }
    }, [searchTerm]);

    const loadUsers = async () => {
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!userToDelete) return;

        try {
            await userService.delete(userToDelete.id);
            await loadUsers();
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error('Error to delete user:', error);
        }
    };

    const openDeleteDialog = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const openEditDialog = (user: User) => {
        setUserToEdit(user);
        setFormDialogOpen(true);
    };

    const openCreateDialog = () => {
        setUserToEdit(null);
        setFormDialogOpen(true);
    };

    const handleFormSuccess = () => {
        loadUsers();
        setFormDialogOpen(false);
        setUserToEdit(null);
    };

    if (isLoading) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"/>
                    <p className="text-sm text-muted-foreground">{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-background p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <div className="rounded-lg bg-green-400 p-2">
                                <Users className="h-6 w-6 text-white"/>
                            </div>
                            {t('title')}
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            {t('subtitle')}
                        </p>
                    </div>
                    {allowAdmin && (
                        <Button
                            onClick={openCreateDialog}
                            className="gap-2 bg-green-400 text-white hover:bg-green-500"
                        >
                            <Plus className="h-4 w-4"/>
                            {t('newUser')}
                        </Button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('stats.total')}
                            </CardTitle>
                            <Users className="h-4 w-4 text-blue-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('stats.totalDesc')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('stats.active')}
                            </CardTitle>
                            <UserCheck className="h-4 w-4 text-green-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.filter(u => u.isActive).length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('stats.activeDesc')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('stats.inactive')}
                            </CardTitle>
                            <UserX className="h-4 w-4 text-red-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.filter(u => !u.isActive).length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('stats.inactiveDesc')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>{t('userList')}</CardTitle>
                                <CardDescription>{t('userListDesc')}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1 md:flex-initial">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        placeholder={t('search')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 md:w-75"
                                    />
                                </div>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">{t('table.user')}</TableHead>
                                        <TableHead className="font-semibold">{t('table.contact')}</TableHead>
                                        <TableHead className="font-semibold">{t('table.role')}</TableHead>
                                        <TableHead className="font-semibold">{t('table.status')}</TableHead>
                                        {allowAdmin && (
                                            <TableHead className="text-right font-semibold">
                                                {t('table.actions')}
                                            </TableHead>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Users className="h-8 w-8 text-muted-foreground"/>
                                                    <p className="text-sm text-muted-foreground">
                                                        {t('noResults')}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-black dark:bg-white dark:text-black text-white font-semibold">
                                                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">
                                                                {user.firstName} {user.lastName}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                @{user.userName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-muted-foreground"/>
                                                        <span className="text-sm">{user.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="gap-1">
                                                        <Shield className="h-3 w-3"/>
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.isActive ? (
                                                        <Badge
                                                            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">
                                                            <div className="mr-1 h-2 w-2 rounded-full bg-green-500"/>
                                                            {t('active')}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary"
                                                               className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200">
                                                            <div className="mr-1 h-2 w-2 rounded-full bg-red-500"/>
                                                            {t('inactive')}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                {allowAdmin && (
                                                    <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4"/>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                                                            <DropdownMenuSeparator/>
                                                            <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                                <Edit className="mr-2 h-4 w-4"/>
                                                                {t('edit')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => openDeleteDialog(user)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4"/>
                                                                {t('delete')}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteDialog.title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('deleteDialog.description')}
                            <strong> {userToDelete?.firstName} {userToDelete?.lastName}</strong>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('deleteDialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {t('deleteDialog.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* User Form Dialog */}
            <UserFormDialog
                open={formDialogOpen}
                onOpenChange={setFormDialogOpen}
                user={userToEdit}
                onSuccess={handleFormSuccess}
            />
        </div>
    );
}