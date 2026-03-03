export const RolesTypes = {
  ADMIN: 'admin' ,
  USER: 'user' ,
  VIEWER: 'viewer' ,
} as const;

export type RoleType = typeof RolesTypes[keyof typeof RolesTypes];

export interface Role {
  id: number;
  name: RoleType;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
}