'use client';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { IdcResData } from '@/types/SystemManage';
import { useEffect, useState } from 'react';


interface IdcEditPortalProps {
    show: boolean;
    onClose: () => void;
    idc: IdcResData | null;
    onNotiy: (type: 'success' | 'error' | 'info', message: string) => void;
    onFetch: () => void;
}


export default function IdcEditPortal({ show, onClose, idc, onNotiy, onFetch }: IdcEditPortalProps) {

    const [ redBorder, setRedBorder ] = useState<{ name: boolean, location: boolean }>({ name: false, location: false })
    const [ updataIdc, setUpdataIdc ] = useState<IdcResData | null>(null)
    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setUpdataIdc(prev => ({ ...prev, [name]: value }))
    }

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

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!updataIdc) {
            onNotiy('error', '数据异常')
            return
        }
        
        const updataData = new FormData(e.currentTarget);
       
        const name = updataData.get('name')
        const location = updataData.get('location')
         console.log(updataData, name, location)
        if (!name) {
            setRedBorder(prev => ({ ...prev, name: true }))
            return
        }
        if (!location) {
            setRedBorder(prev => ({ ...prev, location: true }))
            return
        }

        try {
            const res = await fetch(`/api/system-manage/idc-manage/${updataIdc.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ updataIdc })
            });
            const data = await res.json();
            if (data?.success) {
                const { message } = data
                onFetch();
                onClose();
                onNotiy('success', message)
            } else {
                const { message } = data
                onNotiy('error', message)
            }

        } catch(error) {
            onNotiy('error', '网络异常~')
        }
    }

    useEffect(() => {
        setUpdataIdc(idc)
    }, [idc])

    if (!show) return;
    if (!idc) return null;
    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='bg-white rounded-lg w-full max-w-2xl overflow-y-auto max-h-[60vh]' onClick={(e) => e.stopPropagation()}>
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center justify-between  p-5'>
                            <h3 className='text-lg sm:text-base text-gray-600'>编辑机房信息</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className='border border-gray-200' />
                        <form className='p-5 flex flex-col gap-4' onSubmit={handleSubmit}>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-xl sm:text-sm text-gray-500'>机房名称：</label>
                                    <input 
                                        className={`outline-none p-2 border ${redBorder.name ? 'border-red-200' : 'border-gray-200'} rounded-md`}
                                        name='name'
                                        value={updataIdc?.name ?? ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-xl sm:text-sm text-gray-500'>所在地区：</label>
                                    <input 
                                        className={`outline-none p-2 border ${redBorder.location ? 'border-red-200' : 'border-gray-200'} rounded-md`}
                                        name='location'
                                        value={updataIdc?.location ?? ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-xl sm:text-sm text-gray-500'>机房地址：</label>
                                    <input 
                                        className='outline-none p-2 border border-gray-200 rounded-md'
                                        name='address'
                                        value={updataIdc?.address ?? ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-xl sm:text-sm text-gray-500'>机房联系电话：</label>
                                    <input 
                                        className='outline-none p-2 border border-gray-200 rounded-md'
                                        name='contact'
                                        value={updataIdc?.contact ?? ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className='my-4 flex items-center justify-end gap-4'>
                                <button className='p-2 px-4 border border-gray-200 rounded-md' onClick={onClose}>取消</button>
                                <button className='bg-[#165DFF] p-2 px-4 text-white rounded-md'>更新</button>
                            </div>
                        </form>
                    </div>
                    
                </div>
            </div>,
            document.body
        )
    )
}