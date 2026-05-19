import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';


const SECRET_KEY = process.env.SECRET_KEY;

export async function Logout() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', '', { maxAge: 0, path: '/' })
    return response
}

// 后端从Cookie/Authorization头解析JWT，统一鉴权；不要信任前端传给后端的user_id
// 工具函数getUserIdFromToken，在每个接口里用解析到的userId查询数据库
export function getUserIdFromToken(): number | null {
    const cookie = cookies().get('token')?.value
    const auth = headers().get('authorization')?.replace(/^Bearer\s+/i, '');
    const token = cookie || auth;
    if (!token) return null;
    try {
        // JWT playload 结构要与登录时一致
        const playload = jwt.verify(token, SECRET_KEY!) as {
            username: string;
            userId: number;
            iat: number;
            exp: number
        }
        return playload.userId;
    } catch {
        return null
    }
}


export function getTokeFromRequest(req: NextRequest): string | null {
    const cookie = req.headers.get('cookie');
    
    const token = cookie?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    const auth = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

    
    return token || auth || null
}

export function parseToken(token: string): { username: string, userId: number } | null {
    try {
        const decoded = jwt.verify(token, SECRET_KEY!) as { username: string, userId: number };
        return { username: decoded.username, userId: decoded.userId }
    } catch(error) {
        return null
    }
}

export function getClientIp(req: NextRequest): string | undefined {
    
    return (
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        undefined
    )
}