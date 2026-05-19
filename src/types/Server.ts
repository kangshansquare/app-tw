export interface ServerBaseFields {
    type: string;
    hostname: string;
    os: string;
    kernelVersion: string;
    cpuModel: string;
    cpuCores: string
    memoryGB: string
    diskTotal: string
    privateIp: string;
    publicIp?: string;
    macAddress: string
    serialNumber: string
    vendor?: string
    idcId: number
    cabinetId: number
    kvms?: number
}
export type ServerResData = ServerBaseFields & {
    id?: number
}

export interface SSHConnectionInfo {
    ip: string;
    authType: 'password' | 'secret_key';
    username: string;
    passwordOrKey: string;
    sshPort: number;
    timeout: number;
    idcId: number;
    cabinetId: number;
}