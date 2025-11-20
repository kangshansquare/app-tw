import { NextRequest, NextResponse } from "next/server";
import { IdcSchema } from "@/lib/schemas/Schema";
import { prisma } from "@/lib/prisma";
import { z } from 'zod'


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    if (searchParams.get('fields') !== null) {
        try {
            const idcs  = await prisma.idc.findMany({
                select: {
                    id: true,
                    name: true
                }
            })



            return NextResponse.json({
                success: true,
                idcs
            })
        } catch(error) {
            return NextResponse.json({
                success: false,
                message: '服务器错误'
            })
        }
    }
    
    console.log("111", searchParams)
    console.log(searchParams.get('fields'))

    const page = Math.max(Number(searchParams.get('page') || 1), 1)
    const pageSize = Math.max(Number(searchParams.get('pageSize') || 5), 1)
    const skip = (page - 1) * pageSize

    console.log(page , pageSize)

    const q = (searchParams.get("q") || "").trim();
    const whereFilter = q ? {
        OR: [
            { name: { contains: q } }
        ]
    } : {}

    try {
        const [ totalCount, items ] = await Promise.all([
            prisma.idc.count(),
            prisma.idc.findMany({
                where: whereFilter,
                skip,
                take: pageSize,
                orderBy: {
                    create_time: 'desc'
                }
            })
        ])

        return NextResponse.json({ 
            success: true, 
            idcs: items, 
            totalCount,
            pagination: {
                page,
                pageSize,
                totalPage: Math.ceil(totalCount / pageSize)
            } 
        })

    } catch(error) {
        return NextResponse.json({ success: false })
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        
        const parased = IdcSchema.parse(data);
        
        await prisma.idc.create({data: parased})

        return NextResponse.json({ success: true })

    } catch (error) {
        console.log(error instanceof z.ZodError)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, message: '数据格式不正确' })
        }

        return NextResponse.json({ success: false, message: '服务器错误'})
    }

}