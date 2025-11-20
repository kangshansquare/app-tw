'use client';

import  ReactDOM  from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { IdcBaseFields } from "@/types/SystemManage";
import { useState } from "react";


interface CreateIdcComponentProps {
    onClose: () => void;
    show: boolean;
    onNotiy: (type: 'success' | 'error' | 'info', message: string) => void
    onFetch: () => void
}

const initalFormData: IdcBaseFields = {
    name: '',
    location: '',
    address: '',
    contact: '',
}

export default function CreateIdcComponent({ onClose, show, onNotiy, onFetch }: CreateIdcComponentProps) {
    const [ borderColor, setBorderColor ] = useState<{[key: string]: boolean}>({name: false, location: false})
    const [ formData, setFormData ] = useState<IdcBaseFields>(initalFormData)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLInputElement | HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData)
        if (formData.name.trim() === '') {
            setBorderColor(prev => ({ ...prev, name: true }))
            return
        }
        if (formData.location?.trim() === '') {
            setBorderColor(prev => ({ ...prev, location: true }))
        }

        try {
            const res = await fetch('/api/system-manage/idc-manage', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            if (data?.success) {
                onFetch();
                onClose();
                onNotiy('success', "机房创建成功~")
                
            } else {
                onNotiy('error', "机房创建失败~")
            }
        } catch (error) {
            onNotiy('error', "网络异常~")
        }
        
    }

    
    if (!show) return null;
    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className=' bg-white rounded-lg w-full max-w-2xl overflow-y-auto max-h-[60vh]' onClick={(e) => e.stopPropagation()}>
                    <div className="p-5 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">添加机房</h3>
                        <button onClick={onClose}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className="border-b border-gray-300 my-2"/>
                    <form className="p-5" onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm sm:text-base text-gray-600">机房名称<span className="text-red-600">*</span></label>
                                <input 
                                    name="name"
                                    className={`outline-none p-2 rounded-md border ${borderColor.name ? "border-red-500" : "border-gray-300"} focus:border-blue-500 placeholder:text-sm placeholder:text-gray-500`}
                                    value={formData.name ?? ''} 
                                    onChange={handleChange}   
                                    placeholder="请输入机房名称" 
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm sm:text-base text-gray-600">地区<span className="text-red-600">*</span></label>
                                <input 
                                    name="location"
                                    className={`outline-none p-2 rounded-md border ${borderColor.location ? "border-red-500" : "border-gray-300"} focus:border-blue-500 placeholder:text-sm placeholder:text-gray-500`} 
                                    value={formData.location ?? ''}    
                                    onChange={handleChange}
                                    placeholder="请输入机房所在地区，如北京、上海"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-sm sm:text-base text-gray-600">地址</label>
                                <input 
                                    name="address"
                                    className="outline-none p-2 rounded-md border border-gray-300 focus:border-blue-500 placeholder:text-sm placeholder:text-gray-500" 
                                    value={formData.address ?? ''}
                                    onChange={handleChange}
                                    placeholder="请输入机房地址【可选】"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm sm:text-base text-gray-600">机房联系电话</label>
                                <input 
                                    name="contact"
                                    className="outline-none p-2 rounded-md border border-gray-300 focus:border-blue-500 placeholder:text-sm placeholder:text-gray-500" 
                                    value={formData.contact ?? ''}
                                    onChange={handleChange}
                                    placeholder="请输入机房联系电话【可选】"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-4 my-5 mt-8">
                            <button className="border border-gray-200 rounded-md p-2 px-4" onClick={onClose}>取消</button>
                            <button className="bg-blue-600 p-2 text-white rounded-md">确认添加</button>
                        </div>
                    </form>
                </div>
            </div>,
            document.body
        )
    )
}