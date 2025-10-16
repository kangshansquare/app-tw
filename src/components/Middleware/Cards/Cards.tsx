'use client';

import { ProductOutlined, TrademarkOutlined, DatabaseFilled,FileImageOutlined, CloudOutlined } from '@ant-design/icons';

interface CardsPros {
    totalCount: number;
    typeStats?: {
        [key: string]: {
            total: number;
            cluster: number;
            single: number
        }
    } 
}

export default function Cards({ totalCount, typeStats }: CardsPros) {
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-3">
            <div className="flex justify-between p-4 shadow-sm border border-gray-100 rounded-lg hover:shadow-md transition-all bg-white">
                <div className="flex flex-col gap-2">
                    <p className='font-medium text-gray-500'>中间件总数</p>
                    <span className='font-bold text-3xl'>{totalCount}</span>
                </div>
                <div className="bg-blue-100 rounded-full h-10 w-10 p-1 flex items-center justify-center">
                    <ProductOutlined className='text-blue-500' />
                </div>
            </div>
            <div className="flex flex-col gap-2 p-4 shadow-sm border border-gray-100 rounded-lg hover:shadow-md transition-all bg-white">
                <div className="flex gap-2 justify-between">
                    <div className='flex flex-col gap-2'>
                        <p className='font-medium text-gray-500'>MySQL数量</p>
                        <span className='font-bold text-3xl'>{typeStats?.mysql?.total || 0}</span>
                    </div>
                    <div className="bg-green-100 rounded-full h-10 w-10 p-1 flex items-center justify-center">
                        <DatabaseFilled className='text-green-500' />
                    </div>
                </div>
                <div className='flex gap-2 justify-start'>
                    <span className='p-1 bg-blue-100 rounded-lg text-blue-500 text-xs'>集群: {typeStats?.mysql?.cluster || 0}</span>
                    <span className='p-1 bg-gray-100 rounded-lg text-xs'>单节点: {typeStats?.mysql.single || 0}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 p-4 shadow-sm border border-gray-100 rounded-lg hover:shadow-md transition-all bg-white">
                <div className="flex gap-2 justify-between">
                    <div className='flex flex-col gap-2'>
                        <p className='font-medium text-gray-500'>Redis数量</p>
                        <span className='font-bold text-3xl'>{typeStats?.redis?.total || 0}</span>
                    </div>
                    <div className="bg-yellow-100 rounded-full h-10 w-10 p-1 flex items-center justify-center">
                        <TrademarkOutlined className='text-yellow-500' />
                    </div>
                </div>
                <div className='flex gap-2 justify-start'>
                    <span className='p-1 bg-yellow-100 rounded-lg text-yellow-500 text-xs'>集群: {typeStats?.redis?.cluster || 0}</span>
                    <span className='p-1 bg-gray-100 rounded-lg text-xs'>单节点: {typeStats?.redis?.single || 0}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 p-4 shadow-sm border border-gray-100 rounded-lg hover:shadow-md transition-all bg-white">
                <div className="flex gap-2 justify-between">
                    <div className='flex flex-col gap-2'>
                        <p className='font-medium text-gray-500'>FastDFS数量</p>
                        <span className='font-bold text-3xl'>{typeStats?.fastdfs?.total || 0}</span>
                    </div>
                    <div className="bg-[#36CFC9]/10 rounded-full h-10 w-10 p-1 flex items-center justify-center">
                        <FileImageOutlined className='text-[#36CFC9]' />
                    </div>
                </div>
                <div className='flex gap-2 justify-start'>
                    <span className='p-1 bg-[#36CFC9]/10 rounded-lg text-[#36CFC9] text-xs'>集群: {typeStats?.fastdfs?.cluster || 0}</span>
                    <span className='p-1 bg-gray-100 rounded-lg text-xs'>单节点: {typeStats?.fastdfs?.single || 0}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 p-4 shadow-sm border border-gray-100 rounded-lg hover:shadow-md transition-all bg-white">
                <div className="flex gap-2 justify-between">
                    <div className='flex flex-col gap-2'>
                        <p className='font-medium text-gray-500'>MinIO数量</p>
                        <span className='font-bold text-3xl'>{typeStats?.minio?.total || 0}</span>
                    </div>
                    <div className="bg-[#52C41A]/10 rounded-full h-10 w-10 p-1 flex items-center justify-center">
                        <CloudOutlined className='text-[#52C41A]' />
                    </div>
                </div>
                <div className='flex gap-2 justify-start'>
                    <span className='p-1 bg-[#52C41A]/10 rounded-lg text-[#52C41A] text-xs'>集群: {typeStats?.minio?.cluster || 0}</span>
                    <span className='p-1 bg-gray-100 rounded-lg text-xs'>单节点: {typeStats?.minio?.single || 0}</span>
                </div>
            </div>
        </div>
    )
}