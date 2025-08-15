import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GetAll() {

    const tips = await prisma.tips.findMany()

    const response = NextResponse.json([
        {id: 1, title: "禁用openvpn用户", content: '禁用openvpn用户username',ExpireDate:'2025-8-1', status: 'running'},
        {id: 2, title: "禁用openvpn用户", content: '禁用openvpn用户username1',ExpireDate:'2025-6-30', status: 'completed'},
        {id: 3, title: "删除openvpn规则", content: 'iptables -t nat -D POSTROUTING -o br0 -s 172.19.5.26 -d 192.168.23.203/32 -p tcp -m multiport --dports 9023,9223 -j SNAT --to-source 172.18.30.11',ExpireDate:'2025-7-1', status: 'completed'},
    ])
    
    return response
}

export async function CreateTips() {

    const response = NextResponse.json({
        success: true
    })
    return response;
}

export async function DeleteTips() {}

export async function UpdateTips() {}