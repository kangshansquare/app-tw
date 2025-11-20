import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { CabinetSchema } from "@/lib/schemas/Schema";

export async function PUT(req: NextRequest ,{ params }: { params: { id: number } }) {
    const id = Number(params.id);
    const body = await req.json();
    const {updateCabinet} = body
    console.log(updateCabinet)

    try {
        const parased = CabinetSchema.parse(updateCabinet)
        await prisma.cabinet.update({
            where: {
                id: updateCabinet.id
            },
            data: parased
        })
        return NextResponse.json({success: true, message: "数据更新成功"})
    } catch(error) {
        if (error instanceof ZodError) {
            return NextResponse.json({success: false, message: '数据格式错误'})
        }

        return NextResponse.json({ success: false, message: '服务器错误' })
    }

}

export async function DELETE(req: NextRequest,{params} : {params: {id: number}}) {
    const id = Number(params.id);
    console.log(id)
    try {
        await prisma.cabinet.delete({
            where: {
                id
            }
        })
        return NextResponse.json({ success: true, message: '删除成功' })
    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}