'use client';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ServiceLineResField } from '@/types/SystemManage';

interface ServiceLineDeletePortalProps {
    show: boolean;
    onClose: () => void
    onFetch: () => void
    onNotify:(type: 'success' | 'info' | 'error', message: string) => void
    deleteData: ServiceLineResField | null
}

export default function ServiceLineDeletePortal({ show, onClose, onFetch, onNotify, deleteData }: ServiceLineDeletePortalProps) {

    const handleDelete = async() => {
        if (!deleteData) {
            onNotify('error', '无法获取业务线ID!')
            return;
        }

        try {
            const res = await fetch(`/api/system-manage/service-line/${deleteData.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            if (data?.success) {
                onFetch();
                onNotify('success', data.message || '删除成功')
                onClose()
            } else {
                onNotify('error', data.message ||'删除失败')
            }
        } catch(error) {
            onNotify('error', '网络异常')
        }

    }

    if (!show) return;
    if (!deleteData) return null;
    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='max-w-2xl bg-white rounded-lg w-full' onClick={(e) => e.stopPropagation()}>
                    <div className='flex flex-col'>
                        <div className='p-5 flex items-center justify-between'>
                            <h3>确认删除</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark}/>
                            </button>
                        </div>
                        <div className='border border-gray-200' />
                        <div className='p-5 flex flex-col gap-2'>
                            <p className='text-gray-600'>确认要删除业务线 <span className='text-lg font-bold'>{deleteData.name}</span> 吗？</p>
                        </div>
                        <div className='p-5 flex items-center justify-end gap-4'>
                            <button className='border border-gray-200 p-2 px-4 rounded-md hover:bg-gray-200' onClick={onClose}>取消</button>
                            <button className='bg-[#F53F3F] p-2 px-4 rounded-md text-white' onClick={handleDelete}>确认删除</button>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}