import { NextRequest, NextResponse } from "next/server";
import { IpRecordResData } from "@/types/tools";
import { prisma } from "@/lib/prisma";
import { matchIpOrCidr } from "@/utils/isValidIP";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const page = Math.max(Number(searchParams.get("page")) || 1, 1)
    const pageSize = Math.max(Number(searchParams.get("pageSize")) || 6, 1)
    const skip = (page - 1) * pageSize
    const q = (searchParams.get("q") || "").trim()

    const whereFilter = q ? {
        OR: [
            { ip: { contains: q } }
        ]
    } : {}
    try {
        const [ totalCount, records, allRecords ] = await Promise.all([
            prisma.ipRecord.count({where: whereFilter}),
            prisma.ipRecord.findMany({
                where: whereFilter,
                skip,
                take: pageSize,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            q ? prisma.ipRecord.findMany({}) : Promise.resolve([])  // q存在时，返回所有records；
        ])

        const matches = q ? (allRecords.some(r => matchIpOrCidr(q as string, r.ip)) || false) : false

        
        return NextResponse.json({
            success: true,
            records,
            matches,  
            pagination: {
                page,
                pageSize,
                totalCount,
                totalPage: Math.ceil(totalCount / pageSize)
            }
        })
    } catch(error) {
        // console.log(error)
        return NextResponse.json({ success: false, message: "服务器错误" })
    }

}

export async function POST(req: NextRequest) {
    const body = await req.json()
    console.log("----", body, Array.isArray(body), typeof body)
    let normalizedIpRecord: IpRecordResData[] = []
    
    if (Array.isArray(body)) {
        if (body.length === 0) {
            return NextResponse.json({ success: false, message: "IP array cannot be empty" })
        }
        normalizedIpRecord = body;
    } else if (body && typeof body === 'object') {
        normalizedIpRecord = [body]
    } else {
        return NextResponse.json({ success: false, message: "Invalid Input: expected object or array" })
    }
    
    try {
        await prisma.$transaction(
            normalizedIpRecord.map((r) =>
                prisma.ipRecord.upsert({
                    where: { ip: r.ip },
                    update: {
                        description: r.description ?? "无"
                    },
                    create: {
                        ip: r.ip,
                        description: r.description || "无"
                    }
                })
            )
        )
        return NextResponse.json({ success: true, message: "创建成功" })

    } catch (error) {
        console.log(normalizedIpRecord)
        console.log(error)
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}