'use client';

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
// import { useRouter, useSearchParams, usePathname } from 'next/navigation'
 
interface PaginationProps {
    page: number
    totalPage: number
    totalCount: number
    onChangePage: (page: number) => void
    isLoading: boolean
}



export default function Pagination({ page, totalPage, totalCount, onChangePage, isLoading }: PaginationProps) {

    return (
        <div className='p-5 flex justify-between items-center'>
            <span className='text-sm text-gray-400 font-medium'>共{totalPage}页,{totalCount}条记录</span>
            <nav className='flex items-center justify-center gap-2 shadow-sm'>
                <button 
                    className='border border-gray-200 p-2 text-sm rounded-l-md hover:bg-gray-50' 
                    onClick={() => onChangePage(1)}
                    disabled={isLoading || page === 1}
                >
                    第一页
                </button>
                <button 
                    className={`border border-gray-200 p-2 text-sm hover:bg-gray-50 ${page === 1 ? "hover:cursor-not-allowed" : ""}`} 
                    onClick={() => onChangePage(page === 1 ? 1 : page - 1)} 
                    disabled={isLoading || page === 1} 
                >
                    <LeftOutlined />
                </button>
                <span className='bg-gray-100 p-2'>第 {page} / {totalPage} 页</span>
                <button 
                    className={`border border-gray-300 p-2 text-sm hover:bg-gray-50 ${totalPage === page ? "hover:cursor-not-allowed" : ""}`} 
                    onClick={() => onChangePage(page === totalPage ? totalPage : page + 1)} 
                    disabled={isLoading || totalPage === page} 
                >
                    <RightOutlined />
                </button>
                <button 
                    className='border border-gray-200 p-2 text-sm rounded-r-md hover:bg-gray-50' 
                    onClick={() => onChangePage(totalPage)} 
                    disabled={isLoading || page === totalPage}
                >
                    最后一页
                </button>
            </nav>
        </div>
    )
}