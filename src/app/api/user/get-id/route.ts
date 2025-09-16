import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getUserIdFrromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
    // const SECRET_KEY = process.env.SECRET_KEY || '';

    // const token = req.headers.get('cookie')?.replace('token=', '');
    // if (!token) return NextResponse.json({ success: false, message: "Unauthorized" });
    
    // const decoded = jwt.verify(token, SECRET_KEY) as { username: string, userId: number };
    // const userId = decoded.userId;

    // console.log("API: get-id", userId)

    // return NextResponse.json({ success: true, userId });

    const userId = getUserIdFrromToken();
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ success: true, userId })
}