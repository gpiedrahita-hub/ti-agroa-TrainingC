export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName?: string;
  isActive?: boolean;
  email: string;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
}