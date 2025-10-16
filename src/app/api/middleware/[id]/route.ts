import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = getUserIdFromToken();
    if (userId !== 1) {
        return NextResponse.json({ success: false, message: 'Permission denied' })
    }

    const id = params.id
    console.log('----- Delete', id)
    try {
        await prisma.middleware.delete({
            where: {
                id: Number(id)
            }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false })
    }    
} 

export async function PUT(req: NextRequest, { params }: { params: {  id: string } }) {
    const userId = getUserIdFromToken();
    if (userId !== 1) {
        return NextResponse.json({ success: false, message: 'Permission denied' })
    }

    const id = Number(params.id);
    const body = await req.json();

    console.log("======", id, body)

    try {
        await prisma.middleware.update({
            where: {
                id,
            },
            data: body
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}