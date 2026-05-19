'use client';
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ServerResData } from '@/types/Server';

interface ServerDetailComponentProps {
    show: boolean
    onClose: () => void
    server: ServerResData | null
    idcs: {id: number, name: string}[] | null
    cabinets: {id: number, name: string, idcId: number}[] | null
    deleteCallback: (show: boolean, server: ServerResData | null) => void
    edit: (show: boolean, server: ServerResData | null) => void
}

type ServerType = 'server' | 'kvm';
const ServerType_LABEL:Record<ServerType, string> = {
    'server': '物理机',
    'kvm': '虚拟机'
}

export default function ServerDetailComponent({ show, onClose, server, idcs, cabinets, deleteCallback, edit }: ServerDetailComponentProps) {

    

    if (!show) return;
    if (!server) return null;
    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='bg-white rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]' onClick={e => e.stopPropagation()}>
                    <div className='flex flex-col'>
                        <div className='p-5 flex items-center justify-between'>
                            <h3 className='text-lg text-gray-700'>服务器详情</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className='border border-gray-200 mb-10' />
                        <div className='bg-gray-200'>
                            <div className='p-5 px-8 grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>服务器类型:</p>
                                    <span className='text-sm text-gray-500'>{ServerType_LABEL[server.type as ServerType]}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>序列号(标识):</p>
                                    <span className='text-sm text-gray-500'>{server.serialNumber}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>主机名:</p>
                                    <span className='text-sm text-gray-500'>{server.hostname}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>IPv4地址:</p>
                                    <span className='text-sm text-gray-500'>{server.privateIp} (内)</span>
                                    {server.publicIp ? <span className='text-sm text-gray-500'>{server.publicIp}(公)</span> : ''}
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>系统:</p>
                                    <span className='text-sm text-gray-500'>{server.os}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>所在机房:</p>
                                    <span className='text-sm text-gray-500'>{idcs?.find(idc => idc.id === server.idcId)?.name ?? '-'}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>所在机柜:</p>
                                    <span className='text-sm text-gray-500'>{cabinets?.find(cabinet => cabinet.id === server.cabinetId)?.name ?? '-'}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>服务器品牌:</p>
                                    <span className='text-sm text-gray-500'>{server.type === 'server' ? server.vendor : '-'}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>CPU Model:</p>
                                    <span className='text-sm text-gray-500'>{server.cpuModel}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>CPU(s):</p>
                                    <span className='text-sm text-gray-500'>{server.cpuCores}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>内存:</p>
                                    <span className='text-sm text-gray-500'>{server.memoryGB}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>硬盘:</p>
                                    <span className='text-sm text-gray-500'>{server.diskTotal}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>内核版本:</p>
                                    <span className='text-sm text-gray-500'>{server.kernelVersion}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-gray-600 font-bold'>mac地址:</p>
                                    <span className='text-sm text-gray-500'>{server.macAddress}</span>
                                </div>
                            </div>
                        </div>
                        <div className='p-5 my-4 flex items-center justify-end gap-4'>
                            <button className='p-2 px-5 border border-gray-200 rounded-md hover:bg-gray-100' onClick={onClose}>关闭</button>
                            <button className='p-2 px-5 bg-blue-600 rounded-md text-white hover:bg-blue-500' onClick={() => edit(true, server)}>编辑</button>
                            <button className='p-2 px-5 bg-red-600 rounded-md text-white hover:bg-red-500' onClick={() => deleteCallback(true, server)}>删除</button>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}