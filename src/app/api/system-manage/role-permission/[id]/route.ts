import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: number } }) {
    const roleId = Number(params.id)
    console.log('----', roleId)

    return NextResponse.json({success: false, message: 'test'})
}