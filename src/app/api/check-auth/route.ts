import { NextResponse, NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || '';

export async function GET(req: NextRequest) {
    const token = req.headers.get('cookie')?.replace('token=', '');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const username = (decoded as { username: string }).username;
        console.log('Decoded token:', decoded);
        return NextResponse.json({ isLogin: true, username });
    } catch (error) {
        return NextResponse.json({ isLogin: false, username: '' }, { status: 401 });
    }
}
