'use client';
import ReactDom from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CabinetBaseFields } from '@/types/SystemManage';
import { useEffect, useState } from 'react';

interface CabinetCreatePortalProps {
    show: boolean
    onClose: () => void;
    onFetch: () => void;
    onNotify: (type: 'success' | 'info' | 'error', message: string) => void
    idcs: {id: number, name: string}[] | null
}

const initalFormData: CabinetBaseFields = {
    name: '',
    idcId: 0,
    uCount: 0,
    powerKw: '',
    status: 'active',
    remake: '',
}

export default function CabinetCreatePortal({ show ,onClose, onNotify, onFetch, idcs }: CabinetCreatePortalProps) {
    const [ cabinetData, setCabinetData ] = useState<CabinetBaseFields>(initalFormData)
    const [ idcName, setIdcName ] = useState<{id: number, name: string}[] | null>(null)
    const [ redBorder, setRedBorder ] = useState<{ name: boolean, idcId: boolean }>({name: false, idcId: false})

    const handleChange =  (e:React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        const parasedValue = (name === 'idcId' || name === 'uCount') ? Number(value) : value;
        setCabinetData(prev => ({ ...prev, [name]: parasedValue }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (cabinetData.name.trim() === '') {
            setRedBorder(prev => ({ ...prev, name: true }))
            return;
        }
        if (cabinetData.idcId === 0) {
            setRedBorder(prev => ({ ...prev, idcId: true }))
            return;
        }
        try {
            const res = await fetch('/api/system-manage/cabinet-manage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({cabinetData})
            })
            const data = await res.json();
            if (data?.success) {
                onFetch();
                onClose()
                onNotify("success", '创建成功')
                
            } else {
                const { message } = data;
                onNotify("error", message)
            }
        } catch(error) {
            onNotify("error", "网络异常")
        }
    }


    useEffect(() => {
        setIdcName(idcs)
    }, [])

    if (!show) return;
    return (
        ReactDom.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className=' bg-white rounded-lg w-full max-w-2xl overflow-y-auto max-h-[60vh]' onClick={(e) => e.stopPropagation()}>
                    <div className='flex flex-col gap-4'>
                        <div className='p-5 flex items-center justify-between'>
                            <h3>添加机柜</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className='border border-gray-200' />
                        <form onSubmit={handleSubmit} className='p-5'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                                <div className='flex flex-col gap-3'>
                                    <label className='text-sm  text-gray-500'>机柜编号<span className='text-red-600'>*</span></label>
                                    <input 
                                        name='name'
                                        className={`outline-none p-2 rounded-md border ${redBorder.name ? "border-red-600" : "border-gray-200"} placeholder:text-gray-500 placeholder:text-sm`}
                                        placeholder='请输入机柜编号'
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <label className='text-sm  text-gray-500'>所属机房<span className='text-red-600'>*</span></label>
                                    <select 
                                        name='idcId'
                                        className={`outline-none p-2 border ${redBorder.idcId ? "border-red-600" : "border-gray-200"} rounded-md text-base sm:text-sm text-gray-600`} 
                                        onChange={handleChange}
                                    >
                                        <option value="">请选择机房</option>
                                        {
                                            idcName?.map((idc) => (
                                                <option value={idc.id} key={idc.id}>{idc.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <label className='text-sm  text-gray-500'>U位数量</label>
                                    <input 
                                        name='uCount'
                                        className='outline-none p-2 rounded-md border border-gray-200 placeholder:text-gray-500 placeholder:text-sm' 
                                        placeholder='请输入机柜U位数量 [可选]'
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <label className='text-sm  text-gray-500'>功率</label>
                                    <input 
                                        name='powerKw'
                                        className='outline-none p-2 rounded-md border border-gray-200 placeholder:text-gray-500 placeholder:text-sm' 
                                        placeholder='请输入电源功率 [可选]'
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <label className='text-sm  text-gray-500'>状态</label>
                                    <select 
                                        className='outline-none p-2 border border-gray-200 rounded-md text-base sm:text-sm text-gray-600'
                                        name='status'
                                        onChange={handleChange}
                                        defaultValue={cabinetData.status}
                                    >
                                        <option value="">请选择状态</option>
                                        <option value="active">在用</option>
                                        <option value="deactive">已弃用</option>
                                    </select>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <label className='text-sm  text-gray-500'>所属业务线</label>
                                    <input 
                                        name='remake'
                                        className='outline-none p-2 rounded-md border border-gray-200 placeholder:text-gray-500 placeholder:text-sm' 
                                        placeholder='请输入所属业务线 [可选]'
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className='mt-5 flex items-center justify-end gap-5'>
                                <button className='p-2 px-4 border border-gray-200 rounded-md' onClick={onClose}>取消</button>
                                <button className='p-2 px-4 bg-blue-600 text-white rounded-md'>确认添加</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}