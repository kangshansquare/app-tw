'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/Pagination/Pagination";
import { useState, useEffect } from "react";
import { CabinetResData } from "@/types/SystemManage";
import Notification from "@/components/Notification/Notification";
import CabinetCreatePortal from "./CabinetCreatePortal/CabinetCreatePortal";
import CabinetEditPortal from "./CabinetEditPortal/CabinetEditPortal";
import CabinetDeletePortal from "./CabinetDeletePortal/CabinetDeletePortal";

type CabinetStatus = 'active' | 'deactive';
const CabinetStatus_LABEL: Record<CabinetStatus, string> = {
    'active': '在用',
    'deactive': '已弃用'
}

export default function CabinetManageComponent() {
    const [ pagination, setPagination ] = useState<{ page: number, totalPage: number }>({page: 1, totalPage: 0})
    const [ totalCount, setTotalCount ] = useState<number>(0);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ updataCabinets, setUpdateCabinets ] = useState<CabinetResData[] | null>(null);
    const [ idcName, setIdcName ] = useState<{id: number, name: string}[] | null>(null)
    const [ showEdit, setShowEdit ] = useState<{ show: boolean, cabinet: CabinetResData | null}>({show: false, cabinet: null})
    const [ showDelete, setShowDelete ] = useState<{ show: boolean, cabinet: CabinetResData | null}>({show: false, cabinet: null})

    const [ showNotify, setShowNotify ] = useState<{
        show: boolean,
        type?: 'success' | 'info' | 'error',
        message?: string;
    }>({show: false})
    const onNotify = (type: 'success' | 'info' | 'error', message: string) => {
        setShowNotify({ show: true, type, message })
    }

    const [ showCreate, setShowCreate ] = useState<boolean>(false)

    const onChangePage = (page: number) => {
        FetchData(page, 5, "")
    }

    const fetchIdcName = async () => {
        try {
            const res = await fetch(`/api/system-manage/idc-manage?fields=id,name`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            if (data?.success) {
                const { idcs }  = data
                console.log(idcs)
                setIdcName(idcs)

            } else {
                const { message } = data
                onNotify('error', message)
            }
        } catch(error) {
            onNotify('error', "网络异常~")
        }

    }

    const FetchData = async (page = 1, pageSize = 5, q = "") => {
        setIsLoading(true)
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize)
        })
        if (q.trim()) params.set('q', q.trim());
        try {
            const res = await fetch(`/api/system-manage/cabinet-manage?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application'
                }
            })
            const data = await res.json();
            if (data?.success) {
                const { cabinets, totalCount, pagination } = data
                setIsLoading(false)
                setUpdateCabinets(cabinets);
                setPagination(pagination);
                setTotalCount(totalCount);
            } else {
                console.log("获取机柜信息失败!")
            }

        } catch(error) {
            console.log("网络异常!")
        }

    }

    const [ query, setQuery ] =useState<string>("")
    const handleSearch = () => {
        if (query.trim() === '') return;
        FetchData(1, 5, query)
    }
    const clearSearch = () => {
        setQuery("")
        FetchData(1, 5, "")
    }

    useEffect(() => {
        console.log(updataCabinets)
        FetchData(1, 5 ,"")
        fetchIdcName()
    }, [])

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl sm:text-lg font-bold">机柜信息</h1>
                <p className="text-base sm:text-sm text-gray-500">管理各机房的机柜详细信息</p>
            </div>
            <div className="bg-white flex items-center justify-between p-5">
                <div className="flex gap-8 relative">
                    <input 
                        className="outline-none p-2 px-4 pl-10 border border-gray-200 rounded-md placeholder:text-sm placeholder:text-gray-500" 
                        placeholder="搜索机柜编号" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                    />
                    <button 
                        className="text-[#165DFF] flex gap-2 items-center p-2 px-4 rounded-md duration-300 absolute top-1/2 -translate-y-1/2"
                        onClick={handleSearch}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" />
                    </button>
                    {
                        query && (
                            <button className="absolute top-1/2 right-2 -translate-y-1/2" onClick={clearSearch}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        )
                    }
                </div>
                <button className="bg-[#00B42A] flex gap-2 items-center p-2 rounded-md text-white hover:-translate-y-1 duration-300" onClick={() => setShowCreate(true)}>
                    <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                    添加机柜
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md min-h-[430px] flex flex-col">
                {
                    isLoading ? (
                        <div className="flex flex-col items-center gap-4 mt-5 h-[360px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"/>
                            <p>加载中....</p>
                        </div>
                    ) : updataCabinets && updataCabinets.length > 0 ? (
                        <>
                            <div className='overflow-x-auto mb-2 border border-gray-200 overflow-hidden h-[365px] rounded-md'>
                                <table className='w-full divide-y divide-gray-50'>
                                    <thead className='bg-gray-50 border-b border-gray-200 sticky top-0 z-10'>
                                        <tr>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>机柜编号</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>所属机房</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>U位数量</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>功率</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>状态</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>业务线</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                        {
                                            updataCabinets.map((cabinet) => (
                                                <tr className='hover:bg-gray-50 transition-colors h-16' key={cabinet.id}>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{cabinet.name}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{idcName?.find(i => i.id === cabinet.idcId)?.name}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{cabinet.uCount}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                                        <span className='p-1 px-2 line-flex items-center'>{cabinet.powerKw}</span>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                                        <span 
                                                            className={`p-1 px-2 line-flex items-center ${cabinet.status === 'active' ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"} rounded-md`}
                                                        >
                                                            {CabinetStatus_LABEL[cabinet.status as CabinetStatus]}
                                                        </span>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                        <div className='h-10 flex items-center'>{cabinet.remake}</div>
                                                    </td>
                                                    <td className='px-5 py-3 text-left text-xs font-medium tracking-wider align-top'>
                                                        <div className="h-10 flex gap-4 items-center">
                                                            <button className="text-[#165DFF]" onClick={() => setShowEdit({show: true, cabinet })}>编辑</button>
                                                            <button className="text-red-600" onClick={() => setShowDelete({ show: true, cabinet })}>删除</button>
                                                            <button className="">设备列表</button>
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
                        <div className="flex items-center justify-center mt-5">
                            <p className="text-lg text-gray-600">暂无数据</p>
                        </div>
                    )
                }
            </div>

            {
                showCreate &&
                <CabinetCreatePortal 
                    show={showCreate}
                    onClose={() => setShowCreate(false)}
                    onFetch={FetchData}
                    onNotify={onNotify}
                    idcs={idcName}
                />
            }

            {
                showEdit.show &&
                <CabinetEditPortal 
                    onClose={() => setShowEdit(prev => ({ ...prev, show: false }))}
                    cabinet={showEdit.cabinet}
                    idcs={idcName}
                    onFetch={FetchData}
                    onNotify={onNotify}
                />
            }

            {
                showDelete.show &&
                <CabinetDeletePortal 
                    show={showDelete.show}
                    onClose={() => setShowDelete(prev => ({...prev, show: false}))}
                    cabinet={showDelete.cabinet}
                    onFetch={FetchData}
                    onNotify={onNotify}
                />
            }

            {
                showNotify.show &&
                <Notification 
                    show={showNotify.show}
                    type={showNotify.type}
                    message={showNotify.message}
                    closeNotification={() => setShowNotify({ ...showNotify, show: false })}
                />
            }
        </div>
    )
}