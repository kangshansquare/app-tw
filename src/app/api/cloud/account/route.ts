import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CloudAccountSchema, extractCustomErrorMessage } from "@/lib/schemas/Schema";
import { encrypt } from '@/lib/encryption/crypto-service';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const page = Math.max(Number(searchParams.get('page') || 1), 1)
    const pageSize = Math.max(Number(searchParams.get('pageSize') || 5), 1)
    const skip = (page - 1) * pageSize

    try {
        const [ totalCount, accounts ] = await Promise.all([
            prisma.cloudAccount.count(),
            prisma.cloudAccount.findMany({
                skip,
                take: pageSize,
            })
        ])

        const filter_accounts = accounts.map(account => ({
            ...account,
            secret_access_key: "******"
        }))

        return NextResponse.json({
            success: true,
            accounts: filter_accounts,
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
    try {
        const body = await req.json()
        const parsed = CloudAccountSchema.safeParse(body)
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            return NextResponse.json({ success: false, message: String(error[0]) || '数据格式错误' })
        }

        const { secret_access_key } = body
        const encrypted = encrypt(secret_access_key)

        await prisma.cloudAccount.create({
            data: {
                ...body, secret_access_key: JSON.stringify(encrypted)
            }
        })
        return NextResponse.json({ success: true, message: '凭证创建成功' })
    } catch(error) {
        console.log('--------',error)
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}