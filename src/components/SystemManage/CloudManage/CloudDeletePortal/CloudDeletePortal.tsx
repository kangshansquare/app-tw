'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { CloudProviderResFields } from '@/types/cloud-provider';
import Modal from '@/components/Modal/Modal';

interface CloudDeletePortalProps {
    show: boolean;
    onDelete: (id: number) => void
    provider: CloudProviderResFields | null
    onClose: () => void
}

export default function CloudDeletePortal({ show, onDelete, provider, onClose }: CloudDeletePortalProps) {

    if(!provider) return null
    return (
        <Modal show={show} onClose={onClose} title='删除云平台配置'>
            <div className='p-5 flex flex-col gap-3'>
                <div className='flex gap-2 items-baseline'>
                    <FontAwesomeIcon icon={faTriangleExclamation} className='text-red-600' />
                    <div className='flex items-baseline flex-col gap-1'>
                        <h3 className='text-lg text-gray-700'>确认删除</h3>
                        <span className='text-xs text-gray-400'>此操作不可撤销，删除后将无法恢复。请确认是否继续。</span>
                    </div>
                </div>
                        
                <div className='p-3 bg-gray-200 flex flex-col gap-2 rounded-lg'>
                    <p className='text-xs font-bold'>云平台类型: <span className=' text-gray-600'>{provider.provider}</span></p>
                    <p className='text-xs font-bold'>云平台名称: <span className=' text-gray-600'>{provider.name}</span></p>
                </div>
            </div>

            <div className='p-5 flex items-center justify-end gap-5'>
                <button className='border border-gray-200 p-2 px-4 rounded-md hover:bg-gray-100' onClick={onClose}>取消</button>
                <button className='p-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-500' onClick={() => onDelete(provider?.id || 0)}>确认删除</button>
            </div>
        </Modal>
    )
}