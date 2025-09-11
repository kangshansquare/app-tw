'use client';

import ReactDOM from 'react-dom';

import type { OpenVPNRecordType } from '@/types/record';
import { CloseOutlined, WarningOutlined } from '@ant-design/icons';

interface DeleteRecordProps {
    show: boolean,
    onClose: () => void
    record: OpenVPNRecordType | null;
    onNotify: (type: "success" | "error" | "info", message: string) => void
    fetchRecords: () => void
}

type RuleType = "apply_account" | "open_rule" | "account_and_rule" | "delete_rule" | "close_account"
const RuleType_LABEL: Record<RuleType, string> = {
    apply_account: "申请账号",
    open_rule: "开通规则",
    account_and_rule: "申请账号+开通规则",
    delete_rule: "删除规则",
    close_account: "注销账号"
}


export default function DeleteRecord({ show, onClose, record, onNotify, fetchRecords }: DeleteRecordProps) {

    const handleDelete = async () => {
        if (record?.id === null) return;

        const id = record?.id;

        try {
            const res = await fetch(`/api/record/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();

            if (data?.success) {
                if (fetchRecords) fetchRecords();

                onNotify("success", "删除成功")
                onClose()

            } else {
                onNotify("error", "创建失败")
            }
        } catch (error) {
            onNotify("error", "网络失败")
        }

    }

    if (!show) return;

    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='bg-white rounded-lg w-full max-w-xl' onClick={e => e.stopPropagation()}>
                    <div className='flex justify-between p-5'>
                        <h3 className='font-medium text-xl text-gray-600'>确认删除</h3>
                        <CloseOutlined className='text-sm text-gray-400 hover:text-gray-600'  onClick={onClose}/>
                    </div>
                    <div className='border border-gray-100' />
                    <div className='flex gap-3 justify-start p-5'>
                        <div className=''>
                            <WarningOutlined className='text-yellow-500' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='font-medium text-lg text-gray-700'>确定要删除这条记录吗？</span>
                            <span className='font-light text-xs text-gray-500'>此操作不可撤销，删除后将无法恢复。请确认是否继续。</span>
                        </div>
                    </div>

                    <div className='px-5 mb-5'>
                        <div className='bg-gray-100 p-3 rounded-lg'>
                            <div className='flex flex-col gap-1'>
                                <span className='font-semibold text-sm text-gray-700'>申请人: <strong className='text-xs text-gray-500'>{record?.name}</strong></span>
                                <span className='font-semibold text-sm text-gray-700'>部门: <strong className='text-xs text-gray-500'>{record?.sector}</strong></span>
                                <span className='font-semibold text-sm text-gray-700'>申请类型: <strong className='text-xs text-gray-500'>{RuleType_LABEL[record?.type as RuleType]}</strong></span>
                                <span className='font-semibold text-sm text-gray-700'>申请日期: <strong className='text-xs text-gray-500'>{record ? new Date(record.apply_date).toISOString().split('T')[0] : ""}</strong></span>
                                <span className='font-semibold text-sm text-gray-700'>目的IP-端口: <strong className='text-xs text-gray-500'>{record?.dest_ip}</strong></span>
                                <span className='font-semibold text-sm text-gray-700'>账号/IP: <strong className='text-xs text-gray-500'>{record?.account_ip}</strong></span>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end gap-4 m-5'>
                        <button className='border border-gray-200 rounded-lg p-2 px-3' onClick={onClose}>取消</button>
                        <button className='outline-none text-white rounded-lg bg-red-600 p-2 px-3' onClick={handleDelete}>确认删除</button>
                    </div>

                </div>
                
                
            </div>,
            document.body
        )
    )
}