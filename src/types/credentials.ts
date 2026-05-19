export interface CredentialsBaseFields {
    provider_id: number;
    access_key_id: string;
    secret_access_key: string;
    region_id?: string;
    is_valid: boolean
}
export type CredentialsResFields = CredentialsBaseFields & {
    id?: number
}