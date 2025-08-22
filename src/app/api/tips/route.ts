import { NextRequest, NextResponse } from "next/server";
import { GetAll,CreateTips, DeleteTips, UpdateTips } from "@/lib/tips";




export async function GET(request: NextRequest) {
    const url = request.url;   // http://localhost:3000/api/tips?page=1 
    
    const { searchParams } = new URL(request.url)

    const user_id = searchParams.get('user_id')
    

    console.log('url: ', url)
    
    return GetAll(Number(user_id));
    
    
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    console.log("Create tips api: ", body)
    
    // return DeleteTips();
    return CreateTips(body);
}

export async function UPDATE(request: NextRequest) {
    const body = await request.json();

    console.log("Update api: ", body)

    // return UpdateTips();
}