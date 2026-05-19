export interface IdcBaseFields {
    name: string;
    location?: string;
    address?: string;
    contact?: string;
    create_time?: Date
}
export type IdcResData = IdcBaseFields & {
    id?: number;
};

export interface CabinetBaseFields {
    name: string;
    idcId: number;
    uCount?: number;
    powerKw?: string;
    status?: string;
    remake?: string;
    create_time?: Date
}
export type CabinetResData = CabinetBaseFields & {
    id?: number;
}

export interface ServiceLineBaseField {
    name: string;
    owner?: string;
    email?: string;
    status?: string;
    create_time?: Date
}
export type ServiceLineResField = ServiceLineBaseField & {
    id?: number;
}

export interface LogsBaseField {
    type: string;
    operator: string;
    ip?: string;
    content: string;
    status: string;
    action_time?: Date
}
export type LogsResField = LogsBaseField & {
    id?: number;
}

export interface UserBaseField {
    name: string;
    email: string;
    create_time?: Date;
    isActive: boolean;
    isAdmin: boolean;
}
export type UserResField = UserBaseField & {
    id?: number;
}