'use client';
import Modal from "@/components/Modal/Modal";
import { CloudAccountResFields } from "@/types/cloud-provider";
import InputComponent from "@/components/PublicComponents/InputComponent";

interface AccountEditComponentProps {
    show: boolean;
    onClose: () => void;
    account: CloudAccountResFields | null
    providers: {id: number, name: string, provider:string}[] | null;
    onChange: (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function AccountEditComponent({ show, onClose, account,providers,onChange,onSubmit }: AccountEditComponentProps) {

    if (!show || !account) return null;
    return (
        <Modal show={show} onClose={onClose} title="编辑云账号">
            <form className="p-5" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className='text-sm text-gray-600'>云平台名称<span className='text-red-600'>*</span></label>
                        <select 
                            className='outline-none p-2 border border-gray-200 rounded-md text-sm'
                            name="providerId"
                            value={String(account.providerId ?? 0)}
                            onChange={onChange}
                        >
                            <option value="0">请选择云平台名称</option>
                            {
                                providers?.map(p => (
                                    <option key={p.id} value={String(p.id)}>
                                        {p.name} ({p.provider})
                                    </option>
                                )) 
                            }
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='text-sm text-gray-600'>云账号名称<span className='text-red-600'>*</span></label>
                        <InputComponent 
                            name="name"
                            value={account.name ?? ""}
                            placeholder=""
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='text-sm text-gray-600'>环境<span className='text-red-600'>*</span></label>
                        <select 
                            className='outline-none p-2 border border-gray-200 rounded-md text-sm'
                            name="environment"
                            value={account.environment ?? ''}
                            onChange={onChange}
                        >
                            <option value="">请选择环境</option>
                            <option value="test">测试环境</option>
                            <option value="dev">开发环境</option>
                            <option value="pre">预发环境</option>
                            <option value="prod">生产环境</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='text-sm text-gray-600'>AccessKey ID<span className='text-red-600'>*</span></label>
                        <InputComponent 
                            name="access_key_id"
                            value={account.access_key_id ?? ""}
                            placeholder=""
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='text-sm text-gray-600'>Secret Key<span className='text-red-600'>*</span></label>
                        <input 
                            className="p-2 outline-none border border-gray-200 rounded-md placeholder:text-sm placeholder:text-gray-500"
                            name="secret_access_key"
                            // value={account.secret_access_key ?? ""}
                            placeholder="更新则输入新Secret Key，否则留空"
                            onChange={onChange}
                        />
                    </div>
                </div>
                <div className='flex items-center justify-end gap-5 mt-8'>
                    <button className='p-2 px-4 border border-gray-200 hover:bg-gray-100 rounded-md' onClick={onClose}>取消</button>
                    <button className='p-2 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white'>更新</button>
                </div>
            </form>
        </Modal>
    )
}