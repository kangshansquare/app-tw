'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate, faMagnifyingGlass, faShieldHalved, faAngleLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Notification from "@/components/Notification/Notification";

export default function CloudComponent() {
    const [ tag, setTag ] = useState<string>('ecs')
    const [ cloudProviders, setCloudProviders ] = useState<{id: number, name: string, provider: string}[] | null>(null)
    const [ notification, setNotification ] = useState<{show: boolean, type?: 'success' | 'error' | 'info', message?: string}>({show: false})
    const onNotify = (type: 'success' | 'error' | 'info', message: string) => {
        setNotification({ show: true, type, message })
    }
    const fetchCloudProviders = async() => {
        try {
            const res = await fetch('/api/cloud/provider?fields=id,name,provider', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json()
            if (data.success) {
                setCloudProviders(data.providerName)
            } else {
                onNotify('error', String(data.message) || '云平台获取失败')
            }
        } catch(error) {
            onNotify('error', '网络错误')
        }
    }


    useEffect(() => {
        fetchCloudProviders()
    }, [])

    return (
        <div className="p-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <h3 className="font-black text-2xl">云主机管理</h3>
                    <button className="border border-gray-300 p-2 px-4 rounded-md hover:bg-gray-100 flex gap-1 items-center">
                        <FontAwesomeIcon icon={faRotate} className="text-sm" />
                        刷新数据
                    </button>
                    
                </div>
                <p className="text-base text-gray-500">管理云主机及关联的安全组</p>
            </div>
            {
                tag === 'ecs' &&
                <div className="p-5 bg-white border border-gray-100 rounded-md flex flex-col gap-5">
                    <div className="flex justify-between">
                        <div className="flex gap-10 items-center">
                            <h3 className="font-black text-xl">云主机列表</h3>
                            <select className="outline-none border border-gray-300 p-2 px-4 rounded-md">
                                <option value="">请选择云平台</option>
                                {
                                    cloudProviders && cloudProviders.map(provider => (
                                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="relative">
                            <input 
                                className="outline-none p-2 pl-8 border border-gray-200 rounded-md hover:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                placeholder="搜索云主机IP"
                            />
                            <button className="absolute left-2 top-1/2 -translate-y-3">
                                <FontAwesomeIcon icon={faMagnifyingGlass}  />
                            </button>
                            
                        </div>
                    </div>
                    <div className="h-[580px]">
                        <div className="h-[490px]  w-full">
                            <table className='w-full divide-y divide-gray-50 '>
                                <thead className='bg-white  sticky top-0 z-10 border-b border-b-gray-300'>
                                    <tr>
                                        <th className='px-5 py-3 text-left text-base font-bold tracking-wider'>云平台</th>
                                        <th className='px-5 py-3 text-left text-base font-bold tracking-wider'>实例ID / 名称</th>
                                        <th className='px-5 py-3 text-left text-base font-bold tracking-wider'>IP地址</th>
                                        <th className='px-5 py-3 text-left text-base font-bold tracking-wider'>所在可用区</th>
                                        <th className='px-5 py-3 text-left text-base font-bold tracking-wider'>配置</th>
                                        <th className='px-5 py-3 text-left text-base font-bold tracking-wider'>状态</th>
                                        <th className='px-5 py-3 text-left text-base font-bold tracking-wider'>关联安全组</th>
                                        <th className='px-5 py-3 text-left text-base font-bold tracking-wider'>操作</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                        
                                    <tr className='hover:bg-gray-50 transition-colors h-16'>
                                        <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                            <span>阿里云</span>
                                        </td>
                                        <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                            <div className=" flex flex-col">
                                                <span className="text-blue-500">
                                                    i-7xv2mjr89bb3kmikpzzr
                                                </span>
                                                <span>
                                                    gtm探测节点
                                                </span>
                                            </div>
                                        </td>
                                        <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                            <div className=" flex flex-col">
                                                <span className="">
                                                    8.138.175.140 公网
                                                </span>
                                                <span>
                                                    172.27.194.232 私网
                                                </span>
                                            </div>
                                        </td>
                                        <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                            <span>华南1（深圳）</span>
                                        </td>
                                        <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                            <span>2 核（vCPU）2 GiB3 Mbps</span>
                                        </td>
                                        <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                            <span className="bg-green-100 text-green-500 p-1 rounded-lg">运行中</span>
                                        </td>
                                        <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                            <span className="bg-blue-100 text-blue-600 p-1 rounded-lg">sg-7xve3goidmtmidz8yzir</span>
                                        </td>
                                        <td className='px-5 py-3 text-left text-sm font-medium text-blue-500 tracking-wider'>
                                            <button className="flex gap-2 items-center" onClick={() => setTag('security')}>
                                                <FontAwesomeIcon icon={faShieldHalved} />
                                                管理安全组
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            }
            {
                tag === 'security' &&
                <div className="p-5 bg-white border border-gray-100 rounded-md flex flex-col gap-5">
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <h3 className="font-bold text-xl">-安全组管理</h3>
                            <button className="bg-gray-100 p-2 px-4 rounded-md hover:bg-gray-200 flex gap-1 items-center" onClick={() => setTag('ecs')}>
                                <FontAwesomeIcon icon={faAngleLeft} className="font-bold" />
                                返回主机列表
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">管理所选云主机关联安全组（sg-23456789）的IP访问规则</p>
                    </div>
                    <div className="bg-gray-100 p-5 rounded-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="flex flex-col gap-1 relative">
                                <label className="text-sm">搜索IP是否在安全组中</label>
                                <input 
                                    className="outline-none border border-x-gray-200 p-2 rounded-md placeholder:text-gray-400 placeholder:text-sm"
                                    placeholder="输入要查询的IP地址，多个IP以分号分割"
                                />
                                <button className="bg-blue-600 p-2 px-4 text-white absolute -right-1 top-1/2 -translate-y-2 rounded-tr-md rounded-br-md flex gap-1 items-center">
                                    <FontAwesomeIcon icon={faMagnifyingGlass}  />
                                    查询
                                </button>
                            </div>
                            <div className="flex flex-col gap-1 relative">
                                <label className="text-sm">添加IP到安全组</label>
                                <input 
                                    className="outline-none border border-x-gray-200 p-2 rounded-md placeholder:text-gray-400 placeholder:text-sm"
                                    placeholder="输入要添加的IP地址，多个IP以分号分割"
                                />
                                <button className="bg-green-600 p-2 px-4 text-white absolute -right-1 top-1/2 -translate-y-2 rounded-tr-md rounded-br-md flex gap-1 items-center">
                                    <FontAwesomeIcon icon={faPlus} />
                                    添加
                                </button>
                            </div>
                        </div>    
                    </div>    
                </div>
            }
        </div>
    )
}