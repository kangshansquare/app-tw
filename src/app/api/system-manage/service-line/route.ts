import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { ServiceLineSchema } from '@/lib/schemas/Schema';
import { success, ZodError } from 'zod';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get('page') || 1), 1)
    const pageSize = Math.max(Number(searchParams.get('pageSize') || 5), 1)
    const skip = (page - 1) * pageSize

    const q = (searchParams.get('q') || "").trim();
    console.log(q)
    const whereFilter = q ? {
        OR: [
            { 
                name: { 
                    contains: q as string,
                }
            }
        ]
    } : {}

    try {
        const [ totalCount, items ] = await Promise.all([
            prisma.serviceLine.count({ where: whereFilter }),
            prisma.serviceLine.findMany({
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
            totalCount,
            items,
            pagination: {
                page,
                totalPage: Math.ceil(totalCount / pageSize)
            }
        })

    } catch (error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}

export async function POST(req: NextRequest) {
    
    try {
        const body = await req.json()
        const parsed = ServiceLineSchema.parse(body)
        await prisma.serviceLine.create({
            data: parsed
        })

        return NextResponse.json({ success: true, message: '创建成功' })
    } catch(error) {
        console.log(error)
        if (error instanceof ZodError) {
            return NextResponse.json({ success: false, message: '数据格式错误' })
        }

        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}