'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { ServiceLineResField } from '@/types/SystemManage';
import Notification from "@/components/Notification/Notification";
import ServiceLineCreateComponent from './ServiceLineCreatePortal/ServiceLineCreatePortal';
import ServiceLineEditComponent from './ServiceLineEditPortal/ServiceLineEditPortal';
import ServiceLineDeleteComponent from "./ServiceLineDeletePortal/ServiceLineDeletePortal";


type Status = 'active' | 'deactive';
const Status_LABEL: Record<Status, string> = {
    'active': '在用',
    'deactive': '已弃用'
}

export default function ServiceLineComponent() {
    const [ query, setQuery ] = useState<string>("")
    const [ serviceLineData, setServiceLineData ] = useState<ServiceLineResField[] | null>(null)
    const [ pagination, setPagination ] = useState<{ page: number, totalPage: number }>({page: 1, totalPage: 0})
    const [ totalCount, setTotalCount ] = useState<number>(0);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const [ showCreate, setShowCreate ] = useState<boolean>(false)
    const [ showEdit, setShowEdit ] = useState<{ 
        show: boolean, originData: ServiceLineResField | null, editData: ServiceLineResField | null 
    }>({
        show: false,
        originData: null,
        editData: null
    })
    // const [ editData, setEditData ] = useState<ServiceLineResField | null>(null)
    const [ showDelete, setShowDelete ] = useState<{ show: boolean, deleteData:  ServiceLineResField | null}>({show: false, deleteData: null})

    const [ showNotify, setShowNitify ] = useState<{show: boolean, type?: 'success' | 'info' | 'error', message?: string}>({
        show: false
    })
    const onNotify = (type: "success" | "error" | "info", message: string) => {
        setShowNitify({ show: true, type, message })
    }

    const onChangePage = (page: number) => {
        FetchData(page, 5, query)
    }

    const handleSearch = () => {
        FetchData(1, 5, query)
    }

    const clearSearch = () => {
        setQuery("")
        FetchData(1, 5, "")
    }

    const FetchData = async (page = 1, pageSize = 5, q = "") => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
            });
            if (q.trim()) params.set("q", q.trim());
            const res = await fetch(`/api/system-manage/service-line?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            if (data?.success) {
                const { totalCount, items, pagination } = data;
                setIsLoading(false)
                setServiceLineData(items)
                setTotalCount(totalCount)
                setPagination(pagination)
            } else {
                console.log("获取数据失败")
            }

        } catch (error) {
            console.log("网络异常")
        }
    }

    useEffect(() => {
        FetchData(1, 5, "")
    }, [])

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl sm:text-lg font-bold">业务线管理</h1>
                <p className="text-base sm:text-sm text-gray-500">管理系统中的业务线</p>
            </div>
            <div className="bg-white flex items-center justify-between p-5">
                <div className="flex gap-8 relative">
                    <input 
                        className="outline-none p-2 px-4 pl-10 border border-gray-200 rounded-md placeholder:text-sm placeholder:text-gray-500" 
                        placeholder="搜索业务线名称" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                    />
                    <button 
                        className="text-[#165DFF] flex gap-2 items-center p-2 px-4 rounded-md absolute top-1/2 -translate-y-1/2"
                        onClick={handleSearch}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass}  />
                    </button>
                    {
                        query && 
                        <button 
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center p-1"
                            onClick={clearSearch}    
                        >
                            <FontAwesomeIcon icon={faXmark}  className="text-sm" />
                        </button>
                    }
                </div>
                <button className="bg-[#00B42A] flex gap-2 items-center p-2 rounded-md text-white hover:-translate-y-1 duration-300" onClick={() => setShowCreate(true)}>
                    <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                    添加业务线
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md min-h-[470px] flex flex-col">
                {
                    isLoading ? (
                        <div className="flex flex-col items-center gap-4 mt-5 h-[360px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"/>
                            <p>加载中....</p>
                        </div>
                    ) : serviceLineData && serviceLineData.length > 0 ? (
                        <>
                            <div className='overflow-x-auto mb-2 border border-gray-200 overflow-hidden h-[365px] rounded-md'>
                                <table className='w-full divide-y divide-gray-50'>
                                    <thead className='bg-gray-50 border-b border-gray-200 sticky top-0 z-10'>
                                        <tr>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>业务线名称</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>负责人</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>联系邮箱</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>状态</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>创建时间</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                        {
                                            serviceLineData.map((data) => (
                                                <tr className='hover:bg-gray-50 transition-colors h-16' key={data.id}>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{data.name}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{data.owner ?? ''}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{data.email ?? ''}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                                        <span className={`p-1 px-2 line-flex items-center ${data.status === 'active' ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"} rounded-md`}>{Status_LABEL[data.status as Status]}</span>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{data.create_time ? new Date(data.create_time).toISOString().split('T')[0] : ''}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium tracking-wider align-top'>
                                                        <div className="h-10 flex gap-4 items-center">
                                                            <button className="text-[#165DFF]" onClick={() => setShowEdit({ show: true, originData: data, editData: data })}>编辑</button>
                                                            <button className="text-[#F53F3F]" onClick={() => setShowDelete({ show: true, deleteData: data })}>删除</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <Pagination page={pagination.page} totalCount={totalCount} totalPage={pagination.totalPage} onChangePage={onChangePage} isLoading={isLoading} />
                        </>
                    ) : (
                        <div className="flex items-center justify-center p-5">
                            <p className="text-lg text-gray-600">暂无数据</p>
                        </div>
                    )
                }
            </div>
            
            {
                showCreate &&
                <ServiceLineCreateComponent 
                    show={showCreate}
                    onClose={() => setShowCreate(false)}
                    onFetch={FetchData}
                    onNotify={onNotify}
                />
            }

            {
                showEdit&&
                <ServiceLineEditComponent 
                    show={showEdit.show}
                    onClose={() => setShowEdit(prev => ({ ...prev, show: false }))}
                    onFetch={FetchData}
                    onNotify={onNotify}
                    editData={showEdit.editData}
                    originData={showEdit.originData}
                    onEditChange={newData => setShowEdit(prev => ({ ...prev, editData: newData }))}
                />
            }

            {
                showDelete.show &&
                <ServiceLineDeleteComponent 
                    show={showDelete.show}
                    onClose={() => setShowDelete(prev => ({ ...prev, show: false }))}
                    onFetch={FetchData}
                    onNotify={onNotify}
                    deleteData={showDelete.deleteData}
                />
            }

            {
                showNotify.show &&
                <Notification 
                    show={showNotify.show}
                    type={showNotify.type}
                    message={showNotify.message}
                    closeNotification={() => setShowNitify(prev => ({ ...prev, show: false }))}
                />
            }
        </div>
    )
}