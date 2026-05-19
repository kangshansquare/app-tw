import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserSchema, extractCustomErrorMessage } from "@/lib/schemas/Schema";
import bcrypt from "bcryptjs";
import { createOperationLog } from "@/lib/operation-logs";
import { getClientIp, getTokeFromRequest, parseToken } from "@/lib/auth";
import { requireActiveUser } from "@/lib/requireActiveUser";


export async function GET(req: NextRequest) {
    // 验证请求用户是否被禁用
    const auth = await requireActiveUser(req);
    if (!auth.ok) return auth.response

    const { searchParams } = new URL(req.url)
    const page = Math.max(Number(searchParams.get('page') || 1), 1)
    const pageSize = Math.max(Number(searchParams.get('pageSize') || 5), 1)
    const skip = (page - 1) * pageSize
    const q = (searchParams.get("q") || "").trim();
    const whereFilter = q ? {
        OR: [
            { name: { contains: q } }
        ]
    } : {}
    try {
        const [ totalCount, users ] = await Promise.all([
            prisma.user.count({ where: whereFilter }),
            prisma.user.findMany({
                where: whereFilter,
                skip,
                take: pageSize,
                orderBy: {
                    create_time: 'desc'
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    isActive: true,
                    isAdmin: true,
                    create_time: true
                }
            })
        ])
        console.log('----------',users)
        return NextResponse.json({
            success: true,
            users,
            pagination: {
                page,
                totalCount,
                totalPage: Math.ceil(totalCount / pageSize)
            }
        })
    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}

export async function POST(req: NextRequest) {
    // 验证请求用户是否被禁用
    const auth = await requireActiveUser(req);
    if (!auth.ok) return auth.response

    const token = getTokeFromRequest(req);
    const info = token ? parseToken(token) : null;
    const operator = info ? info.username : "系统";
    const ip = getClientIp(req);

    const body = await req.json()
    const parsed = UserSchema.safeParse(body)
    if (!parsed.success) {
        const error = extractCustomErrorMessage(parsed.error)
        return NextResponse.json({ success: false, message: String(error[0]) || '数据格式错误'})
    }

    const [ existName, existEmail ]   = await Promise.all([
        prisma.user.findUnique({ where: { name: body.name } }),
        prisma.user.findUnique({ where: { email: body.email } })
    ])
    if (existName) {
        return NextResponse.json({ success: false, message: '用户名已存在'})
    }
    if (existEmail) {
        return NextResponse.json({ success: false, message: '邮箱已存在'})
    }
    const passwordHash = await bcrypt.hash(parsed.data.password, 10)
    try {
        const newUser = await prisma.user.create({
            data: { 
                name: parsed.data.name,
                email: parsed.data.email,
                passwordHash: passwordHash
            }
        })

        await createOperationLog({
            type: "添加",
            operator,
            ip,
            content: `添加了新用户${newUser.name}`,
            status: '成功'
        })

        return NextResponse.json({ success: true, message: '创建成功' })
    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }
}