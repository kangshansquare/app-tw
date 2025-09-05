'use client';

import ReactDOM from 'react-dom';
import type { OpenVPNRecordType } from '@/types/record';

import { CloseOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';

interface EditRecordProps {
    show: boolean
    onClose: () => void
    record: OpenVPNRecordType | null
    onNotify: (type: "success" | "error" | "info", message: string) => void
    fetchRecords: () => void
}


export default function EditRecord({ show, onClose, record, onNotify, fetchRecords }: EditRecordProps) {

    const [ updateRecord, setUpdateRecord ] = useState<OpenVPNRecordType | null>(null)

    function getChangedFields<T extends object>(original: T, updated: T): Partial<T> {
        const changed: Partial<T> = {};

        (Object.keys(updated) as Array<keyof T>).forEach(key => {
            const originalValue = original[key]
            const updatedValue = updated[key]

            if (updatedValue !== originalValue) {
                changed[key] = updatedValue;
            }
        })

        return changed;
    }

    const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;
        
        setUpdateRecord(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: name === 'apply_date' ? new Date(value) : value
            }
        })
        
    }

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!updateRecord) {
            onNotify("error", "数据异常")
            return;
        }

        const updateFormData = new FormData(e.currentTarget);
        
        const type = updateFormData.get('type')
        const account_ip = updateFormData.get('account_ip')

        if (!type || !account_ip) {
            onNotify("error", "请填写信息")
            return;
        }

        if (record && updateRecord) {
            const updateData = getChangedFields(record, updateRecord)

            try {
                const res = await fetch(`/api/record/${updateRecord.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ updateData })
                })

                const data = await res.json();
                if (data?.success) {
                    onNotify("success", "更新记录成功")
                    console.log("更新成功，关闭模态框，提醒父组件刷新")
                    onClose();
                    fetchRecords();
                } else {
                    onNotify("error", "更新失败")
                }
                 
            } catch (error) {
                onNotify("error", "网络错误")
            }
        } 
    }


    useEffect(() => {
        setUpdateRecord(record)
    }, [record])

    if (!record) return;

    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='bg-white w-full max-w-4xl rounded-lg' onClick={e => e.stopPropagation()}>
                    <div className='p-6 flex justify-between'>
                        <h3 className='font-medium text-gray-600 text-lg'>编辑记录</h3> 
                        <CloseOutlined className='text-gray-600 hover:text-gray-500 hover:cursor-pointer' onClick={onClose} />
                    </div>
                    <div className=' border border-gray-200'/>

                    <div className='px-6 py-5'>
                        <form onSubmit={handleForm}>
                            <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 mb-5'>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>申请人</label>
                                    <input 
                                        className={`outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500 placeholder:text-sm`} 
                                        name='name' 
                                        value={updateRecord?.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>部门</label>
                                    <input 
                                        className='outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500' 
                                        name='sector' 
                                        value={updateRecord?.sector}
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>申请类型</label>
                                    <select 
                                        name='type' 
                                        value={updateRecord?.type}
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
                                        value={updateRecord ? new Date(updateRecord.apply_date).toISOString().split('T')[0] : ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>目的IP-端口</label>
                                    <input 
                                        className='outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500 placeholder:text-sm' 
                                        name='dest_ip' 
                                        value={updateRecord?.dest_ip ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-500 text-sm'>申请时长</label>
                                    <input 
                                        className='outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500 placeholder:text-sm' 
                                        name='apply_duration' 
                                        value={updateRecord?.apply_duration}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            
                            <div className='flex flex-col gap-2 mb-5'>
                                <label className='font-medium text-gray-500 text-sm'>账号/IP</label>
                                <input 
                                    className={`outline-none border  border-gray-300 p-2 rounded-lg focus:border-blue-500 placeholder:text-sm`} 
                                    name='account_ip'
                                    value={updateRecord?.account_ip}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='flex flex-col gap-2 mb-5'>
                                <label className='font-medium text-gray-500 text-sm'>备注</label>
                                <textarea 
                                    className='outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500 placeholder:text-sm' 
                                    name='description' 
                                    value={updateRecord?.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='flex justify-end gap-4'>
                                <button className='outline-none border border-gray-300 p-2 px-4 rounded-lg hover:bg-gray-50' onClick={onClose}>取消</button>
                                <button className='outline-none bg-blue-500 text-white p-2 px-4 rounded-lg hover:bg-blue-400'>更新记录</button>
                            </div>
                        </form>
                    </div>
                </div>              
            </div>,
            document.body
        )
    )
}