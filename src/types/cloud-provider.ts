export interface CloudProviderInstance {
    instanceID: string
    name: string
    region: string
    publicIp?: string
    privateIp?: string
    createdAt: Date 
}

export interface CloudProviderHandler {
    // 列出实例(ECS/ECS2/VM)
    listInstances(credentials: any): Promise<CloudProviderInstance[]>;
    // 获取地域列表
    listRegions(credentials: any): Promise<{ regionId: string, name: string }[]>;
}

export interface CloudProviderBaseFields {
    name: string
    provider: string
}
export type CloudProviderResFields = CloudProviderBaseFields & {
    id?: number
}

export interface CloudAccountBaseFields {
    providerId: number
    name: string
    environment: string
    access_key_id: string
    secret_access_key: string
    createAt: Date
}
export type CloudAccountResFields = CloudAccountBaseFields & {
    id?: number
}

// export interface CloudCredentialsBaseFields {
//     provider_id: number
//     access_key_id: string;
//     secret_access_key: string;
//     is_valid: boolean;
//     name: string;
//     createAt?: Date 
// }
// export type CloudCredentialsResFields = CloudCredentialsBaseFields & {
//     id?: number
// }

export interface CloudRegionsBaseFields {
    provider_code: string;
    region_id: string;
    name_zh: string;
    name_en: string;
    status: 'active' | 'deprecated' | 'hidden';
    is_default: boolean;
    createAt?: Date
    updateAt?: Date
}
export type CloudRegionsResFields = CloudRegionsBaseFields & {
    id?: number
}