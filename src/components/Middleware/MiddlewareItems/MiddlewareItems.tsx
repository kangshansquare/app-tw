'use client';

import { DatabaseFilled, RightOutlined, EyeFilled, EditFilled, DeleteFilled,TrademarkOutlined, FileImageOutlined, CloudOutlined } from '@ant-design/icons';
import Pagination from '@/components/Pagination/Pagination';
import { MiddlewareData } from '@/types/MiddlewareData';
import { useState, type JSX } from 'react';
import UpdateMiddleware from '../UpdateMiddleware/UpdateMiddleware';
import ViewMiddleware from '../ViewMiddleware/ViewMiddleware';
import DeleteMiddleware from '../DeleteMiddleware/DeleteMiddleware';



interface MiddlewareItemsPros {
    handlePageSize: (pageSize: number) => void;
    pagination: { totalPage: number, filteredCount: number, page: number };
    items: MiddlewareData[] | null;
    isLoading: boolean;
    onChangePage: (page: number) => void
    onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
    onFetch: (page: number, pageSize: number) => void;
}

type MiddlewareType = "mysql" | 'redis' | 'fastdfs' | 'minio';
const Icons: Record<MiddlewareType, JSX.Element> = {
    mysql: <DatabaseFilled className='text-green-500' />,
    redis: <TrademarkOutlined className='text-yellow-500' />,
    fastdfs: <FileImageOutlined className='text-[#36CFC9]' />,
    minio: <CloudOutlined className='text-[#52C41A]' />
}

export default function MiddlewareItems({ handlePageSize, pagination, items, isLoading, onChangePage, onNotify, onFetch }: MiddlewareItemsPros) {

    const [ showUpdate, setShowUpdate ] = useState<{ show: boolean, middlewareData: MiddlewareData | null}>({ show: false, middlewareData:  null})
    const [ showView, setShowView ] = useState<{ show: boolean, middlewareData: MiddlewareData | null }>({ show: false, middlewareData: null })
    const [ showDelete, setShowDelete ] = useState<{ show: boolean, middlewareData: MiddlewareData | null }>({ show: false, middlewareData: null })

    const actionFlag = (flag: string, data: MiddlewareData) => {
        if (flag === 'update') {
            setShowUpdate({ show: true, middlewareData: data })
            setShowView(prev => ({...prev, show: false}))
        } else if (flag === 'delete') {
            setShowDelete({ show: true, middlewareData: data })
            setShowView(prev => ({...prev, show: false}))
        }
    }
    

    return (
        <>
            {
                items && items?.length > 0 ? (
                    <div className='flex flex-col border border-gray-50 shadow-md'>
                        <div className='p-3 flex justify-between bg-white rounded-t-lg rounded-tr-lg'>
                            <p className='font-semibold text-lg'>中间件列表</p>
                            <select className='outline-none border border-gray-100 p-2 rounded-lg hover:border-blue-400' name='pageSize' onChange={(e) => handlePageSize(Number(e.target.value))}>
                                <option value="5">每页5条</option>
                                <option value="10">每页10条</option>
                                <option value="20">每页20条</option>
                                <option value="50">每页50条</option>
                            </select>
                        </div>

                        <div className='flex-1'>
                            <table className='w-full divide-y divide-gray-50'>
                                <thead className='bg-gray-50 border-b border-gray-200 sticky top-0 z-10'>
                                    <tr>
                                        <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>中间件类型</th>
                                        <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>名称</th>
                                        <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>版本</th>
                                        <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>部署模式</th>
                                        <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>节点数量</th>
                                        <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>IP-端口</th>
                                        <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>业务线</th>
                                        <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>说明</th>
                                        <th className='px-5 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider'>操作</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {
                                        items.map((item) => (
                                            <tr key={item.id} className='hover:bg-gray-50 transition-colors h-16'>
                                                <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                                    <div className='flex gap-2 items-center'>
                                                        {Icons[item.type as MiddlewareType]}
                                                        <span>{item.type}</span>
                                                    </div>
                                                </td>
                                                <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>{item.name}</td>
                                                <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>{item.version}</td>
                                                <td className={`px-5 py-3 text-left text-sm font-medium ${item.deploy_mode === 'cluster' ? "text-blue-500" : "text-gray-500"} tracking-wider`}>
                                                    <span className={`${item.deploy_mode === 'cluster' ? "bg-blue-100" : "bg-gray-100"} rounded-md p-1 text-xs`}>{item.deploy_mode}</span>
                                                </td>
                                                <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>{item.cluster_config?.length || 1}</td>
                                                { 
                                                    item.cluster_config && item.cluster_config.length > 0 ? 
                                                    <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                                        <div className='space-y-1'>
                                                            {item.cluster_config.slice(0,1).map((node, index) => (
                                                                <div key={index} className='flex items-center gap-2'>
                                                                    <span>{node.cluster_ip_port}</span>
                                                                    <span>{node.role || 'node'}</span>
                                                                    { node.group_name && (
                                                                        <span>{node.group_name}</span>
                                                                    ) }
                                                                </div>
                                                            ))}
                                                            {
                                                                item.cluster_config.length >=2 && (
                                                                    <div>
                                                                        <span className='text-blue-400'>+{item.cluster_config.length - 1}更多</span>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </td> :
                                                    <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>{item.ip_port}</td>  
                                                }
                                                <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>{item.service_line}</td>
                                                <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>{item.description}</td>
                                                <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                                    <div className='flex gap-3'>
                                                        <button 
                                                            title='查看详情'
                                                            onClick={() => setShowView({ show: true, middlewareData: item })}
                                                        >
                                                            <EyeFilled className='text-blue-500 hover:text-blue-400 text-base' />
                                                        </button>
                                                        <button 
                                                            title='编辑' 
                                                            onClick={() => setShowUpdate({ show: true, middlewareData: item })}
                                                        >
                                                            <EditFilled className='text-yellow-500 hover:text-yellow-400 text-base' />
                                                        </button>
                                                        <button 
                                                            title='删除' 
                                                            onClick={() => setShowDelete({ show: true, middlewareData: item })}
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
                        <div className='bg-white border-t border-gray-100 rounded-bl-lg rounded-br-lg'>
                            <Pagination page={pagination.page} totalPage={pagination.totalPage} totalCount={pagination.filteredCount} onChangePage={onChangePage} isLoading={isLoading} />
                        </div>

                    </div>
                ) : (
                    <div className='flex items-center justify-center mt-5 bg-white min-h-[400px]'>
                        <span className='font-light text-gray-500'>暂无记录</span>
                    </div>
                )
            }
            
            {
                showUpdate.show && 
                <UpdateMiddleware 
                    show={showUpdate.show} 
                    onClose={() => setShowUpdate(prev => ({ ...prev, show: false }))} 
                    middlewareData={showUpdate.middlewareData}  
                    onNotify={onNotify}
                    onFetch={onFetch}
                />
            }
            {
                showView.show &&
                <ViewMiddleware 
                    show={showView.show}
                    onClose={() => setShowView(prev => ({ ...prev, show: false }))}
                    middlewareData={showView.middlewareData}
                    actionFlag={(flag:string, data: MiddlewareData) => actionFlag(flag, data)}
                />
            }
            {
                showDelete.show &&
                <DeleteMiddleware 
                    show={showDelete.show}
                    onClose={() => setShowDelete(prev => ({ ...prev, show: false }))}
                    middlewareData={showDelete.middlewareData}
                    onNotify={onNotify}
                    onFetch={onFetch}
                />
            }
        </>

    )
}