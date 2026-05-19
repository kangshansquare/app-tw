'use client';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faAnglesUp, faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import { ServerResData } from '@/types/Server';
import { useState } from 'react';

interface ServerEditConponentProps {
    show: boolean
    onClose: () => void
    server: ServerResData | null
    onFetch: () => void
    idcs: {id: number, name: string}[] | null
    cabinets: {id: number, name: string, idcId: number}[] | null
    onChange: (updatedServer: ServerResData) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function ServerEditConponent({ show, onClose, server, idcs, cabinets, onChange, onSubmit }: ServerEditConponentProps) {

    const [ editMore, setEditMore ] = useState<boolean>(false)

    if (!show || !server) return null;
    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='bg-white rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]' onClick={e => e.stopPropagation()}>
                    <div className='flex flex-col'>
                        <div className='p-5 flex items-center justify-between'>
                            <h3 className='text-lg text-gray-700'>编辑服务器</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className='border border-gray-200' />
                        <form className='p-5' onSubmit={onSubmit}>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-bold'>服务器标识:</label>
                                    <input 
                                        className='outline-none p-2 border border-gray-200 rounded-md' 
                                        name='serialNumber'
                                        value={server.serialNumber ?? ''}
                                        onChange={(e) => onChange({ ...server, serialNumber: e.target.value })}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-bold'>所在机房:</label>
                                    <select 
                                        className='outline-none p-2 border border-gray-200 rounded-md' 
                                        name='idcId'
                                        value={server.idcId}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const nextId = value ? Number(value) : 0
                                            onChange({ ...server, idcId: nextId })
                                        }}
                                    >
                                        <option value="">请选择机房</option>
                                        {idcs?.map(idc=> (
                                            <option key={idc.id} value={idc.id}>{idc.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-bold'>所在机柜:</label>
                                    <select
                                        className='outline-none p-2 border border-gray-200 rounded-md'
                                        name='cabinetId'
                                        value={server.cabinetId}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const nextId = value ? Number(value) : 0
                                            onChange({ ...server, cabinetId: nextId })
                                        }}
                                    >
                                        <option value="">请选择机柜</option>
                                        {cabinets?.map(cabinet => (
                                            <option key={cabinet.id} value={cabinet.id}>{cabinet.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-bold'>服务器类型:</label>
                                    <select
                                        className='outline-none p-2 border border-gray-200 rounded-md'
                                        name='type'
                                        value={server.type}
                                        onChange={(e) => onChange({ ...server, type: e.target.value })}
                                    >
                                        <option value="server">物理机</option>
                                        <option value="kvm">虚拟机</option>   
                                    </select>
                                </div>
                            </div>
                            {
                                editMore &&
                                <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-bold'>服务器品牌:</label>
                                        <input  
                                            className='outline-none p-2 border border-gray-200 rounded-md'
                                            name='vendor'
                                            value={server.vendor ?? ''}
                                            onChange={(e) => onChange({ ...server, vendor: e.target.value })}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-bold'>主机名:</label>
                                        <input  
                                            className='outline-none p-2 border border-gray-200 rounded-md'
                                            name='hostname'
                                            value={server.hostname ?? ''}
                                            onChange={(e) => onChange({ ...server, hostname: e.target.value })}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-bold'>IPV4地址(内):</label>
                                        <input  
                                            className='outline-none p-2 border border-gray-200 rounded-md'
                                            name='privateIp'
                                            value={server.privateIp ?? ''}
                                            onChange={(e) => onChange({ ...server, privateIp: e.target.value })}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-bold'>IPV4地址(公):</label>
                                        <input  
                                            className='outline-none p-2 border border-gray-200 rounded-md'
                                            name='publicIp'
                                            value={server.publicIp ?? ''}
                                            onChange={(e) => onChange({ ...server, publicIp: e.target.value })}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-bold'>CPU Model:</label>
                                        <input  
                                            className='outline-none p-2 border border-gray-200 rounded-md'
                                            name='cpuModel'
                                            value={server.cpuModel ?? ''}
                                            onChange={(e) => onChange({ ...server, cpuModel: e.target.value })}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-bold'>CPU(s):</label>
                                        <input  
                                            className='outline-none p-2 border border-gray-200 rounded-md'
                                            name='cpuCores'
                                            value={server.cpuCores ?? ''}
                                            onChange={(e) => onChange({ ...server, cpuCores: e.target.value })}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-bold'>硬盘:</label>
                                        <input  
                                            className='outline-none p-2 border border-gray-200 rounded-md'
                                            name='diskTotal'
                                            value={server.diskTotal ?? ''}
                                            onChange={(e) => onChange({ ...server, diskTotal: e.target.value })}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-bold'>内存:</label>
                                        <input  
                                            className='outline-none p-2 border border-gray-200 rounded-md'
                                            name='memoryGB'
                                            value={server.memoryGB ?? ''}
                                            onChange={(e) => onChange({ ...server, memoryGB: e.target.value })}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-bold'>内核版本:</label>
                                        <input  
                                            className='outline-none p-2 border border-gray-200 rounded-md'
                                            name='kernelVersion'
                                            value={server.kernelVersion ?? ''}
                                            onChange={(e) => onChange({ ...server, kernelVersion: e.target.value })}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-bold'>Mac地址:</label>
                                        <input  
                                            className='outline-none p-2 border border-gray-200 rounded-md'
                                            name='macAddress'
                                            value={server.macAddress ?? ''}
                                            onChange={(e) => onChange({ ...server, macAddress: e.target.value })}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-bold'>虚拟机数量:</label>
                                        <input  
                                            className='outline-none p-2 border border-gray-200 rounded-md'
                                            name='kvms'
                                            value={server.kvms ?? 0}
                                            onChange={(e) => onChange({ ...server, kvms: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            }
                            <div className='mt-10 mb-5 flex items-center justify-end gap-5 relative'>
                                <div className='absolute left-1/2' onClick={() => setEditMore(prev => !prev)}>
                                    {   editMore ? 
                                        <FontAwesomeIcon icon={faAnglesUp} className='text-lg text-blue-600'/> : 
                                        <FontAwesomeIcon icon={faAnglesDown} className='text-lg text-blue-600'/>
                                    }
                                </div>
                                <div className='flex gap-5'>
                                    <button className='p-2 px-4 border border-gray-200 rounded-md' onClick={onClose}>取消</button>
                                    <button className='p-2 px-4 bg-blue-600 text-white rounded-md'>更新</button>
                                </div>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}