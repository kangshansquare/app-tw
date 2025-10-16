import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";
import { MiddlewareData } from "@/types/MiddlewareData";
import { Prisma } from "@prisma/client";


export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url)

    const page = Math.max(Number(searchParams.get('page') || 1), 1)
    const pageSize = Math.max(Number(searchParams.get('pageSize') || 5), 1)
    const query = (searchParams.get('q') || "").trim()
    const skip = (page - 1) * pageSize

    const type = (searchParams.get("type") || "").trim();         // 中间件分类按钮传入
    // 动态where子句
    const whereConds: Prisma.Sql[] = []
    if (type && type !== 'all') {
        whereConds.push(Prisma.sql`\`type\` = ${type}`)
    }
    
    if (query) {
        const like = `%${query}%`
        whereConds.push(
            Prisma.sql`
                (
                    \`name\` LIKE ${like}
                    OR \`ip_port\` LIKE ${like}
                    OR (\`cluster_config\` IS NOT NULL
                        AND JSON_SEARCH(\`cluster_config\`, 'one', ${like}) IS NOT NULL)
                )
            `
        )
    }

    const whereSql: Prisma.Sql = whereConds.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereConds, ' AND ')}`
        : Prisma.empty;

    try {
        // 获取各类型中间件统计（仅在无筛选条件时）
        const stats = await prisma.$queryRaw<{
            type: string,
            total: bigint,
            cluster: bigint,
            single: bigint
        }[]>`
            SELECT 
                \`type\`,
                COUNT(*) as total,
                SUM(CASE WHEN \`deploy_mode\` = 'cluster' THEN 1 ELSE 0 END) as cluster,
                SUM(CASE WHEN \`deploy_mode\` = 'single' THEN 1 ELSE 0 END) as single
            FROM \`Middleware\`
            GROUP BY \`type\`
        `;

        const typeStats = stats.reduce((acc, row) => {
            acc[row.type] = {
                total: Number(row.total),
                cluster: Number(row.cluster),
                single: Number(row.single)
            };
            return acc;
        }, {} as Record<string, { total: number, cluster: number, single: number }>)

        const globalTotalCount = stats.reduce((sum, row) => sum + Number(row.total), 0);
        
        const countRows = await prisma.$queryRaw<{ cnt: bigint | number }[]>`
            SELECT COUNT(*) AS cnt
            FROM \`Middleware\`
            ${whereSql}
        `;

        const filteredCount = Number(countRows[0]?.cnt || 0);

        const items = await prisma.$queryRaw<any[]>`
            SELECT *
            FROM \`Middleware\`
            ${whereSql}
            ORDER BY \`create_time\` DESC
            LIMIT ${pageSize} OFFSET ${skip}
        `;

        return NextResponse.json({
            success: true,
            pagination: {
                page,
                filteredCount,
                totalPage: Math.ceil(filteredCount / pageSize)
            },
            items,
            typeStats,
            globalTotalCount
        })

    } catch (error) {
        return NextResponse.json({ success: false })
    }

 
}

export async function POST(req: NextRequest) {
    const user_id = getUserIdFromToken()
    if (!user_id) return NextResponse.json({ success: false, message: 'Unauthorized' })


    const body: MiddlewareData = await req.json();
    console.log('---------', body)
    
    try {
        await prisma.middleware.create({ 
            data: {
                ...body,
                user_id
            } as any
         })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.log("Error createing middleware: ", error)
        return NextResponse.json({ success: false })
    }

    
}