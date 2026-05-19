'use client';
import { CloudProviderBaseFields } from '@/types/cloud-provider';
import Modal from '@/components/Modal/Modal';

interface CloudCreatePortalPorps {
    show: boolean;
    onClose: () => void;
    onChange: (provider: CloudProviderBaseFields) => void;
    initalProvider: CloudProviderBaseFields | null
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    
}


export default function CloudCreatePortal({ show, onClose, onChange, initalProvider, onSubmit }: CloudCreatePortalPorps) {
    const provider: CloudProviderBaseFields = initalProvider ?? {
        provider: '',
        name: ''
    }

    return (
        <Modal show={show} onClose={onClose} title='添加云平台配置'>
            <form className='p-5' onSubmit={onSubmit}>
                <div className='grid grid-cols-1 gap-8'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm text-gray-600'>云平台类型<span className='text-red-600'>*</span></label>
                        <select 
                            className='outline-none p-2 border border-gray-200 rounded-md text-sm'
                            name='code'
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
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm text-gray-600'>云平台名称<span className='text-red-600'>*</span></label>
                        <input 
                            className='outline-none p-2 border border-gray-200 rounded-md placeholder:text-sm'
                            placeholder='请输入云平台名称'
                            name='label'
                            value={provider.name ?? ''}
                            onChange={e => onChange({...provider, name: e.target.value})}
                        />
                    </div>
                </div>
                <div className='flex items-center justify-end gap-5 mt-8'>
                    <button className='p-2 px-4 border border-gray-200 hover:bg-gray-100 rounded-md' onClick={onClose}>取消</button>
                    <button className='p-2 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white'>创建</button>
                </div>
            </form>
        </Modal>
    )
}
