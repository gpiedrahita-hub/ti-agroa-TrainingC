import apiClient from '@/lib/axios';
import { CreateUserRequest , JwtPayloadUser , LoginRequest , LoginResponse , UserInfo } from '@/types/user';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const {data} = await apiClient.post<LoginResponse>('/api/auth/login' , credentials);

    if (typeof window !== 'undefined') {
      if (data.accessToken) Cookies.set('accessToken' , data.accessToken);
      if (data.refreshToken) Cookies.set('refreshToken' , data.refreshToken);
    }

    return data;
  } ,

  async signUp(body: CreateUserRequest): Promise<void> {
    await apiClient.post<{ msg: string }>('/api/auth/register' , body);
  } ,

  logout(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  } ,

  getCurrentUser(): UserInfo | null {
    if (typeof window === 'undefined') return null;

    const token = Cookies.get('accessToken');
    if (!token) return null;
    return this._getUserInfoFromToken(token);
  } ,

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = Cookies.get('accessToken');
    return this._isTokenValid(token);
  } ,

  hasRole(allowedRoles: string | string[]): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser?.role) return false;

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(currentUser.role.name);
  } ,

  _isTokenValid(token ?: string): boolean {
    if (!token) return false;

    try {
      const {exp} = jwtDecode<{ exp?: number }>(token);
      if (!exp) return false;
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  } ,

  _getUserInfoFromToken(token?: string): UserInfo | null {
    if (!token) return null;

    try {
      const payload = jwtDecode<JwtPayloadUser>(token);
      if (!payload.sub || !payload.firstName || !payload.lastName || !payload.role) return null;
      if (!payload.exp || Date.now() >= payload.exp * 1000) return null;

      return {
        id: payload.sub ,
        firstName: payload.firstName ,
        lastName: payload.lastName ,
        role: payload.role ,
      };
    } catch {
      return null;
    }
  } ,

};

