export interface IpRecordBaseData {
    ip: string
    description?: string;
}

export type IpRecordResData = IpRecordBaseData & {
    id?: number
}