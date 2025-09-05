'use client';
import { ArrowUpOutlined, WarningFilled, SnippetsFilled, FileAddFilled, ClockCircleFilled, ExclamationCircleFilled  } from '@ant-design/icons'

export default function ItemCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex justify-between border border-gray-300  rounded-xl p-5 shadow bg-white hover:-translate-y-0.5 transition-all">
                <div className="flex flex-col gap-2">
                    <span className='text-gray-500 text-sm'>总记录数</span>
                    <h3 className='font-blod text-2xl'>1,284</h3>
                    <div className="flex gap-1 text-sm">
                        <ArrowUpOutlined className='text-green-400' />
                        <span className='text-green-400'>12.5%</span>
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
                    <h3 className='font-blod text-2xl'>86</h3>
                    <div className="flex gap-1 text-sm">
                        <ArrowUpOutlined className='text-green-400' />
                        <span className='text-green-400'>8.2%</span>
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
                    <h3 className='font-blod text-2xl'>12</h3>
                    <div className="flex gap-1 text-sm">
                        {/* <ArrowUpOutlined className='text-green-400' /> */}
                        <span className='text-gray-500'>2.5% 占比</span>
                    </div>
                </div>
                <div className='w-10 h-10 border bg-yellow-100 rounded-full items-center flex justify-center'>
                    <ClockCircleFilled className='text-yellow-400' />
                </div>
            </div>

            <div className="flex justify-between border border-gray-300  rounded-xl p-5 hover:shadow bg-white hover:-translate-y-0.5 transition-all">
                <div className="flex flex-col gap-2">
                    <span className='text-gray-500 text-sm'>待处理</span>
                    <h3 className='font-blod text-2xl'>4</h3>
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