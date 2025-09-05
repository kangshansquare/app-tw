import { NextRequest, NextResponse } from "next/server";
import { GetAll, CreateRecord } from "@/lib/openvpn";

export async function GET(request: NextRequest) {
    
    // console.log("API GET /api/record: ", request)
    return GetAll();
}



export async function POST(request: NextRequest) {
    const body = await request.json()

    console.log("-------------API POST /api/record: ", body)

    // return NextResponse.json({ success: true, message: "test" })
    
    return CreateRecord(body)
}