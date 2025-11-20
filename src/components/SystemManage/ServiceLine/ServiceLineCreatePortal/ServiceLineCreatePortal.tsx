'use client';
import ReactDOM from 'react-dom';
import { ServiceLineResField } from '@/types/SystemManage';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { use, useState } from 'react';
import { da } from 'zod/v4/locales';

interface ServiceLineCreatePortalProps {
    show: boolean;
    onClose: () => void;
    onFetch: () => void;
    onNotify: (type: 'success' | 'info' | 'error', message: string) => void
}

const initalServiceLineData: ServiceLineResField = {
    name: '',
    owner: '',
    email: '',
    status: 'active'
}

export default function ServiceLineCreatePortal({ show, onClose, onFetch, onNotify }: ServiceLineCreatePortalProps) {
    const [ serviceLineData, setServiceLineData ] = useState<ServiceLineResField>(initalServiceLineData)
    const [ redBorder, setRedBorder ] = useState<boolean>(false)
 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.currentTarget
        setServiceLineData(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (serviceLineData.name.trim() === '') {
            setRedBorder(true);
            return;
        }

        try {
            const res = await fetch('/api/system-manage/service-line', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceLineData)
            })
            const data = await res.json();
            const { message } = data
            if (data?.success) {
                onFetch()
                onClose()
                onNotify('success', message)
            } else {
                onNotify("error", message)
            }

        } catch(error) {
            onNotify("error", "网络异常")
        }


    }

    if (!show) return null;
    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='max-w-2xl bg-white rounded-lg w-full' onClick={(e) => e.stopPropagation()}>
                    <div className='flex flex-col'>
                        <div className='p-5 flex items-center justify-between'>
                            <h3 className='text-base text-gray-600'>创建业务线</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark}/>
                            </button>
                        </div>
                        <div className='border border-gray-100' />
                        <form className='p-5' onSubmit={handleSubmit}>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-500'>业务线名称<span className='text-red-600'>*</span></label>
                                    <input 
                                        className='outline-none p-2 border border-gray-200 rounded-md placeholder:text-gray-500 placeholder:text-sm'
                                        placeholder='请输入业务线名称'
                                        name='name'
                                        value={serviceLineData.name ?? ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-500'>负责人</label>
                                    <input 
                                        className='outline-none p-2 border border-gray-200 rounded-md placeholder:text-gray-500 placeholder:text-sm'
                                        placeholder='请输入业务线负责人【可选】'
                                        name='name'
                                        value={serviceLineData.owner ?? ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-500'>邮箱</label>
                                    <input 
                                        className='outline-none p-2 border border-gray-200 rounded-md placeholder:text-gray-500 placeholder:text-sm'
                                        placeholder='请输入负责人邮箱地址【可选】'
                                        name='name'
                                        value={serviceLineData.email ?? ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-500'>状态</label>
                                    <select 
                                        className='outline-none p-2 text-sm text-gray-600 border border-gray-200'
                                        value={serviceLineData.status ?? ''}
                                        onChange={handleChange}    
                                    >
                                        <option value="">请选择业务线状态</option>
                                        <option value="active">在用</option>
                                        <option value="deactive">已弃用</option>
                                    </select>
                                </div>
                            </div>
                            <div className='mt-5 mb-2 flex items-center justify-end gap-4'>
                                <button className='border border-gray-200 p-2 px-4 rounded-md text-base hover:bg-gray-50' onClick={onClose}>取消</button>
                                <button className='bg-[#165DFF] text-white text-base p-2 px-4 rounded-md'>创建</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}