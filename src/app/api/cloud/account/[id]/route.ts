import { prisma } from "@/lib/prisma";
import { CloudAccountSchema, extractCustomErrorMessage } from "@/lib/schemas/Schema";
import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/lib/encryption/crypto-service";

export async function PUT(req: NextRequest, { params }: { params: { id: number } }) {
    const id = Number(params.id)
    const body = await req.json()

    const parsed = CloudAccountSchema.safeParse(body)
    if (!parsed.success) {
        const error = extractCustomErrorMessage(parsed.error)
        return NextResponse.json({ success: false, message: String(error[0]) || "数据格式错误" })
    }

    try {
        const { secret_access_key, ...updataData } = body
        if (secret_access_key === '******') {
            await prisma.cloudAccount.update({
                where: { id },
                data: updataData
            })

            return NextResponse.json({ success: true, message: "更新成功" })
        } else {
            const encrypted = encrypt(secret_access_key)
            await prisma.cloudAccount.update({
                where: { id },
                data: {
                    ...body,
                    secret_access_key: JSON.stringify(encrypted)
                }
            })
        }

        return NextResponse.json({ success: true, message: "更新成功" })

    } catch(error) {
        
        return NextResponse.json({ success: false, message: "服务器错误" })
    }

}   

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
    const id = Number(params.id)
    try {
        await prisma.cloudAccount.delete({
            where: { id }
        })
        return NextResponse.json({ success: true, message: "删除成功" })
    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}