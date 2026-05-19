import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    
    const { searchParams } = new URL(req.url)
    const page = Math.max(Number(searchParams.get('page') || 1), 1)
    const pageSize = Math.max(Number(searchParams.get('pageSize') || 5), 1)
    const skip = (page - 1) * pageSize
    const q = (searchParams.get("q") || "").trim();
    const whereFilter = q ? {
        OR: [
            { operator: { contains: q } },
            { type: { contains: q } }
        ]
    } : {}

    try {
        const [ totalCount, items ] = await Promise.all([
            prisma.logs.count(),
            prisma.logs.findMany({
                where: whereFilter,
                skip,
                take: pageSize,
                orderBy: {
                    action_time: 'desc'
                }
            })
        ])

        return NextResponse.json({ 
            success: true, 
            logs: items, 
            totalCount,
            pagination: {
                page,
                pageSize,
                totalPage: Math.ceil(totalCount / pageSize)
            } 
        })

    } catch(error) {
        return NextResponse.json({ success: false, message: "服务器错误" })
    }

}