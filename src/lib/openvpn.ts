import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import type { OpenVPNRecordType } from "@/types/record";


type RuleType = "apply_account" | "open_rule" | "account_and_rule" | "delete_rule" | "close_account"
const RuleType_LABEL: Record<RuleType, string> = {
    apply_account: "申请账号",
    open_rule: "开通规则",
    account_and_rule: "申请账号+开通规则",
    delete_rule: "删除规则",
    close_account: "注销账号"
}


export async function GetAll() {

    try {
        const records = await prisma.openVPN.findMany();

        return NextResponse.json({ success: true, records })
    } catch (error) {
        return NextResponse.json({success: false})   
    }
   
}

export async function CreateRecord({name, sector, account_ip, apply_date, dest_ip, type, reason, apply_duration, status, description}: OpenVPNRecordType) {
    try {
        await prisma.openVPN.create({
            data: {name, sector, account_ip, apply_date, dest_ip, type, reason, apply_duration, status, description}
        })
    } catch (error) {
        return NextResponse.json({success: false})
    }

    return NextResponse.json({success: true})
}

export async function DeleteRecord(id: number) {
    try {
        await prisma.openVPN.delete({
            where: { id }
        })

        return true
    } catch (error) {
        return false
    }
}

export async function UpdateRecord(id: number, data: OpenVPNRecordType ) {

    console.log("数据更新API后端收到的", id, data)

    try {
        await prisma.openVPN.update({
            where: { id },
            data
        })
        return true
        
    } catch (error) {
        return false
    }

}