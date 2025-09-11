'use client';

import { PlusSquareFilled, SearchOutlined, EyeFilled, EditFilled, DeleteFilled, CloseOutlined } from '@ant-design/icons';
import ItemCards from './ItemCards/ItemCards';
import Notification from '@/components/Notification/Notification';
import React, { useEffect, useState } from 'react';
import CreateRecord from './CreateRecord/CreateRecord';
import DetailRecord from './DetailRecord/DetailRecord';
import EditRecord from './EditRecord/EditRecord';
import DeleteRecord from './DeleteRecord/DeleteRecord';


import type { OpenVPNRecordType } from '@/types/record';
import Pagination from '@/components/Pagination/Pagination';



type RuleType = "apply_account" | "open_rule" | "account_and_rule" | "delete_rule" | "close_account"
const RuleType_LABEL: Record<RuleType, string> = {
    apply_account: "申请账号",
    open_rule: "开通规则",
    account_and_rule: "申请账号+开通规则",
    delete_rule: "删除规则",
    close_account: "注销账号"
}

type StatusType = "opened" | "deleted" | "closed"
const StatusType_LABEL: Record<StatusType, string> = {
    opened: "已开通",
    deleted: "已删除",
    closed: "已注销"
}



export default function OpenVPN() {

    const [ page, setPage ] = useState<number>(1)
    
    const [ totalPage, setTotalPage ] = useState<number>(0)
    const [ totalCount, setTotalCount ] = useState<number>(0)

    const [ detailInfo, setDetailInfo ] = useState<{ 
        countthisWeek: number,
        compareLastWeek: number,
        compareLastMonth: number,
        countDueThisWeek: number,
        countexpired: number
    }>({
        countthisWeek: 0,
        compareLastWeek: 0,
        compareLastMonth: 0,
        countDueThisWeek: 0,
        countexpired: 0
    })
    

    const [ recordData, setRecordData ] = useState<OpenVPNRecordType[] | null>(null)
    const [ isLoading, setIsLoading ] = useState<boolean>(false)

    const fetchRecords = async (currentPage = 1,pageSize = 6, q = "") => {
        console.log("执行了fetchRecord函数")
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                page: String(currentPage),
                pageSize: String(pageSize),
            });
            if (q.trim()) params.set("q", q.trim());

            const res = await fetch(`/api/record?${params.toString()}`, {
                method: 'GET'
            })
            const data = await res.json();
            console.log()
            if (data?.success) {
                console.log("加搜索后，前端：", data.records)
                setRecordData(data.records);
                const { totalCount, totalPage, page } = data.pagination;
                const { detailInfo } = data;
                setTotalPage(totalPage);
                setTotalCount(totalCount);
                setPage(page)
                setDetailInfo(detailInfo)
            }


        } catch (error) {
            console.log("获取Record失败~")

        } finally {
            setIsLoading(false)
        }

    }

    const [ userId, setUserId ] = useState<number | null>(null)
    const getUserId = async() => {
        try {
            const res = await fetch("/api/user/get-id");

            const data = await res.json();

            if (data?.success) {
                setUserId(data.userId)
            }

        } catch (error) {
            console.log("获取userId失败~")
        }
    }

    const [ notifition, setNotification ] = useState<{
        show: boolean,
        type?: "success" | "error" | "info",
        message?: string
    }>({show: false})

    const onNotify = (type: "success" | "error" | "info", message: string) => {
        setNotification({ show: true, type, message })
    }

    // 保持翻页与搜索一致
    const [ query, setQuery ] = useState<string>("")

    const onChangePage = (page: number) => {
        // 处理翻页;翻页时戴上当前query关键字（如果有）
        fetchRecords(page, 6, query)
    }

    // 创建、详情、编辑、删除 弹窗
    const [ showCreatePortal, setShowCreatePortal ] = useState<boolean>(false)
    const [ DetailPortal, setDetailPortal ] = useState<{ show: boolean, record: OpenVPNRecordType | null }>({ show: false, record: null })
    const [ EditPortal, setEditPortal ] = useState<{ show: boolean, record: OpenVPNRecordType | null }>({ show: false, record: null })
    const [ DeletePortal, setDeletePortal ] = useState<{ show: boolean, record: OpenVPNRecordType | null }>({ show: false, record: null })
    
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }
    const handleSearch = () => fetchRecords(1, 6, query);    // 触发搜索
    const clearSearch = () => {
        setQuery("");
        fetchRecords(1, 6, "")
    }

    // 导出数据到excel
    const handleExportAll = async () => {
        const params = new URLSearchParams({ export: 'all' })
        if (query.trim()) params.set('q', query.trim());
        
        try {
            const res = await fetch(`/api/record?${params.toString()}`, {
                method: 'GET'
            })
            const data = await res.json();
            if (!data.success) return onNotify('error', "导出失败")

            const records = data.records || [];
            const rows = records.map((r: any) => ({
                申请人: r.name,
                部门: r.sector,
                账号: r.account_ip,
                申请日期: new Date(r.apply_date).toISOString().split('T')[0],
                目的IP端口: r.dest_ip,
                申请类型: RuleType_LABEL[r.type as RuleType],
                申请原因: r.type === 'close_account' ? '离职' : r.reason,
                截止日期: r.apply_duration,
                备注: r.description,
            }));
            const XLSX = await import('xlsx');
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(rows);
            XLSX.utils.book_append_sheet(wb, ws, 'OpenVPN');
            XLSX.writeFile(wb, `openv_records_${Date.now()}.xlsx`)
            
        } catch (error) {
            console.log("导出失败")
        }
    }

    useEffect(() => {
        fetchRecords();
    }, [])

    useEffect(() => {
        getUserId();
    }, [userId])

    return (
        <div className="w-full h-full overflow-auto flex flex-col gap-6 p-8 bg-gray-100">
            <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-2'>
                    <h3 className='font-black text-2xl'>openVPN申请记录</h3>
                    <span className='font-light'>管理和查看openVPN申请记录</span>
                </div>
                <div className="flex gap-4 items-center">
                    <div className='relative'>
                        <input 
                            placeholder="搜索账号或IP..." 
                            className='outline-none border border-gray-300 p-2 pl-12 rounded-md sm:w-64 placeholder:text-sm focus:border-blue-500 focus:shadow-md'
                            value={query}
                            onChange={handleSearchInputChange}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                        />
                        <button 
                            type='button' 
                            className='absolute left-3 top-1/2 -translate-y-1/2'
                            onClick={handleSearch}
                        >
                            <SearchOutlined className='text-xl text-black' />
                        </button>

                        {
                            query && (
                                <button 
                                    type='button' 
                                    className='absolute right-3 top-1/2 -translate-y-1/2  bg-gray-300 h-4 w-4 rounded-full flex items-center justify-center' 
                                    onClick={clearSearch}
                                >
                                    <CloseOutlined className='text-gray-500 text-xs' />
                                </button>
                            )
                        }

                    </div>

                    <button
                        type='button'
                        className='outline-none border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-50'
                        onClick={handleExportAll}
                    >
                        导出全部
                    </button>

                    <button 
                        className={`p-2 flex gap-2 bg-teal-500 rounded-md hover:bg-teal-400 hover:-translate-y-0.5 transition-all ${userId === 1 ? "" : "disabled:cursor-not-allowed"}`} 
                        onClick={() => setShowCreatePortal(true)}
                        disabled={userId === 1 ? false : true}   
                    >
                        <PlusSquareFilled className="text-lg text-white" />
                        <span className='text-white'>添加新记录</span>
                    </button>
                </div>
            </div>

            {
                showCreatePortal && 
                <CreateRecord 
                    show={showCreatePortal} 
                    onClose={() => setShowCreatePortal(false)} 
                    onNotify={onNotify} 
                    fetchRecords={fetchRecords}
                />
            }
            
            <ItemCards totalCount={totalCount} detailInfo={detailInfo} />

            {/* 表格容器 - 设置最小高度防止抖动 */}
            <div className='bg-white rounded-lg shadow-md min-h-[500px] flex flex-col'>
                {
                    isLoading ? (
                        <div className='flex-1 flex items-center justify-center h-[400px]'>
                            <div className='flex flex-col items-center gap-4'>
                                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                                <span className='text-gray-500'>加载中....</span>
                            </div>
                        </div>
                    ) : recordData && recordData.length > 0 ? (
                            <>
                                <div className='overflow-x-auto mb-2 border border-gray-200 overflow-hidden h-[430px]'>
                                    <table className='w-full divide-y divide-gray-50'>
                                        <thead className='bg-gray-50 border-b border-gray-200 sticky top-0 z-10'>
                                            <tr>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请人</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请部门</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>账号/IP</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请日期</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>目的IP-端口</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请类型</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请原因</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>截止日期</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>状态</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>备注</th>
                                                <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                                            </tr>

                                        </thead>
                                        <tbody className='bg-white divide-y divide-gray-200'>
                                            {
                                                recordData.map((record) => (
                                                    <tr key={record.id} className='hover:bg-gray-50 transition-colors h-16'>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            <div className='h-10 flex items-center'>{record.name}</div>
                                                        </td>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            <div className='h-10 flex items-center'>{record.sector}</div>
                                                        </td>
                                                        <td className='px-5 py-3 align-top'>
                                                            <div className='h-10 flex flex-col justify-center gap-1 overflow-hidden line-clamp-2 text-ellipsis break-words space-y-1' title={record.account_ip}>
                                                                {record.account_ip.split(";").slice(0,1).map((r, index) => (
                                                                    <span key={r + index} className='text-left text-xs font-medium text-gray-500 tracking-wider truncate'>{r}</span>
                                                                ))}
                                                                {record.account_ip.split(";").length > 2 && (
                                                                    <span className='text-xs text-blue-400'>+{record.account_ip.split(";").length - 1}更多</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            <div className='h-10 flex items-center'>{new Date(record.apply_date).toISOString().split('T')[0]}</div>
                                                        </td>
                                                        <td className='px-5 py-3 align-top space-y-1'>
                                                            <div className='h-10 flex flex-col gap-1 justify-center overflow-hidden' title={record.dest_ip}>
                                                                
                                                                { record.dest_ip.split(";").slice(0,1).map((r, index) => (
                                                                    <span key={r + index} className='text-left text-xs font-medium text-gray-500 tracking-wider truncate'>{r}</span>
                                                                ))}
                                                                { record.dest_ip.split(';').length > 2 && (
                                                                    <span className='text-xs text-blue-400'>+{record.dest_ip.split(';').length - 1}更多</span>
                                                                ) }
                                                            </div>
                                                        </td>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            <div className='h-10 flex items-center'>{RuleType_LABEL[record.type as RuleType]}</div>
                                                        </td>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            <div className='h-10 flex items-center'>
                                                                <span className='truncate max-w-24' title={record.type === 'close_account' ? "离职" : record.reason}>
                                                                    {record.type === 'close_account' ? "离职" : record.reason}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            <div className='h-10 flex items-center'>{record.apply_duration}</div>
                                                        </td>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            {/* <div className={`h-10 flex items-center`}>{StatusType_LABEL[record.status as StatusType]}</div> */}
                                                            {
                                                                (record.apply_duration !== '永久' && record.status !== 'deleted' && (() => {
                                                                    const d = new Date(record.apply_duration + 'T00:00:00');
                                                                    const today = new Date();
                                                                    today.setHours(0,0,0,0);
                                                                    return !Number.isNaN(d.getTime()) && d < today;
                                                                })()) ?
                                                                <span className='h-10 flex font-bold items-center text-red-500'>已过期</span> : 
                                                                <span className={`h-10 flex items-center`}>{StatusType_LABEL[record.status as StatusType]}</span>
                                                            }
                                                        </td>
                                                        <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                            <div className='h-10 flex items-center'>
                                                                <span className='truncate max-w-24' title={record.description}>{record.description}</span>
                                                            </div>
                                                        </td>
                                                        <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                                            <div className='flex gap-3'>
                                                                <button title='查看详情' onClick={() => setDetailPortal({show: true, record})}>
                                                                    <EyeFilled className='text-blue-500 hover:text-blue-400 text-base' />
                                                                </button>
                                                                <button 
                                                                    title='编辑' disabled={userId === 1 ? false : true} className={`${userId === 1 ? "" : "disabled:cursor-not-allowed"}`}
                                                                    onClick={() => setEditPortal({ show: true, record })}
                                                                >
                                                                    <EditFilled className='text-yellow-500 hover:text-yellow-400 text-base' />
                                                                </button>
                                                                <button 
                                                                    title='删除' 
                                                                    disabled={userId === 1 ? false : true} className={`${userId === 1 ? "" : "disabled:cursor-not-allowed"}`}
                                                                    onClick={() => setDeletePortal({ show: true, record })}
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

                                
                                {
                                    DetailPortal.show && 
                                    <DetailRecord  show={DetailPortal.show} onClose={() => setDetailPortal(prev => ({...prev, show: false}))} record={DetailPortal.record} />
                                }
                                
                                {
                                    DeletePortal.show && 
                                    <DeleteRecord 
                                        show={DeletePortal.show} 
                                        onClose={() => setDeletePortal(prev => ({...prev, show: false}))} 
                                        record={DeletePortal.record}
                                        onNotify={onNotify}
                                        fetchRecords={fetchRecords}
                                        
                                    />
                                }

                                {
                                    EditPortal.show && 
                                    <EditRecord 
                                        show={EditPortal.show} 
                                        onClose={() => setEditPortal(prev => ({...prev, show: false}))} 
                                        onNotify={onNotify}  
                                        fetchRecords={fetchRecords} 
                                        record={EditPortal.record} 
                                    />
                                }

                                <Pagination page={page} totalCount={totalCount} totalPage={totalPage} onChangePage={onChangePage} isLoading={isLoading} />

                            </>
                        ) : (
                            <div className='flex items-center justify-center mt-5'>
                                <span className='font-light text-gray-500'>暂无记录</span>
                            </div>
                        )
            
                }
            </div>


            {/* {
                recordData ? (
                    <div className='bg-white rounded-lg shadow-md'>
                        <div className='overflow-x-auto mb-2 border border-gray-200 overflow-hidden'>
                            <table className='w-full divide-y divide-gray-50 min-h-[400px]'>
                                
                                <thead className='bg-gray-50 border-b border-gray-200'>
                                    <tr>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请人</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请部门</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>账号/IP</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请日期</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>目的IP-端口</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请类型</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请原因</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请时长</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>状态</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>备注</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                                    </tr>

                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {
                                        recordData.map((record) => (
                                            <tr key={record.id} className='hover:bg-gray-50 transition-colors'>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{record.name}</td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{record.sector}</td>
                                                <td className='px-5 py-3'>
                                                    <div className='flex flex-col gap-1'>
                                                        { record.account_ip.split(";").map((r, index) => (<span key={r + index} className='text-left text-xs font-medium text-gray-500 tracking-wider'>{r}</span>)) }
                                                    </div>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{new Date(record.apply_date).toISOString().split('T')[0]}</td>
                                                <td className='px-5 py-3'>
                                                    <div className='flex flex-col gap-1'>
                                                        { record.dest_ip.split(";").map((r, index) => (<span key={r + index} className='text-left text-xs font-medium text-gray-500 tracking-wider'>{r}</span>)) }
                                                    </div>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{RuleType_LABEL[record.type as RuleType]}</td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{record.type === 'close_account' ? "离职" : record.reason}</td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{record.apply_duration}</td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{record.type === 'close_account' ? "已删除" : record.status }</td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider max-w-40'>{record.description}</td>
                                                <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                                    <div className='flex gap-3'>
                                                        <button title='查看详情' onClick={() => setDetailPortal({show: true, record})}>
                                                            <EyeFilled className='text-blue-500 hover:text-blue-400 text-base' />
                                                        </button>
                                                        <button 
                                                            title='编辑' disabled={userId === 1 ? false : true} className={`${userId === 1 ? "" : "disabled:cursor-not-allowed"}`}
                                                            onClick={() => setEditPortal({ show: true, record })}
                                                        >
                                                            <EditFilled className='text-yellow-500 hover:text-yellow-400 text-base' />
                                                        </button>
                                                        <button 
                                                            title='删除' 
                                                            disabled={userId === 1 ? false : true} className={`${userId === 1 ? "" : "disabled:cursor-not-allowed"}`}
                                                            onClick={() => setDeletePortal({ show: true, record })}
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

                        
                        {
                            DetailPortal.show && 
                            <DetailRecord  show={DetailPortal.show} onClose={() => setDetailPortal(prev => ({...prev, show: false}))} record={DetailPortal.record} />
                        }
                        
                        {
                            DeletePortal.show && 
                            <DeleteRecord 
                                show={DeletePortal.show} 
                                onClose={() => setDeletePortal(prev => ({...prev, show: false}))} 
                                record={DeletePortal.record}
                                onNotify={onNotify}
                                fetchRecords={fetchRecords}
                                
                            />
                        }

                        {
                            EditPortal.show && 
                            <EditRecord 
                                show={EditPortal.show} 
                                onClose={() => setEditPortal(prev => ({...prev, show: false}))} 
                                onNotify={onNotify}  
                                fetchRecords={fetchRecords} 
                                record={EditPortal.record} 
                            />
                        }

                        <Pagination page={page} totalCount={totalCount} totalPage={totalPage} onChangePage={onChangePage} />

                    </div>
                ) : (
                    <div className='flex items-center justify-center mt-5'>
                        <span className='font-light text-gray-500'>暂无记录</span>
                    </div>
                )
            } */}


            {/* 提示 */}
            {
                notifition && 
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