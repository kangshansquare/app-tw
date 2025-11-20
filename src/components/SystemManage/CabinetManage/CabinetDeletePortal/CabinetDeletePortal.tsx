'use client';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CabinetResData } from '@/types/SystemManage';


interface CabinetDeletePortalProps {
    show: boolean
    onClose: () => void
    cabinet: CabinetResData | null;
    onFetch: () => void;
    onNotify: (type: 'success' | 'info' | 'error', message: string) => void
}




export default function CabinetDeletePortal({ show,onClose, cabinet, onFetch, onNotify }: CabinetDeletePortalProps) {
    
    const handleDelete = async () => {
        const id = cabinet?.id
        if (!id) {
            onNotify('error', '未找到机柜ID')
            return;
        }

        try {
            
            console.log(id)
            const res = await fetch(`/api/system-manage/cabinet-manage/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            const { message } = data
            if (data?.success) {
                onFetch()
                onClose()
                onNotify('success', message)
            } else {
                onNotify('error', message)
            }
        } catch(error) {
            onNotify('error', '网络异常')
        }

    }

    if (!show) return;
    if (!cabinet) return null;

    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className=' bg-white rounded-lg w-full max-w-2xl overflow-y-auto max-h-[60vh]' onClick={(e) => e.stopPropagation()}>
                    <div className='flex flex-col gap-2'>
                        <div className='p-5 flex items-center justify-between'>
                            <h3 className='text-lg text-gray-600'>确认删除</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className='border border-gray-200' />
                        <div className='p-5 flex flex-col gap-5'>
                            <div className=''>
                                <p className='text-base text-gray-600'>确认要删除机柜 <span className='text-lg font-bold'>{cabinet?.name}</span> 吗？</p>
                            </div>
                        </div>
                        <div className='p-5 flex items-center justify-end gap-5'>
                            <button className='border border-gray-200 p-2 px-4 rounded-md' onClick={onClose}>取消</button>
                            <button className='p-2 px-4 rounded-md bg-red-600 text-white' onClick={handleDelete}>确认</button>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}