import { NextResponse } from "next/server";

export async function Logout() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', '', { maxAge: 0, path: '/' })
    return response
}