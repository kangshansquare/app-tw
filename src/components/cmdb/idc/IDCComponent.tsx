'use client';

import ServerItems from "./ServerItems/ServerItems";
import { useEffect, useState } from "react";
import { ServerResData, SSHConnectionInfo } from "@/types/Server";
import Notification from "@/components/Notification/Notification";
import ServerDetailComponent from "./ServerDetailComponent/ServerDetailComponent";
import ServerEditConponent from "./ServerEditComponent/ServerEditComponent";
import { getChangedFields } from "@/utils/getChangedFields";
import { ServerSchema, extractCustomErrorMessage, SSHConnectionInfoSchema } from "@/lib/schemas/Schema";
import ServerDeleteComponent from "./ServerDeleteComponent/ServerDeleteComponent";
import ServerCreateComponent from "./ServerCreateComponent/ServerCreateComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

const initalServer: ServerResData = {
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

const defaultSSH: SSHConnectionInfo = {
    ip: '',
    authType: 'password',
    username: '',
    passwordOrKey: '',
    sshPort: 22,
    timeout: 5,
    idcId: 0,
    cabinetId: 0
}

export default function IDC() {
    const [ servers, setServers ] = useState<ServerResData[] | null>(null);
    const [ totalCount, setTotalCount ] = useState<number>(0);
    const [ pagination, setPagination ] = useState<{ page: number, pageSize: number, totalPage: number }>({
        page: 1,
        pageSize: 7,
        totalPage: 0
    })
    const [ query, setQuery ] = useState<string>("")
    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value)

    }
    const handleSearch = () => {
        if (query.trim() === '') return
        fetchData(1, 7, query)
    }

    const clearSearch = () => {
        setQuery("")
        fetchData(1, 7, '')
    }

    const [ filters, setFilters ] = useState<{ idcId: string, type: string }>({ idcId: "", type: "" })

    const [ isLoading, setIsLoading ] = useState<boolean>(false)

    const [ notifition, setNotification ] = useState<{
        show: boolean,
        type?: "success" | "error" | "info",
        message?: string
    }>({show: false})
    const onNotify = (type: "success" | "error" | "info", message: string) => {
        setNotification({ show: true, type, message })
    }

    const [ showDetail, setShowDetail ] = useState<{ show: boolean, server: ServerResData | null }>({ show: false, server: null })
    const handleDetail = (show: boolean, server: ServerResData | null) => {
        setShowDetail({ show, server })
    }

    const [ originalServer, setOriginalServer ] = useState<ServerResData | null>(null)   
    const [ showEdit, setShowEdit ] = useState<{ show: boolean, server: ServerResData | null }>({ show: false, server: null })
    const handleEdit = (show: boolean, server: ServerResData | null) => {
        setShowEdit({ show, server })
        setOriginalServer(server)   // 保存原始服务器数据
        setShowDetail({ show: false, server })
    }

    const [ showDelete, setShowDelete ] = useState<{ show: boolean, server: ServerResData | null}>({ show: false, server: null })
    const handleDelete = (show: boolean, server: ServerResData | null) => {
        setShowDelete({ show, server })
        setShowDetail({ show: false, server })
    }

    const handleDeleteCallback = async (id: number) => {
        if (id === 0) {
            onNotify('error', '无法获取服务器信息')
            return
        }
        try {
            const res = await fetch(`/api/cmdb/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            if (data?.success) {
                fetchData(1, 7, '')
                setShowDelete(prev => ({ ...prev, show: false }))
                onNotify('success', String(data.message) || '删除成功')
            } else {
                onNotify('error', String(data.message) || '删除失败')
            }
        } catch(error) {
            onNotify('error', '网络异常')
        }
    }

    const fetchData = async (page = 1, pageSize = 7, q = "", extraFilters = filters) => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
            });
            if (q.trim()) params.set("q", q.trim());
            if (extraFilters.idcId) params.set("idcId", extraFilters.idcId);
            if (extraFilters.type) params.set("type", extraFilters.type)

            const res = await fetch(`/api/cmdb?${params.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            if(data?.success) {
                setIsLoading(false);
                setServers(data.servers);
                setTotalCount(data.totalCount)
                setPagination(data.pagination)
                
            }
        } catch(error) {
            onNotify('error', '网络异常')
        }

    }

    const [ idcs, setIdcs ] = useState<{ id: number, name: string }[] | null>(null)
    const fetchIdcs = async () => {
        try {
            const res = await fetch(`/api/system-manage/idc-manage?fields=id,name`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            if (data?.success) {
                const { idcs } = data;
                setIdcs(idcs)
            } else {
                console.log(data.message || '获取机房信息失败')
            }
        } catch (error) {
            console.log('GET idc: 网络错误')
        }
    }
    const [ cabinets, setCabinets ] = useState<{ id: number, name: string, idcId: number }[] | null>(null)
    const fetchCabinets = async() => {
        try {
            const res = await fetch(`/api/system-manage/cabinet-manage?fields=id,name`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            if (data?.success) {
                const { cabinets } = data;
                setCabinets(cabinets)
            } else {
                onNotify('error',String(data.message) || '获取机柜信息失败')
            }
        } catch(error) {
            onNotify('error','GET cabinet: 网络错误')
        }
    }

    const handleEditChange =(updatedServer: ServerResData) => {
        // 判断idcId是否为0
        if (updatedServer.idcId === 0) {
            onNotify("error", '请选择机房')
            return
        }
        if (updatedServer.cabinetId === 0) {
            onNotify("error", '请选择机柜')
            return
        }
        

        setShowEdit(prev => ({
            show: prev.show,
            server: updatedServer
        }))
    }
    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!showEdit.server || !originalServer) {
            onNotify('error', '服务器信息不存在')
            return;
        }

        const parsed = ServerSchema.safeParse(showEdit.server)
        if(!parsed.success) {
            const errors = extractCustomErrorMessage(parsed.error)
            onNotify('error', errors[0] || "数据格式错误")
            return
        }

        // 获取有变化的字段
        const changedFields = getChangedFields(originalServer, showEdit.server)
        if (Object.keys(changedFields).length === 0) {
            onNotify('info', '没有需要更新的字段')
            return;
        }
        
        try {
            const res = await fetch(`/api/cmdb/${Number(showEdit.server.id)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(changedFields)
            })
            const data = await res.json();
            if (data?.success) {
                fetchData(1, 7, "")
                setShowEdit(prev => ({ ...prev, show: false }))
                onNotify('success',  '数据更新成功')
            } else {
                onNotify('error',  '更新失败')
            }
        } catch(error) {
            onNotify('error', '网络异常')
        }


    }

    // const [ showCreate, setShowCreate ] = useState<{show: boolean, server: ServerResData}>({show: false, server: initalServer})
    const [ showCreate, setShowCreate ] = useState<{show: boolean, server: ServerResData}>({show: false, server: initalServer})
    const [ actionFlag, setActionFlag ] = useState<boolean>(true)
    const [ sshInfo, setSshInfo ] = useState<SSHConnectionInfo>({
        ip: '',
        authType: 'password',
        username: '',
        passwordOrKey: '',
        sshPort: 22,
        timeout: 5,
        idcId: 0,
        cabinetId: 0
    })
    const cabIdc = actionFlag ? sshInfo.idcId : showCreate.server.idcId
    const filteredCabinets = cabinets && cabIdc ? cabinets.filter(cabinet => cabinet.idcId === cabIdc) : cabinets
    const handleCloseCreate = () => {
        setShowCreate({ show: false, server: initalServer })
        setSshInfo(defaultSSH)
        setActionFlag(true)
    }
    const handleCreateChangeCallback = (created: ServerResData) => {
        setShowCreate(prev => ({ ...prev, server: created }))
    }
    const handleActionFlag = (flag: boolean) => {
        setActionFlag(flag)
    }
    const updateSSHInfo = (sshInfo: SSHConnectionInfo) => {
        setSshInfo(prev => ({ ...prev, ...sshInfo }))
    }

    const handleCreateSubmitCallback = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (actionFlag) {
            if (!sshInfo.ip || !sshInfo.username || !sshInfo.passwordOrKey) {
                onNotify('error', '请填写SSH信息');
                return
            }
            try {
                const parsed = SSHConnectionInfoSchema.safeParse(sshInfo)
                if (!parsed.success) {
                    const errors = extractCustomErrorMessage(parsed.error)
                    onNotify('error', errors[0] || "数据格式错误")
                    return
                }
                const res = await fetch('/api/cmdb/auto_create', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(parsed)
                })
                const data = await res.json()
                if (data.success) {
                    onNotify('success', String(data.message) || '自动添加成功')
                } else {
                    onNotify('error', String(data.message) || '自动添加失败')
                }
            } catch (error) {   
                onNotify('error', '网络错误')
            }

        } else {
            console.log('手动添加，验证输入：服务器信息等')
            const parsed = ServerSchema.safeParse(showCreate.server);
            if(!parsed.success) {
                const errors = extractCustomErrorMessage(parsed.error)
                onNotify('error', errors[0] || "数据格式错误")
                return
            }

            try {
                const res = await fetch('/api/cmdb', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(parsed)
                })
                const data = await res.json();
                if (data.success) {
                    fetchData(1, 7, "") 
                    handleCloseCreate()
                    onNotify('success', data.message || '创建成功')
                } else {
                    onNotify('error', data.message || '创建失败')
                }
            } catch(error) {
                onNotify('error', '网络错误')
            }

        }

 
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))
        fetchData(1, 7, query, { ...filters, [name]: value })
    }

    useEffect(() => {
        fetchIdcs()  
        fetchCabinets()
        fetchData(1, 7, "") 
    },[])

    return (
        <div className="p-8 flex flex-col gap-6 bg-gray-50 w-full h-full">
            <div className="flex justify-between items-center">
                <h3 className="font-black text-2xl">IDC管理</h3>
                <div className="flex gap-4">
                    <div className="relative">
                        <input 
                            className="outline-none border border-gray-300 p-2 pl-12 rounded-md sm:w-64 placeholder:text-sm focus:border-blue-500 focus:shadow-md"
                            placeholder="搜索服务器"
                            value={query}
                            onChange={handleSearchInput}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                        />
                        <button className="absolute left-3 top-1/2 -translate-y-1/2" onClick={handleSearch}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                        {
                            query.trim() && 
                            <button className="absolute top-1/2 -translate-y-1/2 right-2" onClick={clearSearch}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        }
                    </div>
                    <button 
                        type="button" 
                        className='bg-blue-600 text-white flex gap-1 items-center justify-center p-2 rounded-md hover:bg-blue-500'
                        onClick={() => setShowCreate(prev => ({ ...prev, show: true }))}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        添加服务器
                    </button>
                </div>
            </div>
            {/* <Cards /> */}
            

            <div className="p-5 flex flex-col border border-gray-300 rounded-md shadow-md bg-white">
                <div className="py-2 flex items-center gap-5">
                    <select 
                            className="outline-none p-2 px-4 border border-gray-200 rounded-md focus:border-blue-500" 
                            onChange={handleSelectChange}
                            name="idcId"
                        >
                            <option value="">所有机房</option>
                            {
                                idcs ? idcs.map((idc) => (
                                    <option key={idc.id} value={idc.id}>{idc.name}</option>
                                )): (
                                    <option>无</option>
                                )
                            }
                        </select>
                        <select 
                            className="outline-none p-2 px-4 border border-gray-200 rounded-md focus:border-blue-500"
                            name="type"
                            onChange={handleSelectChange}
                        >
                            <option value="">所有服务器</option>
                            <option value="server">物理机</option>
                            <option value="kvm">虚拟机</option>
                        </select>
                </div>
            </div>

            {
                isLoading ? (
                    <div className='flex-1 flex items-center justify-center h-[600px]'>
                        <div className='flex flex-col items-center gap-4'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                            <span className='text-gray-500'>加载中....</span>
                        </div>
                    </div>
                ) : servers && servers.length > 0 ? (
                    <ServerItems 
                        pagination={pagination} 
                        servers={servers} 
                        totalCount={totalCount} 
                        isLoading={isLoading} 
                        fetchData={fetchData} 
                        query={query} 
                        idcs={idcs}
                        detail={handleDetail}
                        edit={handleEdit}
                        deleteCallback={handleDelete}
                    />
                ) : (
                    <div className='flex items-center justify-center mt-5'>
                        <span className='font-light text-gray-500'>暂无记录</span>
                    </div>
                )
            }

            {
                showDetail.show &&
                <ServerDetailComponent 
                    show={showDetail.show}
                    onClose={() => setShowDetail(prev => ({ ...prev, show: false}))}
                    server={showDetail.server}
                    idcs={idcs}
                    cabinets={cabinets}
                    deleteCallback={handleDelete}
                    edit={handleEdit}
                />
            }

            {
                showEdit.show &&
                <ServerEditConponent 
                    show={showEdit.show}
                    onClose={() => setShowEdit(prev => ({ ...prev, show: false }))}
                    server={showEdit.server}
                    onFetch={fetchData}
                    idcs={idcs}
                    cabinets={cabinets ? cabinets.filter(cabinet => cabinet.idcId === showEdit.server?.idcId) : null}
                    onChange={handleEditChange}
                    onSubmit={handleEditSubmit}
                />
            }

            {
                showDelete.show &&
                <ServerDeleteComponent 
                    show={showDelete.show}
                    onClose={() => setShowDelete(prev => ({ ...prev, show: false }))}
                    server={showDelete.server}
                    onDelete={handleDeleteCallback}
                />
            }

            {
                showCreate.show &&
                <ServerCreateComponent 
                    show={showCreate.show}
                    onClose={()=> handleCloseCreate()}
                    idcs={idcs}
                    // cabinets={ cabinets && showCreate.server ? cabinets.filter(cabinet => cabinet.idcId === showCreate.server.idcId) : null }
                    cabinets={filteredCabinets}
                    onChange={handleCreateChangeCallback}
                    initalServer={showCreate.server}
                    onSubmit={handleCreateSubmitCallback}
                    action={actionFlag}
                    actionCallback={handleActionFlag}
                    sshInfo={sshInfo}
                    onSshInfoChange={updateSSHInfo}
                />
            }

            {
                notifition.show && 
                <Notification 
                    show={notifition.show}
                    type={notifition.type}
                    message={notifition.message}
                    closeNotification={() => setNotification({...notifition, show: false})}
                />
            }
        </div>
    )
}