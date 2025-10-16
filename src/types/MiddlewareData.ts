export interface ClusterNode {
    id?: number;
    cluster_ip_port: string;
    role?: string;
    group_name?: string
}

export interface MiddlewareData {
    id?: number;
    type: string;
    name: string;
    version: string;
    service_line?: string;
    deploy_mode: string;
    ip_port?: string;
    cluster_config?: ClusterNode[];
    description?: string;
    note?: string
    user_id?: number;
    create_time?: Date;
    update_time?: Date;
}

export interface MiddlewareFormData {
    type: string;
    name: string;
    version: string;
    service_line: string;
    deploy_mode: string;
    ip_port: string;
    cluster_config: Array<{
        id: number;
        cluster_ip_port: string;
        role: string;
        group_name: string;
    }>;
    description: string;
    note: string;
}