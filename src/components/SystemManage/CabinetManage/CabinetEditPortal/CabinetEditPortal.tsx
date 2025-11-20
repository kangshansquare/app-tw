'use client';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CabinetResData } from '@/types/SystemManage';
import { useEffect, useState } from 'react';



interface CabinetEditPortalProps {
    onClose: () => void;
    cabinet: CabinetResData | null;
    idcs: {id: number, name: string}[] | null;
    onFetch: () => void;
    onNotify: (type: 'success' | 'info' | 'error', message: string) => void;
}

const initalFormData: CabinetResData = {
    name: '',
    idcId: 0,
    uCount: 0,
    powerKw: '',
    status: 'active',
    remake: '',
}

export default function CabinetEditPortal({ onClose, cabinet, idcs, onNotify, onFetch }: CabinetEditPortalProps) {

    const [ updateCabinet, setUpdateCabinet ] = useState<CabinetResData>(initalFormData);
    const [ idcName, setIdcName ] = useState<{ id: number, name: string }[]>([]);
    const [ redBorder, setRedBorder ] = useState<{name: boolean, idcId: boolean}>({name: false, idcId: false})

    const handlChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        const parasedValue = (name === 'idcId' || name === 'uCount') ? Number(value) : value;
        setUpdateCabinet(prev => ({ ...prev, [name]: parasedValue }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (updateCabinet.name.trim() === '') {
            setRedBorder(prev => ({...prev, name: true}))
            return
        }
        if (updateCabinet.idcId === 0) {
            setRedBorder(prev => ({...prev, idcId: true}))
            return
        };

        try {
            const res = await fetch(`/api/system-manage/cabinet-manage/${updateCabinet.id}`, {
                method: 'PUT',
                headers: {
                    'Conetnt-Type': 'application/json'
                },
                body: JSON.stringify({ updateCabinet })
            })
            const data = await res.json();
            const { message } = data;
            if (data?.success) {
                onFetch()
                onClose()
                onNotify('success', message)
            } else {
                onNotify('error', message)
            }
        } catch(error) {
            onNotify('error', '网络异常!')
        }

    }

    useEffect(() => {
        if (cabinet) setUpdateCabinet(cabinet)
        if (idcs) setIdcName(idcs)
    }, [cabinet, idcs])

    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className=' bg-white rounded-lg w-full max-w-2xl overflow-y-auto max-h-[60vh]' onClick={(e) => e.stopPropagation()}>
                    <div className='flex flex-col gap-2'>
                        <div className='p-5 flex items-center justify-between'>
                            <h3>编辑机柜信息</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className='border border-gray-200' />
                        <form className='p-5 flex flex-col gap-5' onSubmit={handleSubmit}>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-600'>机柜编号<span className='text-red-600'>*</span></label>
                                    <input 
                                        className={`outline-none border ${redBorder.name ? "border-red-600" : "border-gray-200"} p-2 rounded-md`} 
                                        value={updateCabinet.name} 
                                        name='name'
                                        onChange={handlChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-600'>所属机房<span className='text-red-600'>*</span></label>
                                    <select 
                                        className={`outline-none border ${redBorder.idcId ? "border-red-600" : "border-gray-200"} p-2 rounded-md`}
                                        name='idcId'
                                        value={updateCabinet.idcId}
                                        onChange={handlChange}
                                    >
                                        { idcName.map(i => (
                                            <option key={i.id} value={i.id}> 
                                                {i.name}
                                            </option>
                                        )) }
                                    </select>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-600'>U位数量</label>
                                    <input 
                                        className='outline-none border border-gray-200 p-2 rounded-md' 
                                        value={updateCabinet.uCount} 
                                        name='uCount'
                                        onChange={handlChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-600'>功率</label>
                                    <input 
                                        className='outline-none border border-gray-200 p-2 rounded-md' 
                                        value={updateCabinet.powerKw} 
                                        name='powerKw'
                                        onChange={handlChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-600'>状态</label>
                                    <select 
                                        className='outline-none border border-gray-200 p-2 rounded-md'
                                        name='status'
                                        value={updateCabinet.status}
                                        onChange={handlChange}
                                    >
                                        <option value='active'>在用</option>
                                        <option value='deactive'>已弃用</option>
                                    </select>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-600'>业务线</label>
                                    <input 
                                        className='outline-none border border-gray-200 p-2 rounded-md' 
                                        value={updateCabinet.remake} 
                                        name='remake'
                                        onChange={handlChange}
                                    />
                                </div>
                            </div>
                            <div className='my-2 flex items-center justify-end gap-5'>
                                <button className='p-2 px-4 border border-gray-200 rounded-md'>取消</button>
                                <button className='p-2 px-4 bg-blue-600 rounded-md text-white'>更新</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}