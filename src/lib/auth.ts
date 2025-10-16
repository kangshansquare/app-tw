import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
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

