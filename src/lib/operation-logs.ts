import { prisma } from "@/lib/prisma";

export type LogType = '添加' | '修改' | '删除' | '启用' | '禁用';

export async function createOperationLog(params: {
    type: LogType;
    operator: string;
    ip?: string;
    content: string;
    status: "成功" | "失败"
}) {
    try {
        await prisma.logs.create({
            data: {
                type: params.type,
                operator: params.operator,
                ip: params.ip ?? null,
                content: params.content,
                status: params.status
            }
        })
    } catch(error) {
        console.error('写入操作日志失败', error)
    }
}