'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/Pagination/Pagination";
import { useState } from "react";

export default function CabinetManageComponent() {
    const [ page, setPage ] = useState<number>(1)
    const [ totalPage, setTotalPage ] = useState<number>(0);
    const [ totalCount, setTotalCount ] = useState<number>(0);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const onChangePage = (page: number) => {}

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl sm:text-lg font-bold">机柜信息</h1>
                <p className="text-base sm:text-sm text-gray-500">管理各机房的机柜详细信息</p>
            </div>
            <div className="bg-white flex items-center justify-between p-5">
                <div className="flex gap-8">
                    <input 
                        className="outline-none p-2 px-4 border border-gray-200 rounded-md placeholder:text-sm placeholder:text-gray-500" 
                        placeholder="搜索机柜编号" 
                    />
                    <button className="bg-[#165DFF] flex gap-2 items-center p-2 px-4 rounded-md text-white hover:-translate-y-1 duration-300">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" />
                        搜索
                    </button>
                </div>
                <button className="bg-[#00B42A] flex gap-2 items-center p-2 rounded-md text-white hover:-translate-y-1 duration-300">
                    <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                    添加机柜
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md min-h-[500px] flex flex-col">
                <div className='overflow-x-auto mb-2 border border-gray-200 overflow-hidden h-[430px] rounded-md'>
                    <table className='w-full divide-y divide-gray-50'>
                        <thead className='bg-gray-50 border-b border-gray-200 sticky top-0 z-10'>
                            <tr>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>机柜编号</th>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>所属机房</th>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>U位数量</th>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>已使用U位</th>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>状态</th>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>业务线</th>
                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            <tr className='hover:bg-gray-50 transition-colors h-16'>
                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                    <div className='h-10 flex items-center'>BJEZ-001</div>
                                </td>
                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                    <div className='h-10 flex items-center'>北京亦庄数据中心</div>
                                </td>
                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                    <div className='h-10 flex items-center'>42U</div>
                                </td>
                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                    <span className='p-1 px-2 line-flex items-center'>28U(66%)</span>
                                </td>
                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                    <span className='p-1 px-2 line-flex items-center bg-green-200 text-green-800 rounded-md'>在用</span>
                                </td>
                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                    <div className='h-10 flex items-center'>电商平台</div>
                                </td>
                                <td className='px-5 py-3 text-left text-xs font-medium tracking-wider align-top'>
                                    <div className="h-10 flex gap-4 items-center">
                                        <button className="text-[#165DFF]">编辑</button>
                                        <button className="">设备列表</button>
                                    </div>
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