import { NextResponse, NextRequest } from "next/server";
import { ServerSchema, extractCustomErrorMessage } from "@/lib/schemas/Schema";
import { prisma } from "@/lib/prisma";


export async function PUT(req: NextRequest, { params }: { params: { id: number } }) {
    const id = Number(params.id);
    const body = await req.json();

    // 前端提交的是有变化部分字段，zod进行校验前需要先查旧数据，并与提交的数据合并成包含完整字段的数据（Schema中定义的全字段）
    const existing = await prisma.server.findUnique({ where: { id } })
    if (!existing) {
        return NextResponse.json({ success: false, message: '服务器不存在' })
    }
    const merged = { ...existing, ...body }
    const parsed = ServerSchema.safeParse(merged);
    if (!parsed.success) {
        const error = extractCustomErrorMessage(parsed.error)[0]
        return NextResponse.json({ success: false, message:  String(error) || '数据格式错误' })
    }

    try {
        await prisma.server.update({
            where: { id },
            data: body
        })

        return NextResponse.json({ success: true, message: '更新成功' })
    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
    
}

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
    
    try {
        const id = Number(params.id);
        await prisma.server.delete({
            where: {
                id
            }
        })

        return NextResponse.json({ success: true, message: '删除成功' })
    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}
