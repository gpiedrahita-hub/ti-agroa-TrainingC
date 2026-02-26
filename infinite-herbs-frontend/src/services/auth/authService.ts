import apiClient from '@/lib/axios';
import {CreateUserRequest, LoginRequest, LoginResponse, User} from '@/types/user';
import Cookies from 'js-cookie';

export const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const {data} = await apiClient.post<LoginResponse>('/auth/login', credentials);

        if (typeof window !== 'undefined') {
            Cookies.set('accessToken', data.accessToken);
            if (data.refreshToken){
                Cookies.set('refreshToken', data.refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    async signUp(body: CreateUserRequest): Promise<void> {
        await apiClient.post<{ msg:string }>('/auth/register', body);
    },

    logout(): void {
        if (typeof window !== 'undefined') {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    },

    getCurrentUser(): User | null {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    },

    isAuthenticated(): boolean {
        if (typeof window !== 'undefined') {
            return !!Cookies.get('accessToken');
        }
        return false;
    },

    hasRole(allowedRoles: string | string[]): boolean {
        const currentUser = this.getCurrentUser();
        if (!currentUser?.role) return false;

        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        return roles.includes(currentUser.role);
    },
};