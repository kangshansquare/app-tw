'use client';
import { ArrowUpOutlined, WarningFilled, SnippetsFilled, FileAddFilled, ClockCircleFilled, ExclamationCircleFilled, ArrowDownOutlined  } from '@ant-design/icons'
import { useState, useEffect } from 'react';

interface ItemCardsProps {
    totalCount: number
    detailInfo: {
        countthisWeek: number,
        compareLastWeek: number,
        compareLastMonth: number,
        countDueThisWeek: number,
        countexpired: number
    }
}


export default function ItemCards({ totalCount, detailInfo }: ItemCardsProps) {

    const { countthisWeek, compareLastWeek, compareLastMonth, countDueThisWeek, countexpired } = detailInfo
    const precent = Math.ceil(countDueThisWeek / totalCount)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex justify-between border border-gray-300  rounded-xl p-5 shadow bg-white hover:-translate-y-0.5 transition-all">
                <div className="flex flex-col gap-2">
                    <span className='text-gray-500 text-sm'>总记录数</span>
                    <h3 className='font-blod text-2xl'>{totalCount}</h3>
                    <div className="flex gap-1 text-sm">
                        { compareLastMonth > 0 ? <ArrowUpOutlined className='text-green-400' /> : <ArrowDownOutlined className='text-red-400' /> }
                        <span className='text-green-400'>{compareLastMonth}%</span>
                        <span className='text-gray-500'>较上月</span>
                    </div>
                </div>
                <div className='w-10 h-10 border bg-blue-100 rounded-full items-center flex justify-center'>
                    <SnippetsFilled className='text-blue-400 text-xl' />
                </div>
            </div>

            <div className="flex justify-between border border-gray-300  rounded-xl p-5 hover:shadow bg-white hover:-translate-y-0.5 transition-all">
                <div className="flex flex-col gap-2">
                    <span className='text-gray-500 text-sm'>本周新增</span>
                    <h3 className='font-blod text-2xl'>{countthisWeek}</h3>
                    <div className="flex gap-1 text-sm">
                        { compareLastWeek > 0 ? <ArrowUpOutlined className='text-green-400' /> : <ArrowDownOutlined className='text-red-400' /> }
                        <span className='text-green-400'>{compareLastWeek}%</span>
                        <span className='text-gray-500'>较上周</span>
                    </div>
                </div>
                <div className='w-10 h-10 border bg-green-100 rounded-full items-center flex justify-center'>
                    <FileAddFilled className='text-green-400' />
                </div>
            </div>

            <div className="flex justify-between border border-gray-300  rounded-xl p-5 hover:shadow bg-white hover:-translate-y-0.5 transition-all">
                <div className="flex flex-col gap-2">
                    <span className='text-gray-500 text-sm'>即将到期</span>
                    <h3 className='font-blod text-2xl'>{countDueThisWeek}</h3>
                    <div className="flex gap-1 text-sm">
                        {/* <ArrowUpOutlined className='text-green-400' /> */}
                        <span className='text-gray-500'>{precent}% 占比</span>
                    </div>
                </div>
                <div className='w-10 h-10 border bg-yellow-100 rounded-full items-center flex justify-center'>
                    <ClockCircleFilled className='text-yellow-400' />
                </div>
            </div>

            <div className="flex justify-between border border-gray-300  rounded-xl p-5 hover:shadow bg-white hover:-translate-y-0.5 transition-all">
                <div className="flex flex-col gap-2">
                    <span className='text-gray-500 text-sm'>待处理</span>
                    <h3 className='font-blod text-2xl'>{countexpired}</h3>
                    <div className='flex gap-1 items-center justify-center text-sm'>
                        <ExclamationCircleFilled className='text-red-500' />
                        <span className='text-gray-500'>需关注</span>
                    </div>
                </div>
                <div className='w-10 h-10 border bg-red-100 rounded-full items-center flex justify-center'>
                    <WarningFilled className='text-red-400' />
                </div>
            </div>
        </div>
    )
}