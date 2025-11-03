'use client';
import dynamic from "next/dynamic";
import { 
    DatabaseFilled, 
    TrademarkOutlined,
    FileImageOutlined, 
    CloudOutlined 
} from '@ant-design/icons'

const BarChart = dynamic(() => import('@/components/ChartComponent/BarChart'));

export default function MiddlewareDashboard() {
    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-2">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-center sm:text-left">中间件信息统计</h2>
            <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 sm:grid-cols-1">
                <div className=" bg-white p-4 sm:p-6 rounded-md shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-2">
                    <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <div className="flex flex-col gap-1">
                            <p className="text-base sm:text-sm text-gray-500">中间总数</p>
                            <span className="text-lg sm:text-xl lg:text-2xl font-bold">3</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 bg-gray-50 p-2 rounded-md">
                        <div className="flex gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                                <p className="text-base sm:text-sm text-gray-500">Mysql数量</p>
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold">1</span>
                            </div>
                            <div className="bg-green-100 rounded-full h-10 w-10 p-1 flex items-center justify-center">
                                <DatabaseFilled className='text-green-500' />
                            </div>
                        </div>
                        <div className='flex gap-2 justify-start'>
                            <span className='p-1 bg-blue-100 rounded-lg text-blue-500 text-xs'>集群: 1</span>
                            <span className='p-1 bg-gray-100 rounded-lg text-xs'>单节点: 0</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 bg-gray-50 p-2 rounded-md">
                        <div className="flex gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                                <p className="text-base sm:text-sm text-gray-500">Redis数量</p>
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold">1</span>
                            </div>
                            <div className="bg-green-100 rounded-full h-10 w-10 p-1 flex items-center justify-center">
                                <TrademarkOutlined className='text-green-500' />
                            </div>
                        </div>
                        <div className='flex gap-2 justify-start'>
                            <span className='p-1 bg-blue-100 rounded-lg text-blue-500 text-xs'>集群: 1</span>
                            <span className='p-1 bg-gray-100 rounded-lg text-xs'>单节点: 0</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 bg-gray-50 p-2 rounded-md">
                        <div className="flex gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                                <p className="text-base sm:text-sm text-gray-500">Fastdfs数量</p>
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold">1</span>
                            </div>
                            <div className="bg-green-100 rounded-full h-10 w-10 p-1 flex items-center justify-center">
                                <FileImageOutlined className='text-green-500' />
                            </div>
                        </div>
                        <div className='flex gap-2 justify-start'>
                            <span className='p-1 bg-blue-100 rounded-lg text-blue-500 text-xs'>集群: 1</span>
                            <span className='p-1 bg-gray-100 rounded-lg text-xs'>单节点: 0</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 bg-gray-50 p-2 rounded-md">
                        <div className="flex gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                                <p className="text-base sm:text-sm text-gray-500">MinIO数量</p>
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold">1</span>
                            </div>
                            <div className="bg-green-100 rounded-full h-10 w-10 p-1 flex items-center justify-center">
                                <CloudOutlined className='text-green-500' />
                            </div>
                        </div>
                        <div className='flex gap-2 justify-start'>
                            <span className='p-1 bg-blue-100 rounded-lg text-blue-500 text-xs'>集群: 1</span>
                            <span className='p-1 bg-gray-100 rounded-lg text-xs'>单节点: 0</span>
                        </div>
                    </div>
                    
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
                    <div className="flex-1">
                        <BarChart title="中间件信息统计" label="中间件数量" />
                    </div>
                </div>
            </div>
        </div>
    )
}