import { NextRequest, NextResponse } from "next/server";
import { ServiceLineSchema } from "@/lib/schemas/Schema"; 
import { prisma } from "@/lib/prisma";
import { success, ZodError } from "zod";


export async function PUT(req: NextRequest, { params }: { params: {id: number} }) {
    
    try {
        const id = Number(params.id);
        const body = await req.json();
        const parsed = ServiceLineSchema.partial().parse(body);
        await prisma.serviceLine.update({
            where: { id },
            data: parsed
        })
        return NextResponse.json({ success: true, message: '更新成功' })
    } catch(error) { 
        console.log(error)
        if (error instanceof ZodError) {
            return NextResponse.json({ success: false, message: '数据格式不正确' })
        }
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return NextResponse.json({ success: false, message: '无效的业务线ID' })
    }

    try {
        await prisma.serviceLine.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: '业务线删除成功' })
    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}