'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/Pagination/Pagination";
import { useState, useEffect } from "react";
import { LogsBaseField, LogsResField } from "@/types/SystemManage";
import Notification from "@/components/Notification/Notification";
import LoadingComponent from "@/components/PublicComponents/LoadingComponent";
import NoDataComponent from "@/components/PublicComponents/NoDataComponent";

export default function LogsComponent() {
    const [ logs, setLogs ] = useState<LogsBaseField[] | null>(null)
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ totalCount, setTotalCount ] = useState<number>(0);
    const [ pagination, setPagination ] = useState<{
        page: number,
        pageSize: number,
        totalPage: number
    }>({
        page: 1,
        pageSize: 5,
        totalPage: 0
    })
    const [ notifition, setNotification ] = useState<{
        show: boolean,
        type?: "success" | "error" | "info",
        message?: string
    }>({show: false})
    const onNotiy = (type: 'success' | 'info' | 'error', message: string) => {
        setNotification({ show: true, type, message })
    }

    const [ query, setQuery ] = useState<string>("")
    const handleSearch = async () => {
        fetchLogs(1, 5, query)
    }
    const clearSearch = () => {
        setQuery("")
        fetchLogs(1,5, '')
    }
    const onChangepage = (page: number) => {
        fetchLogs(page, 5)
    }

    const fetchLogs = async (page = 1, pagesize = 5, q = '') => {
        setIsLoading(true)
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pagesize)
        })
        if (q.trim()) {
            params.set("q", q.trim())
        }
        try {
            const res = await fetch(`/api/system-manage/logs?${params.toString()}`, {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json()
            if (data.success) {
                const { logs, totalCount, pagination } = data
                setLogs(logs)
                setTotalCount(totalCount)
                setPagination(pagination)
            } else {
                onNotiy('error', String(data.message) || "数据获取失败")
            }
        } catch(error) {
            onNotiy("error", "网络异常")
        } finally {
            setIsLoading(false)
        }
        
    }

    useEffect(() => {
        fetchLogs(1, 5)
    }, [])

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl sm:text-lg font-bold">操作日志</h1>
                <p className="text-base sm:text-sm text-gray-500">查看系统用户的操作记录</p>
            </div>
            <div className="bg-white flex items-center justify-between p-5">
                <div className="flex gap-8 relative w-1/4">
                    <input 
                        className="outline-none p-2 px-4 border border-gray-200 rounded-md placeholder:text-sm placeholder:text-gray-500 w-full" 
                        placeholder="输入账号进行搜索" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                    />
                    <button 
                        className="flex gap-2 items-center absolute right-3 top-1/2 -translate-y-1/2" 
                        onClick={handleSearch}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className=" text-[#165DFF]" />
                    </button>
                    {
                        query &&
                        <button
                            type="button"
                            className='absolute right-10 top-1/2 -translate-y-1/2  rounded-full flex items-center justify-center' 
                            onClick={clearSearch}
                        >
                            <FontAwesomeIcon icon={faXmark} className="text-gray-600 text-sm" />
                        </button>
                    }
                </div>
            </div>

            {
                isLoading ? (
                    <LoadingComponent />
                ) : logs && logs.length > 0 ? (
                    <>
                        <div className="bg-white rounded-lg shadow-md min-h-[400px] flex flex-col">
                            <div className='overflow-x-auto mb-2 border border-gray-200 overflow-hidden h-[360px] rounded-md'>
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
                                        {
                                            logs.map((log, index) => (
                                                <tr className='hover:bg-gray-50 transition-colors h-16' key={index}>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{log.action_time ? new Date(log.action_time).toISOString().replace("T", " ").replace(/\.\d+Z$/, "") : '---'}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{log.operator}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{log.ip ?? "无"}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                                        <span className='p-1 px-2 line-flex items-center bg-green-200 text-green-800 rounded-md'>{log.type}</span>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{log.content}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium tracking-wider'>
                                                        <span className="p-1 px-2 line-flex items-center bg-green-200 text-green-800 rounded-md">{log.status}</span>
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
                                isLoading={isLoading}
                                onChangePage={onChangepage}
                                totalCount={totalCount}
                            />
                        </div>
                    </>
                ) : (
                    <NoDataComponent />
                )

            }


            {
                notifition.show && 
                <Notification 
                    show={notifition.show}
                    type={notifition.type}
                    message={notifition.message}
                    closeNotification={() => setNotification({...notifition, show: false})}
                />
            }
        </div>
    )
}