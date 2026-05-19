
export interface RoleBaseFields {
    code: string;
    name: string;
    version?: number;
    isSystem: boolean;
    description?: string
}
export type RoleResFields = RoleBaseFields & {
    id?: number
}

export interface PermissionBaseFields {
    name: string;
    code: string;
    module: string;
    action: string;
    description?: string | null;
    createdAt?: Date
    updatedAt?: Date
}
export type PermissionResFields = PermissionBaseFields & {
    id?: number
}



export type NavItem = {
    id: number;
    module: string; // 导航栏名称
    action: string; // view
    name: string;
    code: string;
};
type DataActionItem = {
    id: number;
    action: string; // read/write/delete...
    name: string;
    code: string;
};
export type DataItem = {
    module: string; // 数据管理名称，如“中间件管理”
    actions: DataActionItem[];
};
export type ModuleNode = {
    node: "导航栏管理" | "数据管理";
    nav?: NavItem[];
    data?: DataItem[];
};
export interface AuthorizedBaseFields {
    name: string;
    permissions: {id: number, name: string}[]
}
export type AuthorizedResFields = AuthorizedBaseFields & {
    id?: number
}
export interface AuthorizedConfigResponse {
    role: RoleResFields;
    permissionTree: ModuleNode[];
    selectPermissionIds: number[];
}
export interface saveRolePermissionsPayload {
    roleId: number;
    permissionIds: number[];
}





export interface RolePermissionBaseFields {
    roleId: number;
    permissionId: number;
}
export type RolePermissionResFields = RolePermissionBaseFields & {
    id: number;
}













export interface UserRoleBaseFields {
    userId: number;
    roleId: number;
}
export type UserRoleResFields = UserRoleBaseFields & {
    id?: number
}
