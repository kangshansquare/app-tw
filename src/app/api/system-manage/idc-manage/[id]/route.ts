import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IdcSchema } from "@/lib/schemas/Schema";
import { ZodError } from "zod";
import { getUserIdFromToken } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {

    // 权限校验
    // const userId = getUserIdFromToken();
    // if (userId !== 1) {
    //     return NextResponse.json({ success: false, message: '无权操作' })
    // }

    const id = Number(params.id);
    if (isNaN(id)) {
        return NextResponse.json({ success: false, message: '无效的IDC ID' })
    }

    try {
        await prisma.$transaction(async (tx) => {
            const idc = await tx.idc.findUnique({
                where: { id }
            })

            if (!idc) {
                return NextResponse.json({ success: false, message: 'IDC 不存在' })
            }
            // 可选，例如不允许删除有运行中设备的idc

            const deleteCabinets = tx.cabinet.deleteMany({
                where: {
                    idcId: id
                }
            })

            const deleteIdc = tx.idc.delete({
                where: { id }
            })

            await Promise.all([deleteCabinets, deleteIdc])
        })

        return NextResponse.json({ success: true, message: 'IDC及关联机柜已删除' })
        
    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }

    // try {
    //     await prisma.idc.delete({
    //         where: { id }
    //     })
    //     return NextResponse.json({ success: true, message: '删除成功' })
    // } catch(error) {
    //     return NextResponse.json({ success: false, message: '服务器错误' })
    // }
}

export async function PUT(req: NextRequest,{ params }: { params: { id: number } }) {
    const id = Number(params.id);
    const body = await req.json();
    console.log(id, body);
    try {
        const { updataIdc } = body;
        const parased = IdcSchema.parse(updataIdc);
        await prisma.idc.update({
            where: {
                id: updataIdc.id
            },
            data: parased
        })
        return NextResponse.json({ success: true, message: '数据更新成功' })
    } catch(error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ success:false, message: '数据格式错误!' })
        }
        return NextResponse.json({ success: false, message: '服务器错误' })
    }


}