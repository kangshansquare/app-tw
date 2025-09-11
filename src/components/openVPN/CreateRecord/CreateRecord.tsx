'use client';

import ReactDOM from 'react-dom';
import { CloseOutlined, setTwoToneColor } from '@ant-design/icons'
import type { OpenVPNRecordType } from '@/types/record';
import { useState, useEffect } from 'react';

interface CreateRecordProps {
    show: boolean;
    onClose: () => void
    onNotify: (type: "success" | "error" | "info", message: string) => void
    fetchRecords: () => void
}



export default function CreateRecord({ show, onClose, onNotify, fetchRecords }: CreateRecordProps) {

    const [ defaultFormData, setDefaultFormData ] = useState<OpenVPNRecordType>({
        name: "",
        sector: "",
        account_ip: "",
        apply_date: new Date(),
        dest_ip: "",
        type: "open_rule",
        reason: "工作需要",
        apply_duration: "永久",
        status: "opened",
        description: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget

        setDefaultFormData(prev => ({
            ...prev,
            [name]: name === 'apply_date' ? (value ? new Date(value) : null) : value 
        }))
    }    

    // 红border提示
    const [ error, setError ] = useState<{ [ key: string ]: boolean }>({})


    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        setError({})
        if (!defaultFormData.account_ip) {
            setError({ account_ip: true })
            return;
        }

        if (!defaultFormData.status) {
            setError({ status: true })
            return;
        }



        console.log("用户输入的表单数据: ", defaultFormData)
        // 调用api，创建record，提示（成功失败）；关闭创建记录模态框，通知父组件（刷新数据）
        try {
            const res = await fetch("/api/record", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(defaultFormData)
            })
            const data = await res.json();
            if(data?.success) {
                if (fetchRecords) fetchRecords();    // 通知父组件刷新
                
                setTimeout(() => {
                    onNotify("success", "创建成功")
                    onClose();
                }, 500)
            } else {
                onNotify("error", "创建失败，请重试！")
            }

        } catch (error) {
            onNotify("error", "网络错误")
        }
           
    }



    if (!show) return;

    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='bg-white rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]' onClick={e => e.stopPropagation()}>
                    <div className='px-6 py-5 flex justify-between'>
                        <h3 className='text-lg'>新增用户记录</h3>
                        <CloseOutlined className='text-sm text-gray-400 hover:text-gray-500'  onClick={onClose}/>
                    </div>
                    
                    <div className='border border-gray-200' />

                    <div className='px-6 py-5'>
                        <form onSubmit={handleFormSubmit}>
                            <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 mb-5'>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>申请人</label>
                                    <input 
                                        className={`outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500 placeholder:text-sm`} 
                                        placeholder='张三' 
                                        name='name' 
                                        value={defaultFormData['name']}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>部门</label>
                                    <input 
                                        className='outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500' 
                                        name='sector' 
                                        value={defaultFormData['sector']} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>申请类型</label>
                                    <select 
                                        name='type' 
                                        value={defaultFormData['type']}
                                        className="outline-none border  p-2 rounded-lg border-gray-300 focus:border-blue-500"
                                        onChange={handleChange}
                                    >
                                        <option value="">请选择类型</option>
                                        <option value="apply_account">申请账号</option>
                                        <option value="open_rule">开通规则</option>
                                        <option value="account_and_rule">申请账号+开通规则</option>
                                        <option value="delete_rule">删除规则</option>
                                        <option value="close_account">注销账号</option>
                                    </select>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>申请日期</label>
                                    <input 
                                        type='date' 
                                        className='outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500' 
                                        name='apply_date' 
                                        value={defaultFormData['apply_date'].toISOString().split('T')[0]} 
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>目的IP-端口</label>
                                    <input 
                                        className='outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500 placeholder:text-sm' 
                                        placeholder='1.1.1.1 8080;2.2.2.2 80,443' 
                                        name='dest_ip' 
                                        value={defaultFormData['dest_ip']}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>截止日期</label>
                                    <input 
                                        className='outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500 placeholder:text-sm' 
                                        placeholder='永久、yyyy-mm-dd' 
                                        name='apply_duration' 
                                        value={defaultFormData['apply_duration']}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>状态</label>
                                    <select 
                                        name='status' 
                                        value={defaultFormData['status']}
                                        className={`outline-none border  p-2 rounded-lg  focus:border-blue-500 ${error.status ? "border-red-500" : "border-gray-300"}`}
                                        onChange={handleChange}
                                    >
                                        <option value="">请选择状态</option>
                                        <option value="opened">已开通</option>
                                        <option value="deleted">已删除</option>
                                        <option value="closed">已注销</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className='flex flex-col gap-2 mb-5'>
                                <label className='font-medium text-gray-500 text-sm'>账号/IP</label>
                                <input 
                                    className={`outline-none border ${error.account_ip ? "border-red-500" : "border-gray-300"} p-2 rounded-lg focus:border-blue-500 placeholder:text-sm`} 
                                    placeholder="username,172.19.x.x"
                                    name='account_ip'
                                    value={defaultFormData['account_ip']}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='flex flex-col gap-2 mb-5'>
                                <label className='font-medium text-gray-500 text-sm'>备注</label>
                                <textarea 
                                    className='outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500 placeholder:text-sm' 
                                    placeholder='可选备注信息' 
                                    name='description' 
                                    value={defaultFormData['description']}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='flex justify-end gap-4'>
                                <button className='outline-none border border-gray-300 p-2 px-4 rounded-lg hover:bg-gray-50' onClick={onClose}>取消</button>
                                <button className='outline-none bg-blue-500 text-white p-2 px-4 rounded-lg hover:bg-blue-400'>保存记录</button>
                            </div>
                        </form>
                    </div>
                    
                </div>
            </div>,
            document.body
        )
    )
}