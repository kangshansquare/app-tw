import ReactDOM from "react-dom";
import { MiddlewareData } from "@/types/MiddlewareData";
import { CloseOutlined, DatabaseFilled, TrademarkOutlined, CloudOutlined, FileImageOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import { useEffect, useState, type JSX } from "react";

interface ViewMiddlewarePros {
    show: boolean;
    onClose: () => void;
    middlewareData: MiddlewareData | null;
    actionFlag: (flag: string, data: MiddlewareData) => void;
}

type MiddlewareType = "mysql" | 'redis' | 'fastdfs' | 'minio';
const Icons: Record<MiddlewareType, JSX.Element> = {
    mysql: <DatabaseFilled className='text-green-500' />,
    redis: <TrademarkOutlined className='text-yellow-500' />,
    fastdfs: <FileImageOutlined className='text-[#36CFC9]' />,
    minio: <CloudOutlined className='text-[#52C41A]' />
}

type DeployModeType = 'cluster' | 'single';
const DeployModeName: Record<DeployModeType, string> = {
    cluster: '集群模式',
    single: '单节点'
}

export default function ViewMiddleware({ show, onClose, middlewareData, actionFlag }: ViewMiddlewarePros) {

    const defaultData: MiddlewareData = {
        type: '',
        name: '',
        version: '',
        deploy_mode: '',
        service_line: '',
        ip_port: '',
        cluster_config: [],
        description: '',
        note: ''
    }

    const [ viewMiddlewareData, setViewMiddlewareData ] = useState<MiddlewareData>(middlewareData ? { ...middlewareData, ...defaultData } : defaultData)

    useEffect(() => {
        setViewMiddlewareData(middlewareData ? { ...middlewareData, ...defaultData } : defaultData)
    }, [middlewareData])

    return (
        ReactDOM.createPortal(
            <div className="fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center" onClick={onClose}>
                <div className=' bg-white rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]' onClick={(e) => e.stopPropagation()}>
                    <div className="p-5 flex justify-between items-center border border-gray-100 mb-5">
                        <span className="font-semibold text-lg">{middlewareData?.name} 详情</span>
                        <button className="h-5 w-5 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center" onClick={onClose}>
                            <CloseOutlined  />
                        </button>
                    </div>
                    <div className="px-5 grid sm:grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <span className="font-medium text-sm text-gray-500">中间件类型</span>
                            <div className="flex gap-2">
                                {Icons [middlewareData?.type as MiddlewareType]}
                                <span>{middlewareData?.type}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-medium text-sm text-gray-500">业务线</span>
                            <div className="flex gap-2">
                                <span>{middlewareData?.service_line}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-medium text-sm text-gray-500">版本</span>
                            <div className="flex gap-2">
                                <span>{middlewareData?.version}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-medium text-sm text-gray-500">部署模式</span>
                            <div className="flex gap-2">
                                <span>{DeployModeName[middlewareData?.deploy_mode as DeployModeType]}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-medium text-sm text-gray-500">节点数量</span>
                            <div className="flex gap-2">
                                <span>{middlewareData?.deploy_mode === 'single' ? 1 : middlewareData?.cluster_config?.length}</span>
                            </div>
                        </div>
                    </div>
                    {
                        middlewareData?.description && 
                        <div className=" px-5 flex flex-col gap-2 mt-5">
                            <span className="font-medium text-sm text-gray-500">描述信息</span>
                            <p className="bg-gray-100 p-2 rounded-md min-h-5">{middlewareData?.description}</p>
                        </div>
                    }
                    <div className="p-5 flex flex-col gap-2 mt-5">
                        <span className="font-medium text-sm text-gray-500">节点信息</span>
                        { 
                            middlewareData?.deploy_mode === 'single' ?
                                <div className="p-2 flex gap-2 bg-gray-100 rounded-md items-center justify-start">
                                    <span className="p-1 bg-blue-100 rounded-md text-sm">单节点</span>
                                    <span>{middlewareData?.ip_port}</span>
                                </div> :
                                middlewareData?.cluster_config?.map((item,index) => (
                                    <div key={index} className="p-2 flex gap-2 bg-gray-100 rounded-md items-center justify-start">
                                        {
                                            item.role &&
                                            <span 
                                                className={`font-medium text-sm ${(item.role && ['master', 'tracker'].includes(item.role)) ? "bg-blue-100 text-blue-600 p-1 rounded-md" : "bg-gray-200 text-sm p-1 rounded-md"}`}
                                            >
                                                {item.role}
                                            </span> 
                                        }
                                        {
                                            item.group_name &&
                                            <span className="bg-gray-200 text-sm p-1 rounded-md">{item.group_name}</span>
                                        }
                                        <span>{item.cluster_ip_port}</span>
                                    </div>    
                                ))  
                        }
                    </div>
                    <div className="border border-gray-100 my-5"></div>

                    <div className="p-5 flex items-center justify-end mb-5">
                        <div className="flex gap-4">
                            <button className="flex gap-2 border rounded-md p-2 hover:bg-gray-50" onClick={() => actionFlag('update', middlewareData ? middlewareData : defaultData)}>
                                <EditFilled className="text-yellow-500 text-base" />
                                编辑
                            </button>
                            <button className="flex gap-2 border rounded-md p-2 border-red-100 text-red-500 hover:bg-red-50" onClick={() => actionFlag('delete', middlewareData ? middlewareData : defaultData)}>
                                <DeleteFilled className='text-base' />
                                删除
                            </button>
                            <button className="bg-blue-500 p-2 rounded-md text-white px-4 hover:bg-blue-400" onClick={onClose}>关闭</button>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}