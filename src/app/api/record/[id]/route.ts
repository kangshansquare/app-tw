import { NextRequest, NextResponse } from "next/server";
import { DeleteRecord, UpdateRecord } from "@/lib/openvpn";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    const body = await request.json();
    const { updateData } = body
    
    console.log("----- PUT API /api/record/id", id, updateData)
    const result = await UpdateRecord(id, updateData)

    if (result) {
        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false })

    // return NextResponse.json({ success: true })
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    console.log("------- API Delete Record: /api/reord/id", id)

    const result = await DeleteRecord(id)
    
    if (result) {
        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false })
}