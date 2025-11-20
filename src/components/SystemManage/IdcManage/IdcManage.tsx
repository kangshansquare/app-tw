'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/Pagination/Pagination";
import { useEffect, useState } from "react";
import CreateIdcComponent from "./IdcCreatePortal/IdcCreatePortal";
import Notification from "@/components/Notification/Notification";
import { IdcBaseFields, IdcResData } from "@/types/SystemManage";
import  IdcEditComponent  from "./IdcEditPortal/IdcEditPortal";
import IdcDeleteComponent from "./IdcDeletePortal/IdcDeletePortal";


export default function IdcManageComponent() {
    
    const [ totalCount, setTotalCount ] = useState<number>(0);
    const [ pagination, setPagination ] = useState<{ page: number, totalPage: number }>({page: 1, totalPage: 0})

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ showCreate, setShowCreate ] = useState<boolean>(false);
    const [ notifition, setNotification ] = useState<{
        show: boolean,
        type?: "success" | "error" | "info",
        message?: string
    }>({show: false})
    const [ idcData, setIdcData ] = useState<IdcBaseFields[] | null>(null)

    const onNotiy = (type: 'success' | 'info' | 'error', message: string) => {
        setNotification({ show: true, type, message })
    }

    const [ editPortal, setEditPortal ] = useState<{ show: boolean, idc: IdcResData | null }>({ show: false, idc: null })
    const [ deletePortal, setDeletePortal ] = useState<{ show: boolean, idc: IdcResData | null }>({ show: false, idc: null })

    const fetchData = async (page = 1, pageSize = 5, q = "") => {
        setIsLoading(true);

        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize)
        })
        if (q.trim()) params.set("q", q.trim())
        try {
            const res = await fetch(`/api/system-manage/idc-manage?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            if (data?.success) {
                const { idcs, pagination, totalCount } = data
                setIsLoading(false);
                setTotalCount(totalCount);
                setPagination(pagination)
                setIdcData(idcs)
            } else {
                console.log("数据获取失败")
            }

        } catch (error) {
            console.log("网络异常~", error)
        }

    }

    const onChangePage = (page: number) => {
        fetchData(page, 5)
    }

    // 搜索
    const [ query, setQuery ] = useState<string>("")
    const handleSearch = () => {
        fetchData(1, 5, query)
    }
    const clearSearch = () => {
        setQuery("")
        fetchData(1, 5, "")
    }

    useEffect(() => {
        fetchData(1, 5)
    }, [])

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl sm:text-lg font-bold">机房管理</h1>
                <p className="text-base sm:text-sm text-gray-500">管理数据中心机房信息</p>
            </div>
            <div className="bg-white flex items-center justify-between p-5">
                <div className="flex gap-8 relative items-center">
                    <input 
                        className="outline-none p-2 pl-10 border border-gray-200 rounded-md placeholder:text-sm placeholder:text-gray-500" 
                        placeholder="搜索机房名称" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                    />
                    <button 
                        className="flex gap-2 items-center absolute left-3 top-1/2 -translate-y-1/2" 
                        onClick={handleSearch}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className=" text-[#165DFF]" />
                    </button>
                    {
                        query &&
                        <button
                            type="button"
                            className='absolute right-3 top-1/2 -translate-y-1/2  bg-gray-200 h-4 w-4 rounded-full flex items-center justify-center' 
                            onClick={clearSearch}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    }
                </div>
                <button 
                    onClick={() => setShowCreate(true)}
                    className="bg-[#00B42A] flex gap-2 items-center p-2 rounded-md text-white hover:-translate-y-1 duration-300"
                >
                    <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                    添加机房
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md min-h-[430px] flex flex-col">
                {
                    isLoading ? (
                        <div className="flex flex-col items-center gap-4 mt-5 h-[360px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"/>
                            <p>加载中....</p>
                        </div>
                    ) : idcData && idcData.length > 0 ? (
                        <>
                            <div className='overflow-x-auto mb-2 border border-gray-200 overflow-hidden h-[365px] rounded-md'>
                                <table className='w-full divide-y divide-gray-50'>
                                    <thead className='bg-gray-50 border-b border-gray-200 sticky top-0 z-10'>
                                        <tr>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>机房名称</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>地区</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>地址</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>机房联系电话</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                        { idcData.map((idc, index) => (
                                            <tr className='hover:bg-gray-50 transition-colors h-16' key={index}>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                    <div className='h-10 flex items-center'>{idc.name}</div>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                    <div className='h-10 flex items-center'>{idc.location}</div>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                    <div className='h-10 flex items-center'>{idc.address}</div>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                    <div className='h-10 flex items-center'>{idc.contact}</div>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium tracking-wider align-top'>
                                                    <div className="h-10 flex gap-4 items-center">
                                                        <button className="text-[#165DFF]" onClick={() => setEditPortal({ show: true, idc })}>编辑</button>
                                                        <button className="text-[#F53F3F]" onClick={() => setDeletePortal({ show: true, idc })}>删除</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) }
                                    </tbody>
                                </table>
                            </div>
                            <Pagination page={pagination.page} totalCount={totalCount} totalPage={pagination.totalPage} onChangePage={onChangePage} isLoading={isLoading} />
                        
                        </>
                    ) : (
                        <div className="flex items-center justify-center mt-5">
                            <p className="text-lg text-gray-600">暂无数据</p>
                        </div>
                    )
                }


                {  
                    showCreate && 
                    <CreateIdcComponent 
                        show={showCreate} 
                        onClose={() => setShowCreate(false)} 
                        onNotiy={onNotiy}
                        onFetch={fetchData}
                    />
                }
                
                {
                    editPortal.show &&
                    <IdcEditComponent 
                        show={editPortal.show}
                        onClose={() => setEditPortal(prev => ({ ...prev, show: false }))}
                        idc={editPortal.idc}
                        onNotiy={onNotiy}
                        onFetch={fetchData}
                    />
                }

                {
                    deletePortal.show &&
                    <IdcDeleteComponent
                        show={deletePortal.show}
                        onClose={() => setDeletePortal(prev => ({ ...prev, show: false }))}
                        idc={deletePortal.idc}
                        onNotiy={onNotiy}
                        onFetch={fetchData}
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
        </div>
    )
}