import { NextResponse, NextRequest } from "next/server";
import { DeleteTips, UpdateTips } from "@/lib/tips";

export async function PUT(req: NextRequest, { params }: { params: {id: string, data: FormData} }) {
    const id = Number(params.id);
    const body = await req.json();

    const { user_id, updateData } = body;

    console.log("Udate API: ", id, user_id, updateData)

    const result = await UpdateTips(id, user_id, updateData);
    if (result) {
        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 500 } )
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    const body = await req.json();
    const { user_id } = body;

    console.log('Delete API: ', id, user_id)


    const result = await DeleteTips(id, user_id);
    if (result) {
        return NextResponse.json({  success: true})
    }

    return NextResponse.json({ success: false })
}