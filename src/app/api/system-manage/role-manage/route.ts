import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { RoleSchema, extractCustomErrorMessage } from "@/lib/schemas/Schema";
import { createOperationLog } from "@/lib/operation-logs";
import { parseToken, getClientIp, getTokeFromRequest } from "@/lib/auth"; 
import { requireActiveUser } from "@/lib/requireActiveUser"; 

export async function GET(req: NextRequest) {
    
    try {
        const roles =  await prisma.role.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        console.log('Roles-------------', roles)
        return NextResponse.json({ success: true, roles })
    } catch (error) {  
        console.log('--------------------',error)
        return NextResponse.json({  success: false, message: "服务器错误"})
    }
}

export async function POST(req: NextRequest) {
    // 操作日志
    const auth = await requireActiveUser(req)
    if (!auth.ok) return auth.response

    const token = getTokeFromRequest(req)
    const info = token ? parseToken(token) : null;
    const operator = info ? info.username : "系统";
    const ip = getClientIp(req);

    const data = await req.json();
    const { role } = data
    const parsed = RoleSchema.safeParse(role)
    if (!parsed.success) {
        const error = extractCustomErrorMessage(parsed.error) 
        return NextResponse.json({ success: false, message: String(error[0]) || "数据格式错误" })
    }


    try {
        const role = await prisma.role.create({
            data: parsed.data
        })

        await createOperationLog({
            type: '添加',
            operator,
            ip,
            content: `添加了角色: ${role.name}`,
            status: '成功'
        })

        return NextResponse.json({ success: true, message: "Role创建成功" })
    } catch (error) {
        return NextResponse.json({ success: false, message: "服务器错误" })
    }
}