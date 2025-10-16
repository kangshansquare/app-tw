'use client';

import  ReactDOM  from "react-dom";
import { CloseOutlined, PlusSquareFilled, DeleteOutlined } from '@ant-design/icons';
import { MiddlewareData } from "@/types/MiddlewareData";
import { useEffect, useState } from "react";


interface UpdateMiddlewareProps {
    show: boolean;
    onClose: () => void;
    middlewareData: MiddlewareData | null;
    onNotify: (type: 'success' | "error" | "info", message: string) => void;
    onFetch: (page: number, pageSize: number) => void;
}
 
export default function UpdateMiddleware({ show, onClose, middlewareData,onNotify, onFetch }: UpdateMiddlewareProps) {

    const defaultForm: MiddlewareData = {
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

    const [ updateMiddlewareData, setUpdateMiddlewareData ] = useState<MiddlewareData>(middlewareData ? { ...defaultForm, ...middlewareData }: defaultForm)

    const [ inputs, setInputs ] = useState<{ id: number; cluster_ip_port: string; role: string; group_name: string }[]>(
       () => (middlewareData?.cluster_config?.map((item, index) => ({
        id: index,
        cluster_ip_port: item.cluster_ip_port,
        role: item.role ?? '',
        group_name: item.group_name ?? ''
       })) || [])
    )

    const AddInputs = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        setInputs(prev => {
            const next = [...prev, { id: Date.now(), cluster_ip_port: "", role: "", group_name: "" }];
            setUpdateMiddlewareData(p => ({ ...p, cluster_config: next }))
            return next;
        })

        // const new_id = Number(new Date());
        // const newNode = { id: new_id, cluster_ip_port: "", role: "", group_name: "" }
        // setInputs(prev => [...prev, newNode])
        // setUpdateMiddlewareData(prev => ({
        //     ...prev,
        //     cluster_config: [...(prev.cluster_config ?? []), newNode]
        // }))
    }
    const handleAddInputChange = (id: number, key: 'cluster_ip_port' | 'role' | 'group_name', value: string) => {
        
        console.log('111111111111',key, value)

        setInputs(prev => {
            const next = prev.map(n => (n.id === id) ? { ...n, [key]: value } : n);
            setUpdateMiddlewareData(p => ({ ...p, cluster_config: next }));
            return next;
        })

        // setInputs(prev => prev.map(n => (n.id === id ? { ...n, [key]: value } : n)))

        // setUpdateMiddlewareData(prev => ({
        //     ...prev,
        //     cluster_config: (prev.cluster_config ?? []).map(n => (n.id === id ? {...n, [key]: value} : n))
        // }))

    }

    const removeInputs = (e: React.MouseEvent<HTMLButtonElement>,id: number) => {
        e.preventDefault();

        setInputs(prev => {
            const next = prev.filter(n => n.id !== id);
            setUpdateMiddlewareData(p => ({ ...p, cluster_config: next }));
            return next;
        })

        // setInputs(prev => (prev.length > 1 ? prev.filter(input => input.id !== id) : prev))
        // setUpdateMiddlewareData(prev => ({
        //     ...prev,
        //     cluster_config: (prev.cluster_config ?? []).length > 1
        //         ? prev.cluster_config!.filter(x => x.id !== id)
        //         : prev.cluster_config
        // }))
    }


    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;
        console.log(name, value)
        
        // name === single，cluster_config = []； ip_port = value
        // name === cluster, ip_port = ''; cluster_config = [{}]
        // 同步更新inputs
        // if (name === 'deploy_mode') {
        //     const next = { ...updateMiddlewareData, deploy_mode: value }
        //     if (value === 'single') {
        //         next.cluster_config = [];
        //         next.ip_port = next.ip_port ?? '';
        //         setInputs([{id: Date.now(), cluster_ip_port: "", role: "", group_name: ""}])
        //     } else if (value === 'cluster') {
        //         next.ip_port = '';
        //         next.cluster_config = [{id: Date.now(), cluster_ip_port: "", role: "", group_name:""}]
        //         setInputs(next.cluster_config.map((i, index) => ({
        //             id: index,
        //             cluster_ip_port: i.cluster_ip_port ?? "",
        //             role: i.role ?? "",
        //             group_name: i.group_name ?? ""
        //         })))
        //     }
        //     console.log('----------',next)
        //     setUpdateMiddlewareData(next)
        // }
        
        

        if (name === 'deploy_mode') {
            if (value === 'single') {
                const node = {id: Date.now(), cluster_ip_port: "", role: "", group_name: ""}
                setInputs([node])
                setUpdateMiddlewareData(prev => ({
                    ...prev,
                    deploy_mode: value,
                    ip_port: prev.ip_port ?? "",
                    cluster_config: []
                }))
            } else if (value === 'cluster') {
                const nodes = [{id: Date.now(), cluster_ip_port: "", role: "", group_name: ""}]
                setInputs(nodes)
                setUpdateMiddlewareData(prev => ({
                    ...prev,
                    deploy_mode: value,
                    ip_port: "",
                    cluster_config: nodes
                }))
            }
            return
        }
        

        setUpdateMiddlewareData(prev => ({ ...prev, [name]: value }))        
    }

    const handleUpdateForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log('input --------', inputs)
        // console.log('+++++ ++++',updateMiddlewareData)

        const id = updateMiddlewareData.id
        console.log(id)
        try {
            const res = await fetch(`/api/middleware/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateMiddlewareData)
            })
            const data = await res.json();
            if (data?.success) {
                if (onFetch) onFetch(1,5)
                onClose()
                onNotify("success", "中间件信息更新成功")
            } 
        } catch (error) {
            onNotify("error", "网络错误")
        }
    }

    useEffect(() => {
        setUpdateMiddlewareData(middlewareData ? { ...defaultForm, ...middlewareData } : defaultForm)

        const next = middlewareData?.cluster_config && middlewareData.cluster_config.length > 0
            ? middlewareData.cluster_config.map((item, index) => ({
                id: index,
                cluster_ip_port: item.cluster_ip_port,
                role: item.role ?? '',
                group_name: item.group_name ?? ''
            }))
            : [{ id: Date.now(), cluster_ip_port: '', role: '', group_name: '' }];
        
        
        setInputs(next);
        
    }, [middlewareData])

    if (!show) return null;
    return (
        ReactDOM.createPortal(
            <div className="fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center" onClick={onClose}>
                <div className=' bg-white rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]' onClick={(e) => e.stopPropagation()}>
                    <div className="p-5 flex justify-between items-center border border-gray-100 mb-5">
                        <span className="font-semibold text-lg">更新中间件信息</span>
                        <button className="h-5 w-5 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center" onClick={onClose}>
                            <CloseOutlined  />
                        </button>
                    </div>
                    <form onSubmit={handleUpdateForm} className="flex flex-col gap-3 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="px-5 flex flex-col gap-2">
                                <div className="flex gap-1 items-center">
                                    <label>中间件类型</label>
                                    <span className="text-red-600">*</span>
                                </div>
                                <select 
                                    className={`outline-none border  focus:border-blue-500 p-2 rounded-lg`} 
                                    name="type" 
                                    onChange={handleChange} 
                                    value={updateMiddlewareData?.type}
                                >
                                    <option value="">请选择中间件类型</option>
                                    <option value="mysql">MySQL</option>
                                    <option value="redis">Redis</option>
                                    <option value="fastdfs">FastDFS</option>
                                    <option value="minio">MinIO</option>
                                </select>
                            </div>
                            <div className="px-5 flex flex-col gap-2">
                                <div className="flex gap-1">
                                    <label>中间件名称</label>
                                    <span className="text-red-600">*</span>
                                </div>
                                <input 
                                    className={`outline-none border  focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400`} 
                                    placeholder="例如: MySQL主从集群"
                                    name="name"
                                    onChange={handleChange}
                                    value={updateMiddlewareData?.name}
                                />
                            </div>
                            <div className="px-5 flex flex-col gap-2">
                                <div className="flex gap-1">
                                    <label>版本</label>
                                    <span className="text-red-600">*</span>
                                </div>
                                <input 
                                    className={`outline-none border  focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400`} 
                                    placeholder="例如: 8.0.28"
                                    name="version"
                                    onChange={handleChange}
                                    value={updateMiddlewareData?.version}
                                />
                            </div>
                            <div className="px-5 flex flex-col gap-2">
                                <label>业务线</label>
                                <select 
                                    className={`outline-none border  focus:border-blue-500 p-2 rounded-lg`} 
                                    name="service_line" 
                                    onChange={handleChange}
                                    value={updateMiddlewareData?.service_line}
                                >
                                    <option value="">请选择业务线</option>
                                    <option value="server_line1">业务线1</option>
                                    <option value="service_line2">业务线1</option>
                                </select>
                            </div>
                            <div className="px-5 flex flex-col gap-2">
                                <div className="flex gap-1">
                                    <label>部署模式</label>
                                    <span className="text-red-600">*</span>
                                </div>
                                <select 
                                    className={`outline-none border  focus:border-blue-500 p-2 rounded-lg`}
                                    name="deploy_mode"
                                    value={updateMiddlewareData?.deploy_mode}
                                    onChange={handleChange}
                                >
                                    <option value="">请选择部署模式</option>
                                    <option value="single">单节点</option>
                                    <option value="cluster">集群部署</option>
                                </select>
                            </div>

                            {
                                updateMiddlewareData?.deploy_mode === 'single' && 
                                <div className="px-5 flex flex-col gap-2">
                                    <label>服务器IP:端口</label>
                                    <input 
                                        className={`outline-none border  focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400`} 
                                        placeholder="例如: 192.168.1.1:306" 
                                        name="ip_port"
                                        onChange={handleChange}
                                        value={updateMiddlewareData?.ip_port}                                    />
                                </div>
                            }
                            {
                                updateMiddlewareData?.deploy_mode === 'cluster' &&
                                <div className="px-5 md:col-span-2 gap-2">
                                    <div className="mb-2 items-center flex gap-1">
                                        <div className="flex gap-1">
                                            <label>集群节点</label>
                                            <span className="text-red-600">*</span>
                                        </div>
                                        <button className="ml-2 text-sm text-blue-600 flex gap-1" onClick={AddInputs} type="button">
                                            <PlusSquareFilled className="" />
                                            添加节点
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {
                                            inputs.map((input) => (
                                                <div key={input.id} className="flex items-center  gap-3 w-full">
                                                    <input 
                                                        className={`flex-1 outline-none border  focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400`} 
                                                        placeholder="IP:端口"
                                                        name="cluster_ip_port" 
                                                        onChange={(e) => handleAddInputChange(input.id, "cluster_ip_port", e.target.value)}
                                                        value={input.cluster_ip_port}
                                                    />
                                                    <input 
                                                        className="flex-1 outline-none border border-gray-300 focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400"
                                                        placeholder="角色, 如master/slave"
                                                        name="role"
                                                        onChange={(e) => handleAddInputChange(input.id, "role", e.target.value)}
                                                        value={input.role}
                                                    />
                                                    <input 
                                                        className="flex-1 outline-none border border-gray-300 focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400"
                                                        placeholder="组名（可选）" 
                                                        name="group_name"
                                                        onChange={(e) => handleAddInputChange(input.id, "group_name", e.target.value)}
                                                        value={input.group_name}
                                                    />
                                                    <button className="whitespace-nowrap flex items-center justify-center hover:text-red-600" onClick={(e) => removeInputs(e, input.id)} type="button">
                                                        <DeleteOutlined />
                                                    </button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }


                        </div>
                        <div className="px-5 flex flex-col gap-2">
                            <label>描述信息</label>
                            <textarea 
                                className="p-2 outline-none border border-gray-300 rounded-lg focus:border-blue-500 placeholder:text-sm placeholder:text-gray-400" 
                                placeholder="请输入中间件描述信息，如用途等 (可选)" 
                                name="description"
                                onChange={handleChange}
                                value={updateMiddlewareData?.description}
                            />
                        </div>
                        <div className="px-5 flex flex-col gap-2 mb-3">
                            <label>备注信息</label>
                            <textarea 
                                className="p-2 outline-none border border-gray-300 rounded-lg focus:border-blue-500 placeholder:text-sm placeholder:text-gray-400" 
                                placeholder="请输入中间件备注信息，如维护人员、部署时间等" 
                                name="note"
                                onChange={handleChange}
                                value={updateMiddlewareData?.note}
                            />
                        </div>
                        <div className="p-5 flex justify-end gap-2 border-t border-gray-200">
                            <button className="outline-none border border-gray-200 p-2 px-5 rounded-lg" onClick={onClose}>取消</button>
                            <button className="outline-none bg-blue-600 text-white p-2 px-5 rounded-lg">保存</button>
                        </div>
                    </form>
                </div>
            </div>,
            document.body
        )
    )
}