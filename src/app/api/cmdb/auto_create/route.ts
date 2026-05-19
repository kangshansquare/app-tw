import { NextResponse, NextRequest } from "next/server";
import { SSHConnectionInfoSchema } from "@/lib/schemas/Schema"; 

export async function POST(req: NextRequest) {
    // 先判断ssh信息（zod），用接收到是ssh信息连接远程主机收集配置信息
    // 
    // 注意事项：
	//	(1).禁止将密码/密钥存储到数据库、文件、localStorage、Cookie等，仅在ssh连接时临时使用
	//	(2).接口启用https
	//	(3).对同一IP/账号限制SSH连接重试次数（如5分钟最多3次重试，超过则临时封禁）
	//	(4).所有采集命令均为固定字符（定义一个白名单变量）
	//	(5).限制同时SSH连接的数量

    const body = await req.json()
    const { data } = body
    console.log("自动添加接口", data)


    return NextResponse.json({ success: false, message: '测试' })
}