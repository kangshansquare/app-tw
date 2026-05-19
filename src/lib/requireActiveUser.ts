import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";
import { getClientIp, getTokeFromRequest, parseToken } from "./auth";

export async function requireActiveUser(req: NextRequest) {
    const token = getTokeFromRequest(req);
    const info = token ? parseToken(token) : null;
    if (!info) {
        return {
            ok: false,
            response: NextResponse.json({ success: false, message: "Unauthorized" })
        }
    }

    const me = await prisma.user.findUnique({
        where: { id: info.userId },
        select: { id: true, isActive: true }
    });

    if (!me?.isActive) {
        const response = NextResponse.json({ success: false, message: "用户已禁用" })
        response.cookies.set("token", "", { maxAge: 0, path: "/" })
        return { ok: false,  response}
    }

    return {
        ok: true,
        userId: info.userId,
        username: info.username,
        ip: getClientIp(req)
    }
}