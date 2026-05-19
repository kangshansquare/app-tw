'use client';

import Modal from "@/components/Modal/Modal";
import { CloudAccountResFields } from "@/types/cloud-provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

interface AccountDeleteComponentProps {
    show: boolean;
    onClose: () => void
    account: CloudAccountResFields | null
    deleteCallback: (id: number) => void
    providers: {id: number, name: string, provider: string}[] | null
}

type ENVIRONMENT = "test" | "prod" | "pre" | "dev"
const ENVIRONMENT_LABEL: Record<ENVIRONMENT, string> = {
    test: "测试环境",
    dev: "开发环境",
    pre: "预发环境",
    prod: "生产环境"
}

export default function AccountDeleteComponent({ show, onClose, account, deleteCallback, providers }: AccountDeleteComponentProps) {

    if (!show || !account) return null;
    return (
        <Modal show={show} onClose={onClose} title="删除云账号">
            <div className='p-5 flex flex-col gap-3'>
                <div className='flex gap-2 items-baseline'>
                    <FontAwesomeIcon icon={faTriangleExclamation} className='text-red-600' />
                    <div className='flex items-baseline flex-col gap-1'>
                        <h3 className='text-lg text-gray-700'>确认删除</h3>
                        <span className='text-xs text-gray-400'>此操作不可撤销，删除后将无法恢复。请确认是否继续。</span>
                    </div>
                </div>
                        
                <div className='p-3 bg-gray-200 flex flex-col gap-2 rounded-lg'>
                    <p className='text-xs font-bold'>账号名称: <span className=' text-gray-600'>{account.name}</span></p>
                    <p className='text-xs font-bold'>云平台名称: <span className=' text-gray-600'>{providers?.find(p => p.id === account.providerId)?.name}</span></p>
                    <p className='text-xs font-bold'>环境: <span className=' text-gray-600'>{ENVIRONMENT_LABEL[account.environment as ENVIRONMENT]}</span></p>
                    <p className='text-xs font-bold'>AccessKey ID: <span className=' text-gray-600'>{account.access_key_id}</span></p>
                </div>
            </div>

            <div className='p-5 flex items-center justify-end gap-5'>
                <button className='border border-gray-200 p-2 px-4 rounded-md hover:bg-gray-100' onClick={onClose}>取消</button>
                <button className='p-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-500' onClick={() => deleteCallback(account?.id || 0)}>确认删除</button>
            </div>
        </Modal>
    )
}