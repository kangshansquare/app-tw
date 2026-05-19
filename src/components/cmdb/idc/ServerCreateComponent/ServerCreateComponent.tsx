'use client';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleInfo, faEye, faEyeSlash, faGear, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { ServerResData, SSHConnectionInfo } from '@/types/Server';

interface ServerCreateComponentProps {
    show: boolean;
    onClose: () => void
    idcs: {id: number, name: string}[] | null
    cabinets: {id: number, name: string}[] | null
    onChange: (created: ServerResData) => void
    initalServer: ServerResData | null
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    action: boolean
    actionCallback: (actionFlag: boolean) => void
    sshInfo: SSHConnectionInfo
    onSshInfoChange: (sshInfo: SSHConnectionInfo) => void
}

export default function ServerCreateComponent({ 
    show, 
    onClose, 
    idcs, 
    cabinets, 
    onChange, 
    initalServer, 
    onSubmit, 
    action, 
    actionCallback,
    sshInfo,
    onSshInfoChange
}: ServerCreateComponentProps) {
    // const [ actionFlag, setActionFlag ] = useState<boolean>(true)
    const server: ServerResData = initalServer ?? {
        type: "",
        hostname: "",
        os: "",
        kernelVersion: "",
        cpuModel: "",
        cpuCores: "",
        memoryGB: "",
        diskTotal: "",
        privateIp: "",
        publicIp: "",
        macAddress: "",
        serialNumber: "",
        vendor: "",
        idcId: 0,
        cabinetId: 0,
        kvms: 0
    }

    const [showPass, setShowPass ] = useState<boolean>(false)
    const [ showOptions, setShowOptions ] = useState<boolean>(false)

    if (!show) return null;
    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='bg-white rounded-xl w-full max-w-4xl overflow-y-auto max-h-[90vh]' onClick={e => e.stopPropagation()}>
                    <div className='flex flex-col'>
                        <div className='p-5 flex items-center justify-between'>
                            <h3 className='text-lg font-bold'>创建服务器</h3>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className='border-b border-gray-200 mb-5' />
                        <div className='px-5 flex items-center justify-start gap-5 border-b border-gray-200'>
                            {/* <button className={`px-5 pb-2 ${actionFlag ? "border-b border-blue-600 text-blue-600" : ""}`} onClick={() => setActionFlag(true)}>自动添加</button>
                            <button className={`px-5 pb-2 ${actionFlag ? "" : "border-b border-blue-600 text-blue-600"}`} onClick={() => setActionFlag(false)}>手动添加</button> */}
                            <button className={`px-5 pb-2 ${action ? "border-b border-blue-600 text-blue-600" : ""}`} onClick={() => actionCallback(true)}>自动添加</button>
                            <button className={`px-5 pb-2 ${action ? "" : "border-b border-blue-600 text-blue-600"}`} onClick={() => actionCallback(false)}>手动添加</button>
                        </div>
                        <form className='p-5' onSubmit={onSubmit}>
                            {
                                action ? (
                                    <div className='flex flex-col gap-5'>
                                        <div className='p-2 flex flex-col border border-blue-300 rounded-md bg-blue-50'>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex gap-2 items-center'>
                                                    <FontAwesomeIcon icon={faCircleInfo} className='text-sm text-blue-700' />
                                                    <span className='text-sm text-blue-700'>自动添加说明</span>
                                                </div>
                                                <p className='px-6 text-sm'>输入服务器IP后，系统将自动探测服务器硬件配置、操作系统信息等，无需手动填写。探测时间约3-5秒，请确保服务器网络可达。</p>
                                            </div>
                                        </div>
                                        <div className=''>
                                            <div className='flex flex-col gap-5'>
                                                <div className='flex flex-col gap-2'>
                                                    <label className='text-sm text-gray-700'>服务器IP<span className='text-red-600'>*</span></label>
                                                    <input 
                                                        name='ip'
                                                        className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm'
                                                        placeholder='例如: 192.168.1.100'
                                                        value={sshInfo.ip ?? ''}
                                                        onChange={(e) => onSshInfoChange({...sshInfo, ip: e.target.value})}
                                                    />
                                                </div>
                                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                                    <div className='flex flex-col gap-2'>
                                                        <label className='text-sm text-gray-700'>认证方式<span className='text-red-600'>*</span></label>
                                                        <select 
                                                            name='authType'
                                                            className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm'
                                                            value={sshInfo.authType}
                                                            onChange={e => onSshInfoChange({...sshInfo, authType: e.target.value as 'password' | 'secret_key'})}
                                                            
                                                        >
                                                            <option value='password'>密码认证</option>
                                                            <option value='secret_key'>密钥认证</option>
                                                        </select>
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <label className='text-sm text-gray-700'>登录账号<span className='text-red-600'>*</span></label>
                                                        <input 
                                                            name='username'
                                                            className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm'
                                                            placeholder='例如: root'
                                                            value={sshInfo.username ?? ''}
                                                            onChange={e => onSshInfoChange({ ...sshInfo, username: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col gap-2 relative'>
                                                    <label className='text-sm text-gray-700'>密码/密钥<span className='text-red-600'>*</span></label>
                                                    <input
                                                        type={showPass ? "" : "password"} 
                                                        name='passwordOrKey'
                                                        className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm'
                                                        placeholder='请输入登录密码或SSH密钥'
                                                        value={sshInfo.passwordOrKey ?? ''}
                                                        onChange={e => onSshInfoChange({ ...sshInfo, passwordOrKey: e.target.value })}
                                                    />
                                                    <p className='absolute top-1/2 right-2 hover:cursor-pointer' onClick={() => setShowPass(!showPass)}>
                                                        {
                                                            showPass ? (
                                                                <FontAwesomeIcon icon={faEye} className='text-gray-500' />
                                                            ) : (
                                                                <FontAwesomeIcon icon={faEyeSlash} />
                                                            )
                                                        }
                                                    </p>
                                                </div>
                                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                                    <div className='flex flex-col gap-2'>
                                                        <label className='text-sm text-gray-700'>所属机房<span className='text-red-600'>*</span></label>
                                                        <select 
                                                            name='idcId'
                                                            className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm'
                                                            value={sshInfo.idcId || 0}
                                                            onChange={e => onSshInfoChange({...sshInfo, idcId: Number(e.target.value) || 0})}
                                                            
                                                        >   
                                                            <option value="0">请选择机房</option>
                                                            {
                                                                idcs?.map(idc => (
                                                                    <option key={idc.id} value={idc.id}>{idc.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <label className='text-sm text-gray-700'>所属机柜<span className='text-red-600'>*</span></label>
                                                        <select 
                                                            name='cabinetId'
                                                            className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm'
                                                            value={sshInfo.cabinetId || 0}
                                                            onChange={e => onSshInfoChange({...sshInfo, cabinetId: Number(e.target.value) || 0})}
                                                            
                                                        >   
                                                            <option value="0">请选择机柜</option>
                                                            {
                                                                cabinets?.map(cabinet => (
                                                                    <option key={cabinet.id} value={cabinet.id}>{cabinet.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col gap-3'>
                                                    <div className='flex gap-1 items-center text-blue-600 text-sm hover:cursor-pointer' onClick={() => setShowOptions(!showOptions)}>
                                                        <FontAwesomeIcon icon={faGear} />
                                                        <span>高级选项</span>
                                                        {
                                                            showOptions ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />
                                                        }
                                                    </div>
                                                    {
                                                        showOptions ? (
                                                            <div className='p-3 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-5 rounded-lg'>
                                                                <div className='flex flex-col gap-2'>
                                                                    <label className='text-sm text-gray-700'>SSH端口</label>
                                                                    <input 
                                                                        name='sshPort'
                                                                        className='outline-none p-2 px-4 border border-gray-200 rounded-md'
                                                                        value={sshInfo.sshPort || 22}
                                                                        onChange={e => onSshInfoChange({ ...sshInfo, sshPort: Number(e.target.value) })}
                                                                    />
                                                                </div>
                                                                <div className='flex flex-col gap-2'>
                                                                    <label className='text-sm text-gray-700'>超时时间</label>
                                                                    <select 
                                                                        className='outline-none p-2 px-4 border border-gray-200 rounded-md'
                                                                        name='timeout'
                                                                        value={sshInfo.timeout || 5}
                                                                        onChange={e => onSshInfoChange({ ...sshInfo, timeout: Number(e.target.value) })}
                                                                    >
                                                                        <option value="3">3秒</option>
                                                                        <option value="5">5秒</option>
                                                                        <option value="10">10秒</option>
                                                                        <option value="15">15秒</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        ) : ''
                                                    }
                                                </div>
                                                <div className='flex gap-2 text-sm text-gray-500'>
                                                    <span className='text-red-500'>*</span>
                                                    <span>表示必填项，自动探测需要服务器开放SSH端口（默认22）并提供正确的登录凭证</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>服务器序列号(标识)<span className='text-red-600'>*</span></label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                placeholder='服务器S/N号或uuid等唯一标识'
                                                name='serialNumber'
                                                value={server.serialNumber ?? ''}
                                                onChange={e => onChange({...server, serialNumber: e.target.value})}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>IPV4(内)<span className='text-red-600'>*</span></label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm'
                                                placeholder='例如: 192.168.1.100'
                                                name='privateIp'
                                                value={server.privateIp ?? ''}
                                                onChange={e => onChange({ ...server, privateIp: e.target.value })}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>IPV4(公)</label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm'
                                                placeholder='若绑定了公网IP, 请填写'
                                                name='privateIp'
                                                value={server.publicIp ?? ''}
                                                onChange={e => onChange({ ...server, publicIp: e.target.value })}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>主机名<span className='text-red-600'>*</span></label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                placeholder='例如: web-01'
                                                name='hostname'
                                                value={server.hostname ?? ''}
                                                onChange={e => onChange({ ...server, hostname: e.target.value })}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>服务器类型<span className='text-red-600'>*</span></label>
                                            <select 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                name='type'
                                                value={server.type ?? ''}
                                                onChange={e => onChange({ ...server, type: e.target.value })}
                                            >
                                                <option value="">请选择服务器类型</option>
                                                <option value="server">物理机</option>
                                                <option value="kvm">虚拟机</option>
                                            </select>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>所属机房<span className='text-red-600'>*</span></label>
                                            <select 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100'
                                                name='idcId'
                                                value={server.idcId || 0}    
                                                onChange={e => {
                                                    const idcId = Number(e.target.value) || 0;
                                                    onChange({ ...server, idcId  })
                                                }}
                                            >
                                                <option value="">请选择机房</option>
                                                {
                                                    idcs && idcs.map((idc) => (
                                                        <option value={idc.id} key={idc.id}>{idc.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>所属机柜<span className='text-red-600'>*</span></label>
                                            <select 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100'
                                                name='cabinetId'
                                                value={server.cabinetId || 0}
                                                onChange={e => {
                                                    const cabinetId = Number(e.target.value) || 0;
                                                    onChange({...server, cabinetId})
                                                }}
                                            >
                                                <option value="">请选择机柜</option>
                                                {
                                                    cabinets && cabinets.map((cabinet) => (
                                                        <option value={cabinet.id} key={cabinet.id}>{cabinet.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>服务器品牌/型号</label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                placeholder='例如: Dell PowerEdge R760'
                                                name='vendor'
                                                value={server.vendor ?? ''}
                                                onChange={e => onChange({...server, vendor: e.target.value})}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>操作系统<span className='text-red-600'>*</span></label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                placeholder='例如: CentOS 7.9'
                                                name='os'
                                                value={server.os ?? ''}
                                                onChange={e => onChange({...server, os: e.target.value})}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>CPU Model<span className='text-red-600'>*</span></label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                placeholder='例如: Intel(R) Xeon(R) CPU E5-2620 v2 @ 2.10GHz'
                                                name='cpuModel'
                                                value={server.cpuModel ?? ''}
                                                onChange={e => onChange({...server, cpuModel: e.target.value})}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>CPU核心数<span className='text-red-600'>*</span></label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                placeholder='例如: 4'
                                                name='cpuCores'
                                                value={server.cpuCores ?? ''}
                                                onChange={e => onChange({...server, cpuCores: e.target.value})}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>内存<span className='text-red-600'>*</span></label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                placeholder='例如: 64G'
                                                name='memoryGB'
                                                value={server.memoryGB ?? ''}
                                                onChange={e => onChange({...server, memoryGB: e.target.value})}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>硬盘信息<span className='text-red-600'>*</span></label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                placeholder='例如: /dev/sda: 322.1 GB, 多盘以逗号分割'
                                                name='diskTotal'
                                                value={server.diskTotal ?? ''}
                                                onChange={e => onChange({...server, diskTotal: e.target.value})}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>内核信息<span className='text-red-600'>*</span></label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                placeholder='例如: 2.6.32-431.el6.x86_64'
                                                name='kernelVersion'
                                                value={server.kernelVersion ?? ''}
                                                onChange={e => onChange({...server, kernelVersion: e.target.value})}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>Mac地址<span className='text-red-600'>*</span></label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                placeholder='例如: 多块网卡Mac地址以逗号分割'
                                                name='macAddress'
                                                value={server.macAddress ?? ''}
                                                onChange={e => onChange({...server, macAddress: e.target.value})}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-sm text-gray-700'>虚拟机数量<span className='text-red-600'>*</span></label>
                                            <input 
                                                className='outline-none p-2 px-4 border border-gray-200 rounded-md bg-gray-100 placeholder:text-sm' 
                                                placeholder='例如: 运行的虚拟机数量, 默认0'
                                                name='kvms'
                                                value={server.kvms || 0}
                                                onChange={e => onChange({...server, kvms: Number(e.target.value) || 0})}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                            <div className='mt-5 py-2 flex items-center justify-end gap-5'>
                                <button className='border border-gray-200 rounded-md p-2 px-4 hover: bg-gray-100' onClick={onClose}>取消</button>
                                <button className='p-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-500'>提交</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}