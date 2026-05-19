'use client';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ServerResData } from '@/types/Server';

interface ServerDeleteComponentProps {
    show: boolean;
    onClose: () => void;
    server: ServerResData | null;
    onDelete: (id: number) => void
}

export default function ServerDeleteComponent({ show, onClose, server, onDelete }: ServerDeleteComponentProps) {

    if (!show || !server) return null;
    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='bg-white rounded-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]' onClick={e => e.preventDefault()}>
                    <div className='flex flex-col'>
                        <div className='p-5 flex items-center justify-between'>
                            <h3 className='text-lg text-gray-700'>确认删除</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className='border border-gray-200' />
                        <div className='p-5'>
                            <p className='text-base text-gray-600'>确定要删除服务器信息吗？</p>
                        </div>
                        <div className='p-5 bg-gray-100 flex flex-col gap-2'>
                            <div className='flex gap-2'>
                                <span className='text-sm font-bold'>序列号(标识):</span>
                                <span className='text-sm text-gray-600'>{server.serialNumber}</span>
                            </div>
                            <div className='flex gap-2'>
                                <span className='text-sm font-bold'>主机名:</span>
                                <span className='text-sm text-gray-600'>{server.hostname}</span>
                            </div>
                            <div className='flex gap-2'>
                                <span className='text-sm font-bold'>IPv4地址:</span>
                                <span className='text-sm text-gray-600'>{server.privateIp}(内)</span>
                                {server.publicIp ? <span className='text-sm text-gray-600'>{server.publicIp}(公)</span> : ''}
                            </div>
                        </div>
                        <div className='p-5 my-5 flex items-center justify-end gap-5'>
                            <button className='p-2 px-4 border border-gray-200 rounded-md hover:bg-gray-100' onClick={onClose}>取消</button>
                            <button className='p-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-500' onClick={() => onDelete(server.id || 0)}>确认删除</button>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}