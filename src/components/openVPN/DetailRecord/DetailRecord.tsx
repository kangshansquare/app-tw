'use client';

import ReactDOM from 'react-dom'
import { CloseOutlined } from '@ant-design/icons'

import type { OpenVPNRecordType } from '@/types/record';

interface DetailRecordProps {
    show: boolean;
    onClose: () => void;
    record: OpenVPNRecordType | null;
}

type RuleType = "apply_account" | "open_rule" | "account_and_rule" | "delete_rule" | "close_account"
const RuleType_LABEL: Record<RuleType, string> = {
    apply_account: "申请账号",
    open_rule: "开通规则",
    account_and_rule: "申请账号+开通规则",
    delete_rule: "删除规则",
    close_account: "注销账号"
}


export default function DetailRecord({ show, onClose, record }: DetailRecordProps) {

    if (!show) return;

    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='max-w-4xl bg-white rounded-lg w-full' onClick={e => e.stopPropagation()}>
                    <div className='flex justify-between p-5'>
                        <h3 className='font-semibold text-gray-600'>记录详情</h3>
                        <CloseOutlined className='text-sm text-gray-400 hover:text-gray-500'  onClick={onClose}/>
                    </div>
                    <div className='border border-gray-200 mb-5' />
                    <div className="px-6 mb-5">
                        <div className='grid sm:grid-cols-1 lg:grid-cols-2 bg-gray-100 p-4 gap-3'>
                            <div className='flex flex-col gap-1'>
                                <span className='font-light text-gray-600 text-sm'>申请人</span>
                                <span>{record?.name}</span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='font-light text-gray-600 text-sm'>部门</span>
                                <span>{record?.sector}</span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='font-light text-gray-600 text-sm'>申请日期</span>
                                <span>{record ? new Date(record.apply_date).toISOString().split('T')[0] : ""}</span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='font-light text-gray-600 text-sm'>申请时长</span>
                                <span>{record?.apply_duration}</span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='font-light text-gray-600 text-sm'>目的IP-端口</span>
                                <span>{record?.dest_ip}</span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='font-light text-gray-600 text-sm'>申请类型</span>
                                <span>{RuleType_LABEL[record?.type as RuleType]}</span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='font-light text-gray-600 text-sm'>状态</span>
                                <span>{record?.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className='px-6 flex flex-col gap-1'>
                        <span className='font-light text-gray-600 text-sm'>账号/IP</span>
                        <div className='flex flex-col gap-2 bg-gray-100 p-4'>
                            {record?.account_ip.split(';').map((r, index) => (<span key={r + index}>{r}</span>))}
                        </div>
                    </div>
                    <div className='p-6 flex flex-col gap-1 mb-5'>
                        <span className='font-light text-gray-600 text-sm'>备注</span>
                        <span className='bg-gray-100 p-4'>{record?.description ? record?.description : "无"}</span>
                    </div>

                    <div className='bg-gray-100 flex justify-end p-6 rounded-b-lg'>
                        <button className='outline-none bg-blue-600 text-white p-2 rounded-lg px-5' onClick={onClose}>关闭</button>
                    </div>
                </div>
                
            </div>,
            document.body
        )
    )
}