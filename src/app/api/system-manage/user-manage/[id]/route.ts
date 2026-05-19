import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createOperationLog } from "@/lib/operation-logs";
import { getClientIp, getTokeFromRequest, parseToken } from "@/lib/auth";
import { requireActiveUser } from "@/lib/requireActiveUser"; 



export async function PUT(req: NextRequest, { params }: { params: { id: number } }) {
    // 验证请求用户是否被禁用
    const auth = await requireActiveUser(req);
    if (!auth.ok) return auth.response

    const token = getTokeFromRequest(req);
    const info = token ? parseToken(token) : null;
    const operator = info ? info.username : "系统";
    const ip = getClientIp(req);

    const userId = Number(params.id)
    const body = await req.json()
    const hasIsActive = Object.prototype.hasOwnProperty.call(body, "isActive")
    const hasPassword = Object.prototype.hasOwnProperty.call(body, "password")
    try {
        const username = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true }
        })

        const targetUser = username?.name ?? String(userId);

        /*
        不能禁用最后一个启用的管理员
        不能删除最后一个管理员
        不能删除/禁用比当前操作人权限更高的管理员
        不能禁用自己的账号
        禁用用户，将该用户踢下线（不用即时，下一次请求踢下线即可）
        */
        
        if (hasIsActive) {
            // 禁用/启用
            await prisma.user.update({
                where: { id: userId },
                data: body
            })

            await createOperationLog({
                type: body['isActive'] ? "启用" : "禁用",
                operator,
                ip,
                content: `${body['isActive'] ? "启用" : "禁用"}用户: ${targetUser}`,
                status: '成功'
            })

            return NextResponse.json({
                success: true,
                message: "用户状态更改成功"
            })

        } else if (hasPassword) {
            // 重置密码
            const password = body['password']
            if (typeof password !== "string" || password.trim().length === 0) {
                return NextResponse.json({ succes: false, message: "密码不能为空" })
            }

            const passwordHash = await bcrypt.hash(password, 10)
            await prisma.user.update({
                where: { id: userId },
                data: { passwordHash }
            })

            await createOperationLog({
                type: '修改',
                operator,
                ip,
                content: `重置用户: ${targetUser}密码`,
                status: '成功'
            })

            return NextResponse.json({ success: true, 'message': '密码重置成功' })
    
        } else {
            // 编辑
            const updateData: { email?: string; isAdmin?: boolean } = {}
            const maybeEmail = (body as any).email
            if (maybeEmail !== undefined) {
                if (typeof maybeEmail !== "string" || maybeEmail.trim().length === 0) {
                    return NextResponse.json({ success: false, message: "邮箱不能为空" })
                }
                updateData.email = maybeEmail.trim();
            }
            const maybeIsAdmin = (body as any).isAdmin
            if (maybeIsAdmin !== undefined) {
                if (typeof maybeIsAdmin !== "boolean") {
                    return NextResponse.json({ success: false, message: "isAdmin 类型不正确" })
                }
                updateData.isAdmin = maybeIsAdmin;
            }
            if (Object.keys(updateData).length === 0) {
                return NextResponse.json({ success: false, message: "没有可更新字段" })
            }

            await prisma.user.update({
                where: { id: userId },
                data: body
            })

            await createOperationLog({
                type: '修改',
                operator,
                ip,
                content: `修改用户: ${targetUser}信息`,
                status: '成功'
            })

            return NextResponse.json({ success: true, message: '用户信息更改成功' })
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }

}


export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
    // 验证请求用户是否被禁用
    const auth = await requireActiveUser(req);
    if (!auth.ok) return auth.response

    const token = getTokeFromRequest(req);
    const info = token ? parseToken(token) : null;
    const operator = info ? info.username : "系统";
    const ip = getClientIp(req);

    const userId = Number(params.id)

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true }
        })
        const targetUser = user?.name ?? String(userId);

        await prisma.user.delete({
            where: { id: userId }
        })

        await createOperationLog({
            type: "删除",
            operator,
            ip,
            content: `删除用户: ${targetUser}`,
            status: '成功'
        })

        return NextResponse.json({ success: true, message: "用户删除成功" })

    } catch (error) {
        return NextResponse.json({ success: false, message: "服务器错误" })
    }



}