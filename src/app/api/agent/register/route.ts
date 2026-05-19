import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    // 定义api key数据模型，生成一个api key：cmdb_ak_xxxxxxxx
    // 接收Agent注册请求，请求携带register secret，secret由请求时间整点时间戳+REGISTER_SECRET hash组成
    // 返回API Key，Agent端保存到本地，并对API Key做权限控制，只允许调用数据上报接口，不允许调用资产删除/修改接口
    // Agent端更新请求携带API Key
    // 生成唯一标识AgentId：物理机 server-sn号；虚拟机 kvm-uuid；云主机 实例id 

    console.log(req.headers.get('x-api-key'))


    

    return NextResponse.json({ success: false })
}