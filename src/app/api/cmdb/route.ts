import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { ServerSchema, extractCustomErrorMessage } from "@/lib/schemas/Schema";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get('page') || 1), 1)
    const pageSize = Math.max(Number(searchParams.get('pageSize') || 5), 1)
    const q = (searchParams.get('q') || "").trim()
    const skip = (page - 1) * pageSize
    const idcIdParam = searchParams.get('idcId') || ""
    const typeParam = (searchParams.get('type') || '').trim();

    const orFilters: any[] = [];
    if (q) {
        orFilters.push(
            { hostname: { contains: q } },
            { type: { contains: q as string } },
            { serialNumber: { contains: q as string } },
            { privateIp: { contains: q as string } },
            { publicIp: { contains: q as string } }
        )
    }
    const whereFilter: any = {}
    if (orFilters.length > 0) {
        whereFilter.OR = orFilters
    }
    if (idcIdParam) {
        const idcId = Number(idcIdParam)
        if (!Number.isNaN(idcId)) {
            whereFilter.idcId = idcId
        }
    }
    if (typeParam) {
        whereFilter.type = typeParam;
    }
    

    try {
        const [ totalCount, servers ] = await Promise.all([
            prisma.server.count({ where: whereFilter }),
            prisma.server.findMany({
                where: whereFilter,
                skip,
                take: pageSize,
                orderBy: {
                    createAt: 'desc'
                }
            })
        ])

        return NextResponse.json({ 
            success: true,
            totalCount,
            servers,
            pagination: {
                page,
                pageSize,
                totalPage: Math.ceil(totalCount / pageSize)
            },
            message: '数据成功'  
        })

    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}

export async function POST(req: NextResponse) {
    // 创建前检查资产是否已存在
    const body = await req.json()
    const { data } = body
    try {
        const existing = await prisma.server.findUnique({
            where: {
                serialNumber: data.serialNumber
            }
        })
        if (existing) {
            return NextResponse.json({ success: false, message: '服务器已存在' })
        } 

        const parsed = ServerSchema.parse(data);
        await prisma.server.create({
            data:parsed
        })
        return NextResponse.json({ success: true, message: '创建成功' })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ success: false, message: '数据格式错误' })
        }
        return NextResponse.json({ success: false, message: '服务器错误' })
    }

}