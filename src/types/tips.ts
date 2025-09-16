export interface TipsFormData {
    title: string;
    content: string;
    ExpireDate: Date;
    status: string;
    priority: string;
    user_id: number
}

export interface TipsData {
    id: number;
    title: string;
    content: string;
    ExpireDate: Date;
    status: string;
    priority: string;
    create_time: Date;
    update_time: Date;
}