'use client';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ServiceLineResField } from '@/types/SystemManage';
import { ServiceLineSchema } from '@/lib/schemas/Schema';
import { getChangedFields } from '@/utils/getChangedFields';

interface ServiceLineEditPortalProps {
    show: boolean;
    onClose: () => void
    onFetch: () => void
    onNotify:(type: 'success' | 'info' | 'error', message: string) => void
    editData: ServiceLineResField | null
    originData: ServiceLineResField | null
    onEditChange: (data: ServiceLineResField) => void
}

export default function ServiceLineEditPortal({ show, onClose, onFetch, onNotify, editData, originData, onEditChange }: ServiceLineEditPortalProps) {


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editData) return;
        const { name, value } = e.target;
        onEditChange({ ...editData, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editData || !originData) return;

        const result = ServiceLineSchema.safeParse(editData);
        
        if (!result.success) {
            const msg = JSON.parse(result.error.message)[0].message || '表单验证失败';
            onNotify('error', msg)
            return;
        }

        const changedFields = getChangedFields(originData, editData);
        if (Object.keys(changedFields).length === 0) {
            onNotify('info', '没有任何更改')
            return;
        }

        try {
            const res = await fetch(`/api/system-manage/service-line/${editData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(changedFields)
            });
            const data = await res.json();
            const { message } = data;
            if (data.success) {
                onNotify('success', message)
                onFetch()
                onClose()
            } else {
                onNotify('error', message || '更新失败')
            }
        } catch (error) {
            onNotify('error', '网络异常')
        }


    }

    if (!show) return;
    if (!editData) return null;
    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='max-w-2xl bg-white rounded-lg w-full' onClick={(e) => e.stopPropagation()}>
                    <div className='flex flex-col'>
                        <div className='p-5 flex items-center justify-between'>
                            <h3>编辑业务线</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark}/>
                            </button>
                        </div>
                        <div className='border border-gray-100'/>
                        <form className='p-5' onSubmit={handleSubmit}>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-600'>业务线名称<span className='text-red-600'>*</span></label>
                                    <input 
                                        className='outline-none border border-gray-200 p-2 rounded-md'
                                        name='name'
                                        value={editData.name ?? ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-600'>负责人</label>
                                    <input 
                                        className='outline-none border border-gray-200 p-2 rounded-md'
                                        name='owner'
                                        value={editData.owner ?? ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-600'>联系邮箱</label>
                                    <input 
                                        className='outline-none border border-gray-200 p-2 rounded-md'
                                        name='email'
                                        value={editData.email ?? ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm text-gray-600'>状态</label>
                                    <select
                                        className='outline-none p-2 border border-gray-200 rounded-md'
                                        name='status'
                                        value={editData.status ?? ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">请选择业务线状态</option>
                                        <option value="active">在用</option>
                                        <option value="deactive">已弃用</option>
                                    </select>
                                </div>
                                
                            </div>

                            <div className='my-5 flex items-center justify-end gap-4'>
                                <button className='border border-gray-200 p-2 px-4 rounded-md hover:bg-gray-200' onClick={onClose}>取消</button>
                                <button className='bg-[#165DFF] p-2 px-4 rounded-md text-white'>更新</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}