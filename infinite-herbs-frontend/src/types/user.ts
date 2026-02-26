import { Role } from "./role";

export interface User {
    id: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    userName: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
    user: User;
}

export interface RegisterRequest {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface CreateUserRequest extends RegisterRequest {
    role?: string;
}

export interface UpdateUserRequest {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    isActive?: boolean;
}