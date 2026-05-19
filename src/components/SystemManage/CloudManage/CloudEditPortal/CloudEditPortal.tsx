'use client';
import { CloudProviderResFields } from '@/types/cloud-provider';
import Modal from '@/components/Modal/Modal';

interface CloudEditPortalProps {
    show: boolean;
    onClose: () => void;
    provider: CloudProviderResFields | null;
    onChange: (provider: CloudProviderResFields) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}



export default function CloudEditPortal({ show, onClose, provider, onChange, onSubmit }: CloudEditPortalProps) {
    
    if (!provider) return null;
    return (
        <Modal show={show} onClose={onClose} title='编辑云平台配置'>
            <form className='my-2' onSubmit={onSubmit}>
                <div className='p-5 grid grid-cols-1 gap-8'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm text-gray-700'>云平台名称<span className='text-red-600'>*</span></label>
                        <input 
                        className='outline-none p-2 border border-gray-200 rounded-md'
                        name='label'
                        value={provider.name ?? ''}
                        onChange={e => onChange({...provider, name: e.target.value})}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm text-gray-700'>云平台类型<span className='text-red-600'>*</span></label>
                        <select
                            className='outline-none p-2 border border-gray-200 rounded-md'
                            name='provider'
                            value={provider.provider ?? ''}
                            onChange={e => onChange({...provider, provider: e.target.value})}
                        >
                            <option value="">请选择云平台类型</option>
                            <option value="aliyun">阿里云</option>
                            <option value="tencent">腾讯云</option>
                            <option value="huawei">华为云</option>
                            <option value="aws">AWS</option>
                            <option value="azure">Azure</option>
                            <option value="google">Google Cloud</option>
                        </select>
                    </div>
                </div>
                <div className='p-5 flex items-center justify-end gap-5'>
                    <button className='p-2 px-4 border border-gray-200 rounded-md hover:bg-gray-100' onClick={onClose}>取消</button>
                    <button className='p-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500'>更新</button>
                </div>
            </form>
        </Modal>
    )
}