import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TipsFormData } from "@/types/tips";


export async function GetAll(user_id: number | null) {

    if (user_id === null) return NextResponse.json({ success: false })

    
    function getStatus(tip: { ExpireDate: Date, status: string }) {
        const now = new Date();
        const expire = new Date(tip.ExpireDate)

        if (tip.status === '已完成') return '已完成';
        if (expire < now) return '已逾期';

        return '未完成';
    }

    try {

        const tips = await prisma.tips.findMany({
            where: {
                user_id: user_id
            }
        })

        const tipsWithStatus = tips.map(tip => ({
            ...tip,
            status: getStatus(tip)
        }))


        return NextResponse.json({ success: true, tips: tipsWithStatus })

    } catch (error) {
        return NextResponse.json({ success: false })
    }
    
}

export async function CreateTips({ title, content, ExpireDate, priority, status, user_id }: TipsFormData) {

    // console.log({ title, content, ExpireDate, priority, status, user_id })
    

    try {
        await prisma.tips.create({
            data: { title, content, ExpireDate: new Date(ExpireDate), status, priority, user_id }
        })
    } catch (error) {
        console.log("创建失败！", error)
        return NextResponse.json({ success: false })
    }

    const response = NextResponse.json({
        success: true
    })
    return response;
}

export async function DeleteTips(id: number, user_id: number) {
    try {
        await prisma.tips.delete({
            where: { id, user_id }
        })

        return true
    } catch (error) {
        console.log("删除失败", error)
        // return NextResponse.json({ success: false })
        return false
    }

}

export async function UpdateTips(id: number, user_id: number, data: Partial<TipsFormData>) {
    console.log("API 接收到的更新数据: ", data)


    try {
        await prisma.tips.update({
            where: { id, user_id },
            data
        });

        return true
    } catch (error) {
        console.log("错误: ", error)
        return false
    }
}