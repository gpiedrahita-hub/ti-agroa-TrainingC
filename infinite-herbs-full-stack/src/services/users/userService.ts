import apiClient from '@/lib/axios';
import {CreateUserRequest, UpdateUserRequest, User} from '@/types/user';

export const userService = {
    async getAll(): Promise<User[]> {
        const {data} = await apiClient.get<User[]>('/api/users');
        return data;
    },

    async getById(id: string): Promise<User> {
        const {data} = await apiClient.get<User>(`/api/users/${id}`);
        return data;
    },

    async create(user: CreateUserRequest): Promise<User> {
        const {data} = await apiClient.post<User>('/api/users', user);
        return data;
    },

    async update(id: string, user: UpdateUserRequest): Promise<User> {
        const {data} = await apiClient.put<User>(`/api/users/${id}`, user);
        return data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/api/users/${id}`);
    },
};
