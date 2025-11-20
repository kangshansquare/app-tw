'use client';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { IdcResData } from '@/types/SystemManage';



interface IdcDeletePortalProps {
    show: boolean;
    onClose: () => void;
    idc: IdcResData | null;
    onNotiy: (type: 'success' | 'error' | 'info', message: string) => void;
    onFetch: () => void;
}


export default function IdcDeletePortal({ show, onClose, idc, onNotiy, onFetch }: IdcDeletePortalProps) {

    const handleDelete = async () => {
        if (!idc?.id) return;
        const id = Number(idc?.id)
        try {
            const res = await fetch(`/api/system-manage/idc-manage/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            if (data?.success) {
                onFetch();
                onClose();
                onNotiy("success", "删除成功")
            } else {
                onNotiy('error',data.message || "删除机房信息失败!")
            }

        } catch(error) {
            onNotiy("error", "网络异常~")
        }

    }

    if (!show) return;
    if (!idc) return null;
    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='bg-white rounded-lg w-full max-w-2xl overflow-y-auto max-h-[60vh]' onClick={(e) => e.stopPropagation()}>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center justify-between  p-5'>
                            <h3 className='text-lg sm:text-base text-gray-600'>确认删除</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className='border border-gray-100' />
                        <div className='flex flex-col gap-2 p-5'>
                            <h3 className='text-lg sm:text-base text-gray-500'>确认要删除机房信息吗？</h3>
                            <p className='text-sm text-red-500'>删除机房会级联删除其下所有机柜信息，请谨慎操作！</p>
                        </div>
                        <div className='bg-gray-100 p- rounded-md flex flex-col gap-2 p-5'>
                            <p className='text-sm font-bold'>机房名称: <span className='text-sm text-gray-500'>{idc.name}</span></p>
                            <p className='text-sm font-bold'>所在地区: <span className='text-sm text-gray-500'>{idc.location}</span></p>
                            <p className='text-sm font-bold'>地址: <span className='text-sm text-gray-500'>{idc.address}</span></p>
                            <p className='text-sm font-bold'>机房联系电话: <span className='text-sm text-gray-500'>{idc.contact}</span></p>
                        </div>
                    </div>
                    <div className='p-5 my-4 flex items-center justify-end gap-4'>
                        <button className='p-2 px-4 border border-gray-200 rounded-md' onClick={onClose}>取消</button>
                        <button className='p-2 px-4 bg-[#F53F3F] rounded-md text-white' onClick={handleDelete}>确认删除</button>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}