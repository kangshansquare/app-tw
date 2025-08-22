import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    const SECRET_KEY = process.env.SECRET_KEY || '';

    const token = req.headers.get('cookie')?.replace('token=', '');
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" });
    
    const decoded = jwt.verify(token, SECRET_KEY) as { username: string, userId: number };
    const userId = decoded.userId;

    console.log("API: get-id", userId)

    return NextResponse.json({ success: true, userId });
}