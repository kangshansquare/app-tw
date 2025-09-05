'use client';

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
 

export default function Pagination() {
    return (
        <div className='p-5 flex justify-between'>
            <span className='text-sm text-gray-400 font-medium'>共xxx条记录</span>
            <nav className='-space-x-px shadow-sm'>
                <button className='border border-gray-200 p-2 text-sm rounded-l-md hover:bg-gray-50'>第一页</button>
                <button className='border border-gray-200 p-2 text-sm hover:bg-gray-50'>
                    <LeftOutlined />
                </button>
                <button className='border border-gray-300 p-2 text-sm px-4 bg-blue-700 text-white'>1</button>
                <button className='border border-gray-300 p-2 text-sm px-4 hover:bg-gray-50'>2</button>
                <button className='border border-gray-300 p-2 text-sm hover:bg-gray-50'>
                    <RightOutlined />
                </button>
                <button className='border border-gray-200 p-2 text-sm rounded-r-md hover:bg-gray-50'>最后一页</button>
            </nav>
        </div>
    )
}