import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PermissionSchema,extractCustomErrorMessage } from "@/lib/schemas/Schema";

export async function PUT(req: NextRequest, { params }: { params: { id: number } }) {
    try {
        const id = await Number(params.id);
        const data = await req.json();
        const parsed = PermissionSchema.safeParse(data)
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            return NextResponse.json({success: false, message: String(error[0]) || '数据格式错误'})
        }
        await prisma.permission.update({
            where: { id },
            data: parsed.data
        })
        return NextResponse.json({success: true, message: "更新成功"})
    } catch (error) {
        return NextResponse.json({success: false, message: "服务器错误"})
    }
    
}

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
    try {
        const id = await Number(params.id)
        await prisma.permission.delete({
            where: { id }
        })
        return NextResponse.json({success: true, message: "删除成功"})
    } catch(error) {
        return NextResponse.json({success: false, message: "服务器错误"})
    }
    
}