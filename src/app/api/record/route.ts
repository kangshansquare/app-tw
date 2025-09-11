import { NextRequest, NextResponse } from "next/server";
import { GetAll, CreateRecord } from "@/lib/openvpn";
import { prisma } from "@/lib/prisma";
import { getDateRange } from "@/utils/dateRange";
import { json } from "stream/consumers";
import { ColumnWidthOutlined } from "@ant-design/icons";

export async function GET(request: NextRequest) {
    
    // console.log("API GET /api/record: ", request)
    // return GetAll();

    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1)
    const pageSize = Math.max(Number(searchParams.get("pageSize")) || 6, 1)
    const skip = (page - 1) * pageSize

    // 搜索
    const q = (searchParams.get("q") || "").trim();
    

    console.log("后端接收到的参数：", page, pageSize, q)

    const whereFilter = q ? {
        OR: [
            { name: { contains: q} },
            { account_ip: { contains: q } },
            { dest_ip: { contains: q } }
        ]
    } : {}


    const today = getDateRange("today");
    const thisWeek = getDateRange("week");
    const lastWeek = getDateRange("lastWeek");
    const thisMonth = getDateRange("month");
    const lastMonth = getDateRange("lastMonth")
    

    try {
        const [ totalCount, items, countthisWeek, countlastWeek, countthisMonth, countlastMonth, hasExpireItems ] = await Promise.all([
            prisma.openVPN.count(),
            prisma.openVPN.findMany({
                where: whereFilter,           
                skip,
                take: pageSize,
                orderBy: {
                    apply_date: 'desc'
                }
            }),
            prisma.openVPN.count({
                where: {
                    apply_date: {
                        gte: thisWeek.start,
                        lte: thisWeek.end
                    },
                },
            }),
            prisma.openVPN.count({
                where:{
                    apply_date: {
                        gte: lastWeek.start,
                        lte: lastWeek.end
                    },
                },
            }),
            prisma.openVPN.count({
                where: {
                    apply_date: {
                        gte: thisMonth.start,
                        lte: thisMonth.end
                    },
                },
            }),
            prisma.openVPN.count({
                where: {
                    apply_date: {
                        gte: lastMonth.start,
                        lte: lastMonth.end
                    },
                },
            }),
            prisma.openVPN.findMany({
                where: {
                    AND: [
                        {
                            NOT: [
                                { apply_duration: "永久" },
                                { apply_duration: "" }
                            ]
                        },
                        { 
                            NOT: [
                                { status: "deleted" },
                                { status: "closed" }
                            ]
                         }
                    ]
                }
            })
            
        ])

        const calcGroupth = (current: number, previous: number) => {
            if (previous === 0) return current === 0 ? 0 : 100;
            return Math.round(((current - previous) / previous) * 100);
        }

        console.log("加搜索后：", items)

        return NextResponse.json({
            success: true,
            records: items,
            pagination: {
                page,
                pageSize,
                totalCount,
                totalPage: Math.ceil(totalCount / pageSize)
            },
            detailInfo: {
                countthisWeek,
                compareLastWeek: calcGroupth(countthisWeek, countlastWeek),
                compareLastMonth: calcGroupth(countthisMonth,  countlastMonth),
                countDueThisWeek: hasExpireItems.filter(item => {
                    const d = new Date(item.apply_duration);
                    return !Number.isNaN(d.getTime()) && d >= today.start && d <= thisWeek.end;
                }).length,
                countexpired: hasExpireItems.filter(item => {
                    const d = new Date(item.apply_duration);
                    return !Number.isNaN(d.getTime()) && d <= today.start;
                }).length
            }

        })

    } catch (error) {
        return NextResponse.json({ success: false })
    }



    // try {
    //     const items = await prisma.openVPN.findMany({
    //         skip,
    //         take: pageSize,
    //         orderBy: {
    //             apply_date: 'desc'
    //         }
    //     });

    //     // 共有多少条数据
    //     const totalCount = await prisma.openVPN.count();

    //     return NextResponse.json({
    //         success: true,
    //         records: items,
    //         pagination: {
    //             page,
    //             pageSize,
    //             totalCount,
    //             totalPage: Math.ceil(totalCount / pageSize)
    //         }
    //     })

    // } catch (error) {
    //     return NextResponse.json({ success: false })
    // }


    // return NextResponse.json({ success: true, record: null })
}



export async function POST(request: NextRequest) {
    const body = await request.json()

    console.log("-------------API POST /api/record: ", body)

    // return NextResponse.json({ success: true, message: "test" })
    
    return CreateRecord(body)
}