'use client';
import { 
    UnorderedListOutlined, 
    SyncOutlined, 
    PlusSquareFilled, 
    AppstoreOutlined, 
    DatabaseOutlined, 
    SearchOutlined, 
    TrademarkOutlined, 
    FileImageOutlined, 
    CloudOutlined,
    CloseOutlined 
} from '@ant-design/icons';

import Cards from './Cards/Cards';
import MiddlewareItems from './MiddlewareItems/MiddlewareItems';
import { useEffect, useState } from 'react';
import Createmiddleware from './CreateMiddleware/CreateMiddleware';
import Notification from '@/components/Notification/Notification';
import { MiddlewareData } from '@/types/MiddlewareData'




export default function Middleware() {

    const [ initalMiddlewareData, setInitalMiddlewareData ] = useState<MiddlewareData[] | null>(null)
    const [ initalPageSize, setInitalPageSize ] = useState<number>(5);
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ pagination, setPagination ] = useState<{ totalPage: number, filteredCount: number, page: number }>({totalPage: 0, filteredCount: 0, page: 1})
    const [ typeStats, setTypeStats ] = useState<any>(null);
    const [ globalTotalCount, setGlobalTotalCount ] = useState<number>(0)

    const [ query, setQuery ] = useState<string>("")

    const [ showAddMiddleware, setShowAddMiddleware ] = useState<boolean>(false);

    const [ buttonFlag, setButtonFlag ] = useState<'all'| 'mysql' | 'redis' | 'fastdfs' | 'minio'>('all')
    const handleButtonChange = (flag: 'all'| 'mysql' | 'redis' | 'fastdfs' | 'minio') => {
        setButtonFlag(flag)
        fetchMiddleware(1, initalPageSize, query ,flag)
        
    }

    const handlePageSize = (pageSize: number) => {
        console.log("PageSize: ", pageSize)
        setInitalPageSize(pageSize)
    }

    const handlePageChange = (page: number) => {
        fetchMiddleware(page, initalPageSize, query, buttonFlag)
    }

    const [ notification, setNotification ] = useState<{
        show: boolean,
        type?: 'success' | 'error' | 'info',
        message?: string
    }>({ show: false })
    
    const onNotify = (type: "success" | "error" | "info", message: string) => {
        setNotification({ show: true, type, message })
    }

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setQuery(e.target.value)
    }

    const handleSearch = () => {
        console.log(query)
        fetchMiddleware(1, initalPageSize, query, buttonFlag)
    }

    const clearSearch = () => {
        setQuery("")
        fetchMiddleware(1, initalPageSize, "", buttonFlag)
    }

    const fetchMiddleware = async (currentPage = 1 ,pageSize=5, q='', t: 'all'| 'mysql' | 'redis' | 'fastdfs' | 'minio') => {

        setIsLoading(true)

        const params = new URLSearchParams({
            page: String(currentPage),
            pageSize: String(pageSize)
        })
        if (q.trim()) params.set("q", q.trim())
        if (t && t !== 'all') params.set("type", t)

        try {
            const res = await fetch(`/api/middleware?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }

            })

            const data = await res.json();
            if (data?.success) {
                const { pagination, items, typeStats, globalTotalCount } = data
                setPagination(pagination)
                setInitalMiddlewareData(items)
                setTypeStats(typeStats)
                setGlobalTotalCount(globalTotalCount)
                // console.log('==========',pagination, items)
            } else {
                onNotify("error", "数据获取失败")
            }

        } catch (error) {
            onNotify("error", "网络错误")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMiddleware(1, initalPageSize, "", 'all')
    }, [initalPageSize])

    return (
        <div className="p-8 flex flex-col gap-4 overflow-auto bg-gray-50">
            <div className="flex justify-between">
                <div className="flex gap-1 items-center justify-center">
                    <UnorderedListOutlined className='text-blue-500 text-2xl' />
                    <h3 className='font-black text-2xl'>中间件管理</h3>
                </div>
                <div className="flex gap-3">
                    <button className="bg-blue-100 text-blue-600 flex gap-1 items-center justify-center p-2 rounded-md font-medium hover:bg-blue-200"
                    >
                        <SyncOutlined />
                        刷新数据
                    </button>
                    <button 
                        className="bg-blue-600 text-white flex gap-1 items-center justify-center p-2 rounded-md hover:bg-blue-500"
                        onClick={() => setShowAddMiddleware(true)}
                    >
                        <PlusSquareFilled />
                        添加中间件
                    </button>
                </div>
            </div>

            {
                showAddMiddleware && 
                <Createmiddleware 
                    show={showAddMiddleware} 
                    onClose={() => setShowAddMiddleware(false)} 
                    onNotify={onNotify} 
                    onFetch={(page, pageSize) => fetchMiddleware(page, pageSize, query, 'all')} 
                    pageSize={initalPageSize} 
                />
            }

            <div className='flex justify-between bg-white p-2 py-5 rounded-md shadow-sm'>
                <div className='flex gap-4'>
                    <button className={`flex gap-1 ${buttonFlag === 'all' ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}  p-2 px-4 rounded-md`} onClick={() => handleButtonChange('all')}>
                        <AppstoreOutlined className='' />
                        全部
                    </button>
                    <button className={`flex gap-1 ${buttonFlag === 'mysql' ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"} p-2 px-4 rounded-md`} onClick={() => handleButtonChange('mysql')} >
                        <DatabaseOutlined />
                        MySQL
                    </button>
                    <button className={`flex gap-1 ${buttonFlag === 'redis' ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"} p-2 px-4 rounded-md`} onClick={() => handleButtonChange('redis')}>
                        <TrademarkOutlined />
                        Redis
                    </button>
                    <button className={`flex gap-1 ${buttonFlag === 'fastdfs' ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"} p-2 px-4 rounded-md`} onClick={() => handleButtonChange('fastdfs')}>
                        <FileImageOutlined />
                        FastDFS
                    </button>
                    <button className={`flex gap-1 ${buttonFlag === 'minio' ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"} p-2 px-4 rounded-md`} onClick={() => handleButtonChange('minio')}>
                        <CloudOutlined className='text-lg' />
                        MinIO
                    </button>
                </div>
                <div className='relative'>
                    <button className='absolute text-2xl top-1/2 left-2 -translate-y-1/2' onClick={handleSearch}>
                        <SearchOutlined className='' />
                    </button>
                    <input 
                        className='outline-none border border-gray-200 p-2 pl-10 rounded-md placeholder:text-sm' 
                        placeholder='搜索中间件...' 
                        value={query}
                        onChange={handleSearchInputChange}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                    />
                    
                    { query && (
                        <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2  bg-gray-300 h-4 w-4 rounded-full flex items-center justify-center' onClick={clearSearch}>
                            <CloseOutlined className='text-gray-500 text-sm' />
                        </button>
                    ) }


                </div>
            </div>
            <Cards totalCount={globalTotalCount} typeStats={typeStats} />
            
            
            <MiddlewareItems 
                handlePageSize={handlePageSize}  
                pagination={pagination} 
                items={initalMiddlewareData} 
                isLoading={isLoading} 
                onChangePage={handlePageChange} 
                onNotify={onNotify}
                onFetch={(page: number, pageSize: number) => fetchMiddleware(1, pageSize, query, 'all')}
            />


            {/* <div className='bg-white rounded-lg shadow-md min-h-[500px] flex flex-col'>
                {
                    isLoading ? (
                        <div className='flex-1 flex items-center justify-center h-[400px]'>
                            <div className='flex flex-col items-center gap-4'>
                                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                                <span className='text-gray-500'>加载中....</span>
                            </div>
                        </div>
                    ) : initalMiddlewareData && initalMiddlewareData.length > 0 ? (
                        <MiddlewareItems handlePageSize={handlePageSize} />
                    ) : (
                        <div className='flex items-center justify-center mt-5'>
                            <span className='font-light text-gray-500'>暂无记录</span>
                        </div>
                    )
                    
                }
            </div> */}

            {
                notification && 
                <Notification 
                    show={notification.show} 
                    type={notification.type} 
                    message={notification.message} 
                    closeNotification={() => setNotification({...notification, show: false})} 
                />
            }

        </div>
    )
}