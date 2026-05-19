import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ServerSchema } from "@/lib/schemas/Schema";
import {  ZodError } from "zod";
import { getChangedFields } from "@/utils/getChangedFields";

export async function POST(req: NextRequest) {
    
    const api_key = req.headers.get('x-api-key')
    if (!api_key) {
        return NextResponse.json({ success: false, message: 'API key is required' }, { status: 401 })
    }
    
    try {
        const body = await req.json()
        const parsed = ServerSchema.parse(body);
        const result = await prisma.$transaction(async(tx) => {
            const server = await tx.server.findUnique({
                where: {
                    serialNumber: parsed.serialNumber
                }
            });
            if (!server) {
                await tx.server.create({
                   data: {
                    ...parsed,
                    lastSyncAt: new Date(),
                   }
                })

                return { action: 'created' }
            } else {
                const changedFields = getChangedFields(server, parsed)
                const hasChanges = Object.keys(changedFields).length > 0;


                await tx.server.update({
                    where: { serialNumber: parsed.serialNumber },
                    data: hasChanges ? {
                        ...changedFields,
                        lastSyncAt: new Date(),
                    } : {
                        lastSyncAt: new Date()
                    }
                    
                })

                return { action: hasChanges ? 'updated' : 'synced' }

            }

        });

        const messageMap: Record<string, string> = {
            'created': '服务器创建成功',
            'updated': '服务器信息已更新',
            'synced': '服务器无变更,仅更新时间'
        }

        return NextResponse.json({ 
            success: true, message: messageMap[result.action] ?? '操作成' 
        })

        
    } catch(error) {
        console.log(error)
        if (error instanceof ZodError) {
            return NextResponse.json({ success: false, message: "数据格式错误", errors: error.flatten().fieldErrors })
        }

        return NextResponse.json({ success: false, message: '服务器错误' })
    }

}

