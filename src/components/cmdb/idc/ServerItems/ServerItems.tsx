'use client';

import Pagination from "@/components/Pagination/Pagination";
import { EditFilled, DeleteFilled, EyeFilled } from "@ant-design/icons";
import { ServerResData } from "@/types/Server";

interface ServerItemsProps {
    pagination: { page: number, pageSize: number, totalPage: number };
    servers: ServerResData[] | null;
    totalCount: number;
    isLoading: boolean;
    fetchData: (page: number, pageSize: number, query: string) => void;
    query: string;
    idcs: {id: number, name: string}[] | null;
    detail: (show: boolean, server:ServerResData | null ) => void;
    edit: (show: boolean, server: ServerResData | null) => void;
    deleteCallback: (show: boolean, server: ServerResData | null) => void;
}

type ServerType = 'server' | 'kvm';
const ServerType_LABEL: Record<ServerType, string> = {
    'server': '物理机',
    'kvm': '虚拟机'
}

export default function ServerItems({ pagination, servers, totalCount, isLoading, fetchData, query, idcs, detail, edit, deleteCallback }: ServerItemsProps) {

    const onChangePage = (page: number) => {
        fetchData(page, 7, query)
    }

    if (!servers) return null;

    return (
        <div className="shadow-md h-[580px]">
            <div className="h-[490px] border border-gray-100 w-full">
                <table className='w-full divide-y divide-gray-50 border border-b-gray-200'>
                    <thead className='bg-white border-b border-gray-200 sticky top-0 z-10'>
                        <tr>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>所在机房</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>服务器品牌</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>主机名</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>IPv4地址</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>类型</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>CPU(s)</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>内存</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>系统</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>虚拟机数量</th>
                            <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>操作</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {
                            servers.map(server => (
                                <tr className='hover:bg-gray-50 transition-colors h-16' key={server.id}>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                        {idcs?.find(idc => idc.id === server.idcId)?.name ?? '-'}
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                        {server.type === 'server' ? server.vendor : '-'}
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                        {server.hostname}
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                        <p>{server.privateIp}(内)</p>
                                        { server.publicIp && <p>{server.publicIp}(公)</p> }
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                        {ServerType_LABEL[server.type as ServerType]}
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                        {server.cpuCores}
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                        {server.memoryGB}
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                        {server.os}
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                        {server.type === 'server' ? server.kvms || 0 : '-'}
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                        <div className="flex gap-3">
                                            <button title="查看详情" onClick={() => detail(true, server)}>
                                                <EyeFilled className='text-blue-500 hover:text-blue-400 text-base' />
                                            </button>
                                            <button 
                                                title='编辑' 
                                                onClick={() => edit(true, server)}
                                            >
                                                <EditFilled className='text-yellow-500 hover:text-yellow-400 text-base' />
                                            </button>
                                            <button 
                                                title='删除' 
                                                onClick={() => deleteCallback(true, server)}
                                            >
                                                <DeleteFilled className='text-red-500 hover:text-red-400 text-base' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>

            <Pagination
                page={pagination.page}
                totalPage={pagination.totalPage}
                totalCount={totalCount}
                onChangePage={onChangePage}
                isLoading={isLoading}
            />
        </div>
    )
}