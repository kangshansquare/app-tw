import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CloudProviderSchema,extractCustomErrorMessage } from "@/lib/schemas/Schema";


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const page = Math.max(Number(searchParams.get('page') || 1), 1)
    const pageSize = Math.max(Number(searchParams.get('pageSize') || 5), 1)
    const skip = (page - 1) * pageSize
    
    
    if (searchParams.get('fields') !== null) {
        try {
            const providerName = await prisma.cloudProvider.findMany({
                select: {
                    id: true,
                    name: true,
                    provider: true
                }
            })
            return NextResponse.json({ success: true, providerName })
        } catch (error) {
            return NextResponse.json({ success: false, message: '服务器错误' })
        }
    }

    try {
        const [ totalCount, providers ] = await Promise.all([
            prisma.cloudProvider.count(),
            prisma.cloudProvider.findMany({
                skip,
                take: pageSize,
            })
        ])

        return NextResponse.json({
            success: true,
            providers,
            pagination: {
                page,
                totalCount,
                totalPage: Math.ceil(totalCount / pageSize)
            },
            message: '获取成功'
        })

    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        const parsed = CloudProviderSchema.safeParse(body);
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)[0]
            return NextResponse.json({ success: false, message: String(error) || '数据格式错误' })
        }
        await prisma.cloudProvider.create({
            data: parsed.data
        })
        return NextResponse.json({ success: true, message: '创建成功' })

    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}