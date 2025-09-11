export interface OpenVPNRecordType {
    id?: number
    name: string;
    sector: string;
    account_ip: string;
    apply_date: Date;
    dest_ip: string;
    type: "open_rule" | "apply_account" | "delete_rule" | "close_account" | "account_and_rule",
    reason: string;
    apply_duration: string;
    status: "opened" | "deleted" | "closed";
    description: string;
}