import { NextRequest, NextResponse } from "next/server";
import {  DeleteTips, UpdateTips } from "@/lib/tips";
import { prisma } from "@/lib/prisma";
import { getDateRange } from "@/utils/dateRange";


import { getUserIdFrromToken } from "@/lib/auth";


export async function GET(request: NextRequest) {
    const url = request.url;   // http://localhost:3000/api/tips?page=1 

    const guft = getUserIdFrromToken();
    console.log("统一鉴权，从token中获取userId: ", guft)
    
    const { searchParams } = new URL(url)

    const user_id = Number(searchParams.get('user_id'))

    console.log("后端接收到userID: ", user_id)

    // const page = Math.max(Number(searchParams.get('page')) || 1, 1)
    // const pageSize = Math.max(Number(searchParams.get('pageSize')) || 5, 1)
    // const skip = (page - 1) * pageSize

    const today = getDateRange('today');
    const thisWeek = getDateRange('week')
    const thisMonth = getDateRange('month');
    const lastWeek = getDateRange('lastWeek')
    const lastMonth = getDateRange('lastMonth')
    
    try {
        const [ totalCount, 
                items, 
                countThisWeek, 
                countThisMonth, 
                countDueThisWeek, 
                countDone,
                countExpired, 
                countPending,
                countLastWeek
            ] = await Promise.all([
            prisma.tips.count({
                where: {
                    user_id,
                }
            }),
            prisma.tips.findMany({
                where: {
                    user_id,
                },
                orderBy: {
                    'create_time': 'desc'
                }
            }),
            prisma.tips.count({
                where: {
                    AND: [
                        { user_id },
                        {
                            create_time: {
                                gte: thisWeek.start,
                                lte: thisWeek.end
                            }
                        }
                    ]
                }
                
            }),
            prisma.tips.count({
                where: {
                    AND: [
                        { user_id },
                        {
                            create_time: {
                                gte: thisMonth.start,
                                lte: thisMonth.end
                            }
                        }
                    ]
                }
            }),
            prisma.tips.count({
                where: {
                    AND: [
                        { user_id },
                        {
                            ExpireDate: {
                                gte: thisWeek.start,
                                lte: thisWeek.end
                            }
                        }
                    ]
                }
            }),
            prisma.tips.count({
                where: {
                    AND: [
                        { user_id },
                        {
                            status: "done"
                        }
                    ]
                }
            }),
            prisma.tips.count({
                where: {
                    AND: [
                        { user_id },
                        {
                            status: "pending"
                        },
                        {
                            ExpireDate: {
                                lte: today.end
                            }
                        }
                    ]
                }
            }),
            prisma.tips.count({
                where: {
                    AND: [
                        { user_id },
                        {
                            status: "pending"
                        }
                    ]
                }
            }),
            prisma.tips.count({
                where: {
                    AND: [
                        { user_id },
                        {
                            create_time: {
                                gte: lastWeek.start,
                                lte: lastWeek.end
                            }
                        }
                    ]
                }
            })
        ]);

        console.log('--------------后端查询Tips',items)

        return NextResponse.json({
            success: true,
            tips: items,
            pagination: {
                totalCount,
            },
            detailInfo: {
                countThisWeek,
                countThisMonth,
                countDueThisWeek,
                countDone,
                countExpired,
                countPending,
                percent_done: Math.ceil(countDone / totalCount),
                compare_last_week: countThisWeek - countLastWeek
            }
        })
    } catch (error) {
        return NextResponse.json({ success: false })
    }


   
    
    // return GetAll(Number(user_id));
    
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const { tip, user_id } = body

    console.log("Create tips api: ", tip, user_id)
    
    try {
        await prisma.tips.create({
            data: {
                ...tip, user_id
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false })
    }
    
}

// export async function UPDATE(request: NextRequest) {
//     const body = await request.json();

//     console.log("Update api: ", body)

//     // return UpdateTips();
// }