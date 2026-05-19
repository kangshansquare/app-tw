import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
    const id = Number(params.id)
    try {
        await prisma.ipRecord.delete({
            where: { id }
        })
        return NextResponse.json({ success: true, message: "删除成功" })
    } catch(error) {
        return NextResponse.json({ success: false, message: "服务器错误" })
    }
    
}