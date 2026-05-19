import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getClientIp, getTokeFromRequest, parseToken } from "@/lib/auth";
import { createOperationLog } from "@/lib/operation-logs";



interface AuthRequest extends NextRequest {};
interface AuthResponse extends NextResponse {};

const SECRET_KEY = process.env.SECRET_KEY || '';


export async function POST(req: AuthRequest, res: AuthResponse) {

    const body = await req.json();
    const action = body?.action
    console.log("Action:", action)

    // return NextResponse.json({ success: true })

    if (action === 'login') {
        const user = await prisma.user.findUnique({
            where: {
                name: body.username,       
            }
            
        })
    
        console.log('登录请求体:', user);

        if (!user?.name) {
            return NextResponse.json({ success: false, message: '用户不存在' });
        }
        console.log(body.password, user?.passwordHash)
        const idsValid = await bcrypt.compare(body.password, user?.passwordHash);
        if (!idsValid) {
            return NextResponse.json({ success: false, message: '密码错误' });
        }
        if (!user.isActive) {
            return NextResponse.json({ success: false, message: "用户已禁用" })
        }

        // 获取用户id
        const user_id = user?.id

        const token = jwt.sign({ username: user.name, userId: user_id }, SECRET_KEY, { expiresIn: '7d' });
        const response = NextResponse.json({ success: true });
        response.cookies.set('token', token, {
            maxAge: 60 * 60 * 24 * 7, // 7天
            httpOnly: true, // 设置为 HttpOnly，防止客户端脚本访问
            secure: process.env.NODE_ENV === 'production', // 在生产环境中使用 secure 属性
            sameSite: 'strict', // 防止 CSRF 攻击
        })

        return response;
    } else if (action === 'register') {
        const existingUser = await prisma.user.findUnique({
            where: {
                name: body.username,
            }
        })

        const existingEmail = await prisma.user.findUnique({
            where: {
                email: body.email,
            }
        })

        if (existingUser?.name || existingEmail?.email) {
            return NextResponse.json({ success: false, message: '用户名或邮箱已存在' });
        }
        const passwordHash = await bcrypt.hash(body.password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: body.username,
                email: body.email,
                passwordHash: passwordHash // 使用 bcrypt 哈希密码
            }
        })

        if (!newUser) {
            return NextResponse.json({ success: false, message: '注册失败，请重试' });
        }

        // 注册成功后，添加操作日志
        // 注册时可能没有token，操作人（operation）用"系统"
        const token = getTokeFromRequest(req);
        const operationInfo = token ? parseToken(token) : null;
        const operator = operationInfo ? `${operationInfo.username}` : '系统(注册)'
        const ip = getClientIp(req);
        await createOperationLog({
            type: '添加',
            operator,
            ip,
            content: `添加了新用户${newUser.name}`,
            status: '成功'
        })

        return NextResponse.json({ success: true, message: '注册成功' });
    } else {
        return NextResponse.json({ success: false, message: "未知请求动作" }, { status: 400 })
    }
    

}