'use client';

import Pagination from "@/components/Pagination/Pagination";
import { EditFilled, DeleteFilled, EyeFilled } from "@ant-design/icons";

export default function ServerItems() {

    const onChangePage = (page: number) => {}

    return (
        <div className="border border-gray-100 shadow-md h-[600px]">
            <div className="h-[520px]">
                <table className='w-full divide-y divide-gray-50'>
                    <thead className='bg-white border-b border-gray-200 sticky top-0 z-10'>
                        <tr>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>所在机房</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>所在机柜</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>服务器品牌</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>主机名</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>IP地址</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>类型</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>CPU</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>内存</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>磁盘</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>系统</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>虚拟机数量</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>状态</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>操作</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        <tr className='hover:bg-gray-50 transition-colors h-16'>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                北京IDC1
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                A01-05
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                Dell PowerEdge R740
                            </td>

                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                server-001
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                192.168.1.101
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                物理机
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                Intel Xeon 4210R (20核)
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                128GB DDR4
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                ssd 8T
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                CentOS 7.9
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                3
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                运行中
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                <div className="flex gap-3">
                                    <button title="查看详情">
                                        <EyeFilled className='text-blue-500 hover:text-blue-400 text-base' />
                                    </button>
                                    <button 
                                        title='编辑' 
                                    >
                                        <EditFilled className='text-yellow-500 hover:text-yellow-400 text-base' />
                                    </button>
                                    <button 
                                        title='删除' 
                                    >
                                        <DeleteFilled className='text-red-500 hover:text-red-400 text-base' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr className='hover:bg-gray-50 transition-colors h-16'>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                北京IDC1
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                A01-05
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                Dell PowerEdge R740
                            </td>

                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                server-001
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                192.168.1.103
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                物理机
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                Intel Xeon 4210R (20核)
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                128GB DDR4
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                ssd 8T
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                CentOS 7.9
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                3
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                维护中
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                <div className="flex gap-3">
                                    <button title="查看详情">
                                        <EyeFilled className='text-blue-500 hover:text-blue-400 text-base' />
                                    </button>
                                    <button 
                                        title='编辑' 
                                    >
                                        <EditFilled className='text-yellow-500 hover:text-yellow-400 text-base' />
                                    </button>
                                    <button 
                                        title='删除' 
                                    >
                                        <DeleteFilled className='text-red-500 hover:text-red-400 text-base' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr className='hover:bg-gray-50 transition-colors h-16'>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                北京IDC1
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                A01-05
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                Dell PowerEdge R740
                            </td>

                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                server-001
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                192.168.1.102
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                物理机
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                Intel Xeon 4210R (20核)
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                128GB DDR4
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                ssd 8T
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                CentOS 7.9
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                3
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                已下架
                            </td>
                            <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                <div className="flex gap-3">
                                    <button title="查看详情">
                                        <EyeFilled className='text-blue-500 hover:text-blue-400 text-base' />
                                    </button>
                                    <button 
                                        title='编辑' 
                                    >
                                        <EditFilled className='text-yellow-500 hover:text-yellow-400 text-base' />
                                    </button>
                                    <button 
                                        title='删除' 
                                    >
                                        <DeleteFilled className='text-red-500 hover:text-red-400 text-base' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Pagination
                page={1}
                totalPage={5}
                totalCount={10}
                onChangePage={() =>onChangePage(1)}
                isLoading={false}
            />
        </div>
    )
}