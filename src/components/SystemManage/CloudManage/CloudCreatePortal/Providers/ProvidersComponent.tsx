'use client';
import Pagination from '@/components/Pagination/Pagination';
import { CloudProviderResFields } from '@/types/cloud-provider';

interface ProvidersComponentProps {
    providersInfo: CloudProviderResFields[] | null
    pagination: { page: number, totalCount: number, totalPage: number }
    onChangePage: (page: number) => void
    isLoading: boolean
    deleteCallback: (provider: CloudProviderResFields) => void
    editCallback: (provider: CloudProviderResFields) => void
}


export default function ProvidersComponent({ providersInfo, pagination, onChangePage, isLoading, deleteCallback, editCallback }: ProvidersComponentProps) {

    if (!providersInfo) return
    return (
        <>
            <div className="">
                <table className='w-full divide-y divide-gray-50 border border-b-gray-200'>
                    <thead className='bg-gray-50 shadow-[0_1px_0_0_rgba(229,231,235,1)] sticky top-0 z-10'>
                        <tr>
                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>平台类型</th>
                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>平台名称</th>
                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {
                            providersInfo.map(provider => (
                                <tr className='hover:bg-gray-50 transition-colors h-16' key={provider.id}>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                        <div className='h-10 flex items-center'>{provider.provider}</div>
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                        <div className='h-10 flex items-center'>{provider.name}</div>
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                        <div className='h-10 flex items-center gap-4'>
                                            <button className='bg-blue-100 p-1 text-blue-600 rounded-md' onClick={() => editCallback(provider)}>编辑</button>
                                            <button className='bg-red-100 p-1 text-red-600 rounded-md' onClick={() => deleteCallback(provider)}>删除</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {
                pagination.totalCount > 5 &&
                <Pagination
                    page={pagination.page}
                    totalPage={pagination.totalPage}
                    totalCount={pagination.totalCount}
                    onChangePage={onChangePage}
                    isLoading={isLoading}
                />
            }
        </>
    )
}