import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PermissionSchema, extractCustomErrorMessage } from "@/lib/schemas/Schema";
import { createOperationLog } from "@/lib/operation-logs";
import { getClientIp, getTokeFromRequest, parseToken } from "@/lib/auth";
import { requireActiveUser } from "@/lib/requireActiveUser"; 


export async function GET(req: NextRequest) {
    try {
        const permissions =  await prisma.permission.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ success: true, permissions })

    } catch (error) {  
        
        return NextResponse.json({  success: false, message: "服务器错误"})
    }
}

export async function POST(req: NextRequest) {
    // 操作日志
    const auth = await requireActiveUser(req)
    if (!auth.ok) return auth.response

    const token = getTokeFromRequest(req);
    const info = token ? parseToken(token) : null;
    const operator = info ? info.username : "系统";
    const ip = getClientIp(req);


    const body = await req.json();
    const parsed = PermissionSchema.safeParse(body);
    if (!parsed.success) {
        const error = extractCustomErrorMessage(parsed.error)
        return NextResponse.json({ success: false, message: String(error[0]) || "数据格式错误" })
    }

    try {
        const permission = await prisma.permission.create({
            data: parsed.data
        })

        await createOperationLog({
            type: '添加',
            operator,
            ip,
            content: `添加了权限: ${permission.name}`,
            status: '成功'
        })

        return NextResponse.json({ success: true, message: "创建成功" })
    } catch (error) {
        
        return NextResponse.json({ success: false, message: "服务器错误" })
    }
}