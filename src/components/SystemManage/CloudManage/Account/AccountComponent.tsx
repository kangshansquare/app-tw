'use client';
import Pagination from "@/components/Pagination/Pagination";
import { CloudAccountResFields } from "@/types/cloud-provider";

interface AccountComponentProps {
    pagination: { page: number, totalCount: number, totalPage: number }
    onChangePage: (page: number) => void
    isLoading: boolean
    accounts: CloudAccountResFields[] | null
    providers: {id: number, name: string, provider: string}[] | null
    onEdit: (account: CloudAccountResFields) => void
    deleteCallback: (account: CloudAccountResFields) => void
}

type ENVIRONMENT = "test" | "prod" | "pre" | "dev"
const ENVIRONMENT_LABEL: Record<ENVIRONMENT, string> = {
    test: "测试环境",
    dev: "开发环境",
    pre: "预发环境",
    prod: "生产环境"
}
 
export default function AccountComponent({ pagination, onChangePage, isLoading, accounts, providers, onEdit, deleteCallback }: AccountComponentProps) {
    console.log(accounts)

    if (!accounts) return null;
    return (
        <>
            <div className="">
                <table className='w-full divide-y divide-gray-50 border border-b-gray-200'>
                    <thead className='bg-gray-50 shadow-[0_1px_0_0_rgba(229,231,235,1)] sticky top-0 z-10'>
                        <tr>
                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>平台名称</th>
                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>账号名称</th>
                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>环境</th>
                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>AccessKey ID</th>
                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>Secret Key</th>
                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>可用域</th>
                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>创建时间</th>
                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {
                            accounts.map(account => (
                                <tr className='hover:bg-gray-50 transition-colors h-16' key={account.id}>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                        <div className='h-10 flex items-center'>{providers?.find(p => p.id === account.providerId)?.name}</div>
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                        <div className='h-10 flex items-center'>{account.name}</div>
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                        <div className='h-10 flex items-center'>{ENVIRONMENT_LABEL[account.environment as ENVIRONMENT]}</div>
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                        <div className='h-10 flex items-center'>{account.access_key_id}</div>
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                        <div className='h-10 flex items-center'>{account.secret_access_key}</div>
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                        <div className='h-10 flex items-center'>0 个</div>
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                        <div className='h-10 flex items-center'>{account.createAt ? new Date(account.createAt).toLocaleString() : '-' }</div>
                                    </td>
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                        <div className='h-10 flex items-center gap-4'>
                                            <button className='bg-blue-100 p-1 text-blue-600 rounded-md' onClick={() => onEdit(account)}>编辑</button>
                                            <button className='bg-red-100 p-1 text-red-600 rounded-md' onClick={() => deleteCallback(account)}>删除</button>
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