import { NextRequest, NextResponse } from "next/server";
import { GetAll,CreateTips, DeleteTips, UpdateTips } from "@/lib/tips";

export async function GET(request: NextRequest) {
    const url = request.url;   // http://localhost:3000/api/tips?page=1 
    
    console.log('url: ', url)
    return GetAll();
    
    
}

export async function POST(request: NextRequest) {


    // return DeleteTips();
    return CreateTips();
}

export async function UPDATE(request: NextRequest) {

    return UpdateTips();
}