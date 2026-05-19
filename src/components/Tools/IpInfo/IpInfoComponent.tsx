'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus, faXmark, faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Notification from "@/components/Notification/Notification";
import { isValidIP } from "@/utils/isValidIP";
import BatchAddComponent from "./BatchAdd/BatchAddComponent";
import { IpRecordResData } from "@/types/tools";
import Pagination from "@/components/Pagination/Pagination";
import { matchIpOrCidr } from "@/utils/isValidIP";

export default function IpInfoCompoent() {
    const [ notifition, setNotification ] = useState<{
        show: boolean,
        type?: "success" | "error" | "info",
        message?: string
    }>({show: false})
    const onNotify = (type: "success" | "error" | "info", message: string) => {
        setNotification({ show: true, type, message })
    }

    const [ ip, setIp ] = useState<string>("")
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        setIp(e.target.value)
        setSearchFlag(true)
    }
    const [ searchResult, setSearchResult ] = useState<{
        country: string,
        city: string,
        region: string
    } | null>(null)
    const [ whiteList, setWhiteList ] = useState<boolean>(false)
    const handleSearch = async() => {
        
        if (ip.trim() === "") {
            onNotify("error", "请输入IP地址")
            return
        }
        if (!isValidIP(ip)) {
            onNotify("error", '无效IP地址')
            return
        }

        let recordArr: IpRecordResData[] | null = null

        Promise.allSettled([
            fetch(`/api/tools/ip-info?q=${ip}`).then(res => {
                if (!res.ok) onNotify('error', "获取IP信息失败")
                return res.json()
            }),
            fetch(`https://ipinfo.io/${ip}/json`).then(res => {
                if (!res.ok) onNotify("error", "调用第三方API失败")
                return res.json();
            })  
        ]).then(([myRes, thirdRes]) => {
            if (myRes.status === 'fulfilled') {
                // setRecords(myRes.value)
                const matches = myRes.value.matches
                console.log(matches, myRes.value)
                setWhiteList(matches)
                
            } else {
                setSearchResult({country: "无", city: "无", region: "无"})
                onNotify("error", "加载IP信息失败")
            }
            if (thirdRes.status ==='fulfilled') {
                
                setSearchResult({
                    country: thirdRes.value.country,
                    city: thirdRes.value.city,
                    region: thirdRes.value.region
                })
            } else {
                onNotify("error", "IP归属地信息不可用")
            }
        })

    }

    const [ pendingDeleteId, setPendingDeleteId ] = useState<number | null>(null)
    const [ deleting, setDeleting ] = useState<boolean>(false)
    const handleDelete = async (id: number) => {
        setDeleting(true)
        
        try {
            const res = await fetch(`/api/tools/ip-info/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            if (data.success) {
                fetchIpRecord()
                onNotify('success', String(data.message) || "删除成功")
                setPendingDeleteId(null)
            } else {
                onNotify('error', String(data.message) || "删除失败")
            }
        } catch (error) {
            onNotify('error', '网络异常')
        } finally {
            setDeleting(false)
        }

    }

    const [ searchFlag, setSearchFlag ] = useState<boolean>(false)
    const clearSearch = () => {
        setSearchFlag(false)
        setIp("")
        setSearchResult(null)
        setWhiteList(false)
    }

    const [ showImport, setShowImport ] = useState<boolean>(false)
    const [ ipRecord, setIpRecord ] = useState<{ip: string, description: string}>(
        {ip: "", description: ""}
    )
    // const handleInputChange = () => {
    //     setIpRecord
    // }
    const handleAddIP = async () => {
        if (!isValidIP(ipRecord.ip)) {
            onNotify('error', '无效IP')
            return
        }

        try {
            const res = await fetch('/api/tools/ip-info', {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify(ipRecord)
            })
            const data = await res.json()
            if (data.success) {
                const { records, pagination } = data
                setRecords(records)
                setPagination(pagination)
                fetchIpRecord(1, 6, "")
                onNotify('success', String(data.message) || '添加成功')
            } else {
                onNotify('error', String(data.message) || '添加失败')
            }

        } catch (error) {
            onNotify('error', '网络异常')
        }
    }

    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ records, setRecords ] = useState<IpRecordResData[] | null>(null)
    const [ pagination, setPagination ] = useState<{ page: number, totalCount: number, totalPage: number }>({
        page: 1,
        totalCount: 0,
        totalPage: 0
    })
    const fetchIpRecord = async (page = 1, pageSize = 6, q = "") => {
        setIsLoading(true)
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize)
        })
        if (q.trim()) params.set("q", q.trim())
        try {
            const res = await fetch(`/api/tools/ip-info?${params.toString()}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json();
            if (data.success) {
                const { records, pagination } = data
                setRecords(records)
                setPagination(pagination)
            }
        } catch (error) {
            onNotify("error", 'IP白名单失败')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        fetchIpRecord(page, 6, "")
    }

    useEffect(() => {
        fetchIpRecord(1, 6, "")
    }, [])

    return (
        <div className="w-full flex flex-col gap-2 border-gray-100 border-2 rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="flex flex-col gap-5 bg-white rounded-lg p-5">
                    <h3 className="p-1 font-bold">IP地址查询</h3>
                    <div className="flex flex-col gap-5">
                        <span className="text-sm text-gray-500">输入公网IP地址查询来源 (支持IPv4)</span>
                        <div className="flex items-center justify-between gap-5">
                            <div className="relativate w-[85%] relative">
                                <input 
                                    className="outline-none p-2 border border-gray-200 rounded-md placeholder:text-sm hover:border-blue-300 w-full"
                                    placeholder="例如: 8.8.8.8"
                                    name="ip"
                                    value={ip}
                                    onChange={handleSearchInputChange}
                                />
                                {
                                    searchFlag &&
                                    <button className="p-1 text-sm rounded-full bg-gray-100 absolute right-2 top-1/2 -translate-y-1/2" onClick={clearSearch}>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                }
                            </div>
                            <button className="bg-blue-600 p-2 px-4 text-white rounded-md" onClick={handleSearch}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                                查询
                            </button>
                            
                        </div>
                        <div className="bg-gray-50 rounded-lg min-h-40 p-2 flex flex-col gap-2">
                            <span className="text-gray-600 text-sm">查询结果:</span>
                            {
                                searchResult  && 
                                <>
                                    <span className="text-gray-700 text-sm">国家: {searchResult?.country ?? "无"}</span>
                                    <span className="text-gray-700 text-sm">城市: {searchResult?.city ?? "无"}</span>
                                    <span className="text-gray-700 text-sm">地域: {searchResult?.region ?? "无"}</span>
                                    <span className="text-gray-700 text-sm">是否在IP白名单: [ { whiteList ? "是" : "否" } ]</span>
                                </>
                            }
                            
                            {/* 查询是否属于阿里云/腾讯云资源  【待完成】 */}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-5 bg-white rounded-lg p-5">
                    <h3 className="font-bold p-1">IP白名单管理</h3>
                    <div className="flex flex-col gap-5">
                        <span className="text-sm text-gray-500">添加单个IP到白名单 (支持单IP或网段)</span>
                        <div className="flex flex-col gap-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <input 
                                    className="outline-none p-2 border border-gray-200 rounded-md placeholder:text-sm hover:border-blue-300"
                                    placeholder="IP/IP段 例如: 8.8.8.8, 10.0.0.0/24"
                                    name="ip"
                                    value={ipRecord.ip ?? ""}
                                    onChange={e => setIpRecord(prev => ({...prev, ip: e.target.value.trim()}))}
                                />
                                <input 
                                    className="outline-none p-2 border border-gray-200 rounded-md placeholder:text-sm hover:border-blue-300"
                                    placeholder="IP地址用途描述 例如: CDN"
                                    name="description"
                                    value={ipRecord.description ?? ""}
                                    onChange={e => setIpRecord(prev => ({...prev, description: e.target.value.trim()}))}
                                />
                            </div>
                            <div className="flex items-center justify-end gap-5">
                                <button className="bg-green-600 p-2 px-4 text-white rounded-md flex items-center gap-1" onClick={handleAddIP}>
                                    <FontAwesomeIcon icon={faPlus} />
                                    添加
                                </button>
                                <button 
                                    className="bg-green-600 p-2 px-4 text-white rounded-md flex items-center gap-1" 
                                    onClick={e => setShowImport(true)}
                                >
                                    <FontAwesomeIcon icon={faArrowUpFromBracket} />
                                    批量导入
                                </button>
                            </div>
                        </div>

                        {
                            isLoading ? 
                            <div className='flex-1 flex items-center justify-center min-h-[330px]'>
                                <div className='flex flex-col items-center gap-4'>
                                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                                    <span className='text-gray-500'>加载中....</span>
                                </div>
                            </div> :
                            records && records.length > 0 ? 
                            <>
                                <div className="flex flex-col gap-3 bg-gray-50 p-2 rounded-lg min-h-[330px]">
                                    <span className="text-sm text-gray-600">白名单列表</span>
                                    <table className='w-full divide-y divide-gray-50 '>
                                        <thead className='bg-gray-50 shadow-[0_1px_0_0_rgba(229,231,235,1)] sticky top-0 z-10'>
                                            <tr>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>IP地址/网段</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>添加日期</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>说明</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200'>
                                            {
                                                records.map(record => (
                                                    <tr className='hover:bg-gray-50 transition-colors h-6' key={record.id}>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            {record.ip}
                                                        </td>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            2026-01-12
                                                        </td>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            {record.description}
                                                        </td>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            <div className="flex gap-2 relative">
                                                                { 
                                                                    pendingDeleteId === record.id &&
                                                                    <div 
                                                                        className="absolute flex flex-col gap-2 right-0 bottom-full z-10 border border-gray-200 p-3 w-56 rounded-md bg-white" 
                                                                        onClick={e => e.stopPropagation()}
                                                                    >
                                                                        <div className="text-xs text-gray-700 mb-2">
                                                                            确认删除<span className="font-semibold">{record.ip}</span>?
                                                                        </div>
                                                                        <div className="flex justify-end gap-3">
                                                                            <button 
                                                                                className="text-xs px-2 py-1 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100" 
                                                                                onClick={() => setPendingDeleteId(null)}
                                                                                disabled={deleting}
                                                                            >
                                                                                取消
                                                                            </button>
                                                                            <button
                                                                                className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-500 disabled:opacity-60"
                                                                                onClick={() => handleDelete(record.id!)}
                                                                                disabled={deleting}
                                                                            >
                                                                                { deleting ? "删除中..." : "确认" }
                                                                            </button>
                                                                        </div>
                                                                    </div> 
                                                                }
                                                                <button className="text-red-600" onClick={() => setPendingDeleteId(record.id ?? null)}>删除</button>
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
                                    totalCount={pagination.totalCount}
                                    onChangePage={handlePageChange}
                                    isLoading={isLoading}
                                />
                            </> :
                            <div className="flex justify-center min-h-[330px]">
                                <span className="text-gray-500">暂无数据</span>
                            </div>
                        }

                    </div>
                </div>
            </div>

            {
                showImport &&
                <BatchAddComponent 
                    show={showImport}
                    onClose={() => setShowImport(false)}
                    onNotify={(type: 'success' | 'error' | 'info', message: string) => onNotify(type, message)}
                    onFetch={fetchIpRecord}
                />
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