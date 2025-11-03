'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/Pagination/Pagination";
import { useState } from "react";

export default function LogsComponent() {
    const [ page, setPage ] = useState<number>(1)
    const [ totalPage, setTotalPage ] = useState<number>(0);
    const [ totalCount, setTotalCount ] = useState<number>(0);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const onChangePage = (page: number) => {}

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl sm:text-lg font-bold">操作日志</h1>
                <p className="text-base sm:text-sm text-gray-500">查看系统用户的操作记录</p>
            </div>
            <div className="bg-white flex items-center justify-between p-5">
                <div className="flex gap-8">
                    <input 
                        className="outline-none p-2 px-4 border border-gray-200 rounded-md placeholder:text-sm placeholder:text-gray-500" 
                        placeholder="搜索操作内容" 
                    />
                    <button className="bg-[#165DFF] flex gap-2 items-center p-2 px-4 rounded-md text-white hover:-translate-y-1 duration-300">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" />
                        搜索
                    </button>
                </div>
                <button className="bg-gray-200 flex gap-2 items-center p-2 rounded-md text-gray-600 hover:-translate-y-1 duration-300">
                    <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
                    导出日志
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md min-h-[500px] flex flex-col">
                <div className='overflow-x-auto mb-2 border border-gray-200 overflow-hidden h-[430px] rounded-md'>
                    <table className='w-full divide-y divide-gray-50'>
                        <thead className='bg-gray-50 border-b border-gray-200 sticky top-0 z-10'>
                            <tr>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作时间</th>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作人</th>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>IP地址</th>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作类型</th>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作内容</th>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>状态</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            <tr className='hover:bg-gray-50 transition-colors h-16'>
                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                    <div className='h-10 flex items-center'>2023-08-15 14:32:25</div>
                                </td>
                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                    <div className='h-10 flex items-center'>admin(管理员)</div>
                                </td>
                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                    <div className='h-10 flex items-center'>192.168.1.100</div>
                                </td>
                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                    <span className='p-1 px-2 line-flex items-center bg-green-200 text-green-800 rounded-md'>添加</span>
                                </td>
                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                    <div className='h-10 flex items-center'>添加了新用户"老杨"</div>
                                </td>
                                <td className='px-5 py-3 text-left text-xs font-medium tracking-wider'>
                                    <span className="p-1 px-2 line-flex items-center bg-green-200 text-green-800 rounded-md">成功</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination page={page} totalCount={totalPage} totalPage={totalCount} onChangePage={onChangePage} isLoading={isLoading} />
            </div>
        </div>
    )
}