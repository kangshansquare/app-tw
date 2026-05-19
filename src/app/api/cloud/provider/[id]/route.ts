import { prisma } from "@/lib/prisma";
import { CloudProviderSchema, extractCustomErrorMessage } from "@/lib/schemas/Schema";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: NextRequest,  { params }: { params: { id: number } } ) {
    const id = Number(params.id)
    try {
        await prisma.cloudProvider.delete({
            where: {
                id
            }
        })

        return NextResponse.json({ success: true, message: '删除成功' })
    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: number } }) {
    try {
        const id = Number(params.id)
        const body = await req.json();
        const parsed = CloudProviderSchema.safeParse(body)
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            return NextResponse.json({ success: false, message: String(error[0]) || '数据格式错误' })
        }
        await prisma.cloudProvider.update({
            where: { id },
            data: parsed.data
        })

        return NextResponse.json({ success: true, message: '数据更新成功' })

    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}