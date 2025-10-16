'use client';

import  ReactDOM  from "react-dom";
import { CloseOutlined, DeleteOutlined, PlusSquareFilled } from '@ant-design/icons'
import React, { useEffect, useState } from "react";
import { MiddlewareFormData } from "@/types/MiddlewareData";


interface CreatemiddlewareProps {
    show: boolean;
    onClose: () => void;
    onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
    onFetch: (page: number, pageSize: number) => void
    pageSize: number
}

const initalFormData: MiddlewareFormData = {
    type: '',
    name: '',
    version: '',
    service_line: '',
    deploy_mode: '',
    ip_port: '',
    cluster_config: [],
    description: '',
    note: ''
};



export default function Createmiddleware({ show, onClose, onNotify, onFetch, pageSize }: CreatemiddlewareProps) {

    const [ formData, setFormData ] = useState<MiddlewareFormData>(initalFormData)

    const [ redBorder, setRedBorder ] = useState<{[ key: string ]: boolean}>({})
    const [ submitted, setSubmitted ] = useState<boolean>(false)
    

    // 添加新inputs元素
    const [ inputs, setInputs ] = useState<{ id: number; cluster_ip_port: string; role: string; group_name: string }[]>([
        {id: 1, cluster_ip_port: "", role: "", group_name: ""}
    ])
    const AddInputs = (e: React.FormEvent<HTMLButtonElement>) => {
        const new_id = Number(new Date());
        setInputs([...inputs, { id: new_id, cluster_ip_port: "", role: "", group_name: "" }])
    }
    const removeInputs = (id: number) => {
        if (inputs.length > 1) {
            setInputs(inputs.filter((input) => input.id !== id))
        } else {
            return;
        }
    }
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        console.log(name, value)
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleAddInputChange = (id: number, key: 'cluster_ip_port' | 'role' | 'group_name', value: string) => {
        setInputs(prev => prev.map(n => (n.id === id ? { ...n, [key]: value } : n)))
    }

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true)
        setRedBorder({})

        
        if (!formData.type) {
            setRedBorder({ type: true })
            return;
        }
        if (!formData.name) {
            setRedBorder({ name: true });
            return;
        }
        if (!formData.version) {
            setRedBorder({ version: true });
            return;
        }
        if (!formData.service_line) {
            setRedBorder({ service_line: true })
            return;
        }
        if (!formData.deploy_mode) {
            setRedBorder({ deploy_mode: true });
            return;
        } 

        console.log(redBorder,formData.deploy_mode, formData.cluster_config)

        console.log(inputs)

        if (formData.deploy_mode === 'single') {
            if (!formData.ip_port) {
                setRedBorder({ ip_port: true })
                return
            } 

            const res = await fetch('/api/middleware', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await res.json();
            if (data?.success) {
                if (onFetch) onFetch(1, pageSize);
                onNotify('success', '创建中间件成功')
                onClose()
                console.log("创建中间件成功")
            } else {
                onNotify('error', '创建中间件失败')
                console.log("创建中间件失败")
            }

        } else if (formData.deploy_mode === 'cluster') {
            const cluster_config = inputs.filter(input => input.cluster_ip_port.trim()).map(({ cluster_ip_port, role, group_name }) => ({
                cluster_ip_port: cluster_ip_port.trim(),
                role: role.trim() || "",
                group_name: group_name.trim() || ""
            }))

            console.log('POST', formData.cluster_config, inputs)

            if (inputs.some(n => !n.cluster_ip_port.trim())) {
                setRedBorder({ cluster_config: true })
                return
            } 

            const payload = { ...formData, cluster_config }

            console.log(payload, '==========')

            const res = await fetch('/api/middleware', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data?.success) {
                if (onFetch) onFetch(1, pageSize);
                onNotify('success', '创建中间件成功')
                onClose()
                console.log("创建中间件成功")
            } else {
                onNotify('error', '创建中间件失败')
                console.log("创建中间件失败")
            }

        } 

    }


    if (!show) return null;

    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className=' bg-white rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]' onClick={(e) => e.stopPropagation()}>
                    <div className="p-5 flex justify-between items-center border border-gray-100 mb-5">
                        <span className="font-semibold text-lg">添加新中间件</span>
                        <button className="h-5 w-5 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center" onClick={onClose}>
                            <CloseOutlined />
                        </button>
                    </div>
                    <form onSubmit={handleForm} className="flex flex-col gap-3 overflow-hidden" >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="px-5 flex flex-col gap-2">
                                <div className="flex gap-1 items-center">
                                    <label>中间件类型</label>
                                    <span className="text-red-600">*</span>
                                </div>
                                <select 
                                    className={`outline-none border ${redBorder.type ? "border-red-300" : "border-gray-300"} focus:border-blue-500 p-2 rounded-lg`} 
                                    name="type" 
                                    onChange={handleChange} 
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
                                    className={`outline-none border ${redBorder.name ? "border-red-300" : "border-gray-300"} focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400`} 
                                    placeholder="例如: MySQL主从集群"
                                    name="name"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="px-5 flex flex-col gap-2">
                                <div className="flex gap-1">
                                    <label>版本</label>
                                    <span className="text-red-600">*</span>
                                </div>
                                <input 
                                    className={`outline-none border ${redBorder.version ? "border-red-300" : "border-gray-300"} focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400`} 
                                    placeholder="例如: 8.0.28"
                                    name="version"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="px-5 flex flex-col gap-2">
                                <label>业务线</label>
                                <select 
                                    className={`outline-none border ${redBorder.service_line ? "border-red-300" : "border-gray-300"} focus:border-blue-500 p-2 rounded-lg`} 
                                    name="service_line" 
                                    onChange={handleChange}
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
                                    className={`outline-none border ${redBorder.deploy_mode ? "border-red-300" : "border-gray-300"} focus:border-blue-500 p-2 rounded-lg`}
                                    name="deploy_mode"
                                    value={formData.deploy_mode}
                                    onChange={handleChange}
                                >
                                    <option value="">请选择部署模式</option>
                                    <option value="single">单节点</option>
                                    <option value="cluster">集群部署</option>
                                </select>
                            </div>
                            {
                                formData.deploy_mode === 'single' && 
                                <div className="px-5 flex flex-col gap-2">
                                    <label>服务器IP:端口</label>
                                    <input 
                                        className={`outline-none border ${redBorder.ip_port ? "border-red-300" : "border-gray-300"} focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400`} 
                                        placeholder="例如: 192.168.1.1:306" 
                                        name="ip_port"
                                        onChange={handleChange}                                    />
                                </div>
                            }
                            {
                                formData.deploy_mode === 'cluster' &&
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
                                                        className={`flex-1 outline-none border ${submitted && redBorder.cluster_config && !input.cluster_ip_port.trim() ? "border-red-300" : "border-gray-300"} focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400`} 
                                                        placeholder="IP:端口"
                                                        name="cluster_ip_port" 
                                                        onChange={(e) => handleAddInputChange(input.id, "cluster_ip_port", e.target.value)}
                                                    />
                                                    <input 
                                                        className="flex-1 outline-none border border-gray-300 focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400"
                                                        placeholder="角色, 如master/slave"
                                                        name="role"
                                                        onChange={(e) => handleAddInputChange(input.id, "role", e.target.value)}
                                                    />
                                                    <input 
                                                        className="flex-1 outline-none border border-gray-300 focus:border-blue-500 p-2 rounded-lg placeholder:text-sm placeholder:text-gray-400"
                                                        placeholder="组名（可选）" 
                                                        name="group_name"
                                                        onChange={(e) => handleAddInputChange(input.id, "group_name", e.target.value)}
                                                    />
                                                    <button className="whitespace-nowrap flex items-center justify-center hover:text-red-600" onClick={() => removeInputs(input.id)}>
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
                            />
                        </div>
                        <div className="px-5 flex flex-col gap-2 mb-3">
                            <label>备注信息</label>
                            <textarea 
                                className="p-2 outline-none border border-gray-300 rounded-lg focus:border-blue-500 placeholder:text-sm placeholder:text-gray-400" 
                                placeholder="请输入中间件备注信息，如维护人员、部署时间等" 
                                name="note"
                                onChange={handleChange}
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