import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { CabinetSchema } from '@/lib/schemas/Schema';
import { ZodError } from "zod";


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    if (searchParams.get('fields') !== null) {
        try {
            const cabinets  = await prisma.cabinet.findMany({
                select: {
                    id: true,
                    name: true,
                    idcId: true
                }
            })
            return NextResponse.json({
                success: true,
                cabinets
            })
        } catch(error) {
            return NextResponse.json({
                success: false,
                message: '服务器错误'
            })
        }
    }

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
            },
            { 
                idc: { 
                    name: { 
                        contains: q as string,
                    } 
                } 
            }
        ]
    } : {}

    try {
        const [ totalCount, items ] = await Promise.all([
            prisma.cabinet.count({ where: whereFilter }),
            prisma.cabinet.findMany({
                where: whereFilter,
                skip,
                take: pageSize,
                orderBy: {
                    create_time: 'desc'
                }
            })
        ])

        console.log(items)

        return NextResponse.json({
            success: true,
            cabinets: items,
            totalCount,
            pagination: {
                page,
                totalPage: Math.ceil(totalCount / pageSize)
            }
        })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}

export async function POST(req: NextRequest) {
    try {
        const data =  await req.json()
        const { cabinetData } = data
        const parased = CabinetSchema.parse(cabinetData)
        await prisma.cabinet.create({
            data: parased
        })

        return NextResponse.json({success: true})
    } catch(error) {
        if (error instanceof ZodError) {
            console.log(error)
            return NextResponse.json({ success: false, message: '数据格式不正确' })
        }
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}