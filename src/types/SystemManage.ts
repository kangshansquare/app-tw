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
