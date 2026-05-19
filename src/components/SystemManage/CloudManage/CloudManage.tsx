'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Notification from '@/components/Notification/Notification';
import { useEffect, useState } from 'react';
import CloudCreatePortal from './CloudCreatePortal/CloudCreatePortal';
import {  CloudProviderBaseFields, CloudProviderResFields, CloudAccountBaseFields, CloudAccountResFields } from '@/types/cloud-provider';
import { CloudAccountSchema, CloudProviderSchema, extractCustomErrorMessage } from '@/lib/schemas/Schema';
import ProvidersComponent from './CloudCreatePortal/Providers/ProvidersComponent';
import CloudDeletePortal from './CloudDeletePortal/CloudDeletePortal';
import CloudEditPortal from './CloudEditPortal/CloudEditPortal';
import AccountComponent from './Account/AccountComponent';
import AccountCreateComponent from './Account/AccountCreate/AccountCreateComponent';
import AccountEditComponent from './Account/AccountEdit/AccountEditComponent';
import AccountDeleteComponent from './Account/AccountDelete/AccountDeleteComponent';


const initalProvider: CloudProviderBaseFields = {
    provider: '',
    name: ''
}

const initalAccount: CloudAccountBaseFields = {
    providerId: 0,
    name: '',
    environment: '',
    access_key_id: '',
    secret_access_key: '',
    createAt: new Date()
}

export default function CloudManageComponent() {
    const [ notifition, setNotification ] = useState<{
        show: boolean,
        type?: "success" | "error" | "info",
        message?: string
    }>({show: false})
    const onNotify = (type: "success" | "error" | "info", message: string) => {
        setNotification({ show: true, type, message })
    }

    const [ showCreate, setShowCreate ] = useState<{show: boolean, provider: CloudProviderBaseFields }>({show: false, provider: initalProvider});
    const handleCloseCreateProvider = () => {
        setShowCreate({ show: false, provider: {...initalProvider} })
    }
    const handleCreateProviderChange = (provider: CloudProviderBaseFields) => {
        setShowCreate(prev => ({...prev, provider}))
    }
    const handleCreateProviderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const parsed = CloudProviderSchema.safeParse(showCreate.provider)
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            onNotify('error', String(error[0]) || '数据格式错误')
            return
        }

        try {
            const res = await fetch('/api/cloud/provider', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed.data)
            })

            const data = await res.json();
            if (data.success) {
                fetchProvider(1, 5)
                fetchProviderName()
                setShowCreate({show: false, provider: {...initalProvider}})  // 提交成功后重置默认provider
                onNotify('success', String(data.message) || '创建成功')
            } else {
                onNotify('error', String(data.message) || '创建失败')
            }

        } catch(error) {
            onNotify('error',  '网络错误')
        }
    }

    const [ showDelete, setShowDelete ] = useState<{ show: boolean, provider: CloudProviderResFields | null }>({ show: false, provider: null })
    const onDeleteProviderCallback = (provider: CloudProviderResFields) => {
        setShowDelete({ show: true, provider })
    }
    const handleDeleteProvider = async (id: number) => {
        if (id === 0) {
            onNotify('error', '无法获取Provider数据')
            return
        }
        try {
            const res = await fetch(`/api/cloud/provider/${id}`,{
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            if (data.success) {
                fetchProvider(1, 5)
                fetchProviderName()
                setShowDelete(prev => ({ ...prev, show: false }))
                onNotify('success', String(data.message) || '删除成功')
            } else {
                onNotify('error', String(data.message) || '删除失败')
            }

        } catch(error) {
            onNotify('error', '网络异常')
        }
    }

    const [ showEdit, setShowEdit ] = useState<{ show: boolean, provider: CloudProviderResFields | null }>({show: false, provider: null})
    const onEditCallback = (provider: CloudProviderResFields) => {
        setShowEdit({ show: true, provider })
    }
    const onEditChange = (provider: CloudProviderResFields) => {
        setShowEdit(prev => ({...prev, provider}))

    }
    const handleEditProviderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(showEdit.provider)
        const parsed = CloudProviderSchema.safeParse(showEdit.provider)
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            onNotify('error', String(error[0]) || '数据格式错误')
            return;
        }

        try {
            const res = await fetch(`/api/cloud/provider/${showEdit.provider?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed.data)
            })
            const data = await res.json()
            if (data.success) {
                fetchProvider(1, 5)
                fetchProviderName()
                setShowEdit(prev => ({ ...prev, show: false }))
                onNotify('success', String(data.message) || '数据更新成功')
            } else {
                onNotify('error', String(data.message) || '数据更新失败')
            }

        } catch(error) {
            onNotify('error', '网络异常')
        } 
    }

    const [ providerIsLoading, setProviderIsLoading ] = useState<boolean>(false)
    const [ providersInfo, setProvidersInfo ] = useState<{
        pagination: {totalCount: number, totalPage: number, page: number}, 
        providers: CloudProviderResFields[] | null
    }>({
        pagination: {totalCount: 0, totalPage: 0, page: 1},
        providers: null    
    })
    const fetchProvider = async (page = 1, pageSize = 5) => {
        setProviderIsLoading(true)
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize)
        })
        
        try {
            const res = await fetch(`/api/cloud/provider?${params.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
    
            const data = await res.json()
            if(data.success) {
                setProviderIsLoading(false)
                setProvidersInfo({pagination: data.pagination, providers: data.providers})
            } else {
                onNotify('error',   String(data.message) || 'Provider获取失败')
            }

        } catch(error) {
            onNotify('error', '网络错误')
        } finally {
            setProviderIsLoading(false)
        }
    }
    const onProviderPageChange = (page: number) => {
        fetchProvider(page, 5)
    }


    const [ accountIsLoading, setAccountIsLoading ] = useState<boolean>(false)
    const [ accountInfo, setAccountInfo ] = useState<{
        pagination: { totalCount: number, totalPage: number, page: number },
        accounts: CloudAccountBaseFields[] | null
    }>({
        pagination: { totalCount: 0, totalPage: 0, page: 1 },
        accounts: null
    })
    const onAccountPageChange = (page:number) => {
        fetchAccount(page, 5)
    }
    const fetchAccount = async (page = 1, pageSize = 5) => {
        setAccountIsLoading(true)
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize)
        })
        try {
            const res = await fetch(`/api/cloud/account?${params}`, {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json()
            if (data.success) {
                setAccountIsLoading(false)
                setAccountInfo({ pagination: data.pagination, accounts: data.accounts })
            } else {
                onNotify("error", String(data.message) || "云账号获取失败")
            }
        } catch (error) {
            onNotify("error", "网络异常")
        }
    }
    const [ showCreateAccount, setShowCreateAccount ] = useState<{show: boolean, account: CloudAccountBaseFields}>({
        show: false,
        account: initalAccount
    })
    const handleCloseCreateAccount = () => {
        setShowCreateAccount({ show: false, account: {  ...initalAccount } })
    }
    const handleCreateAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value }  = e.target
        console.log(name, value)
        setShowCreateAccount(prev => ({
            ...prev,
            account: {
                ...prev.account,
                [name]: name === 'providerId' ? Number(value) : value
            }
        }))
    }
    const handleCreateAccountSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(showCreateAccount.account)
        const parsed = CloudAccountSchema.safeParse(showCreateAccount.account)
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            onNotify('error', String(error[0]) || "数据格式错误")
            return;
        }
        try {
            const res = await fetch('/api/cloud/account', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data)
            })
            const data = await res.json()
            if (data.success) {
                fetchAccount(1, 5)
                setShowCreateAccount({ show: false, account: {...initalAccount} })
                onNotify("success", String(data.message) || "创建成功")
            } else {
                onNotify("error", String(data.message) || "创建失败")
            }
        } catch(error) {
            onNotify("error", "网络异常")
        }
    }
    const [ showEditAccount, setShowEditAccount ] = useState<{ show: boolean, account: CloudAccountResFields | null }>({
        show: false,
        account: null
    })
    const handleEditAccount = (account: CloudAccountResFields) => {
        setShowEditAccount({show: true, account})
    }
    const handleEditAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value }  = e.target
        setShowEditAccount(prev => {
            if (!prev.account) {
                return prev
            }

            return {
                ...prev,
                account: {
                    ...prev.account,
                    [name]: name === 'providerId' ? Number(value) : value
                }
            }
        })
    }
    const handleEditAccountSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!showEditAccount.account) return;

        const updataData = showEditAccount.account?.secret_access_key.trim() === "" ?
            { ...showEditAccount.account, secret_access_key: "******" } :
            showEditAccount.account

        const parsed = CloudAccountSchema.safeParse(updataData) 
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            onNotify('error', String(error[0]) || '数据格式错误')
            return;
        }
        try {
            const res = await fetch(`/api/cloud/account/${updataData?.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updataData)
            })
            const data = await res.json()
            if (data.success) {
                fetchAccount(1, 5)
                setShowEditAccount(prev => ({  ...prev, show: false }))
                onNotify("success", String(data.message) || "更新成功")
            } else {
                onNotify("error", String(data.message) || "更新失败")
            }
        } catch(error) {
            onNotify("error", "网络错误")
        }
    }

    const [ showDeleteAccount, setShowDeleteAccount ] = useState<{ show: boolean, account: CloudAccountResFields | null }>({
        show: false,
        account: null
    })
    const handleDeleteAccount = (account: CloudAccountResFields) => {
        setShowDeleteAccount({ show: true, account })
    }
    const handleDeleteAccountCallback = async (id: number) => {
        if (Number(id) === 0) {
            onNotify('error', '云账号id为空')
            return
        }
        try {
            const res = await fetch(`/api/cloud/account/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json()
            if (data.success) {
                fetchAccount(1, 5)
                setShowDeleteAccount(prev => ({...prev, show: false}))
                onNotify('success', String(data.message) || "删除成功")
            } else {
                onNotify('error', String(data.message) || "删除失败")
            }
        } catch(error) {
            onNotify('error', '网络错误')
        }
    }

    const [ providerName, setProviderName ] = useState<{ id: number, provider: string, name: string }[] | null>(null)
    const fetchProviderName = async () => {
        try {
            const res = await fetch('/api/cloud/provider?fields=id,provider,name', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json()
            if (data.success) {
                console.log(data)
                setProviderName(data.providerName)
            } else {
                onNotify('error', String(data.message) || 'Provider信息获取失败')
            }
        } catch (error) {
            onNotify('error', '网络错误')
        }
    }
    
    useEffect(() => {
        fetchProvider(1, 5)
        fetchAccount(1, 5)
        fetchProviderName()
    }, [])
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold">云平台配置管理</h3>
                    <p className="text-sm text-gray-500">添加和管理多个云平台配置管理</p>
                </div>
                
            </div>
            <div className="p-4 flex flex-col gap-4 border border-gray-200 bg-white rounded-lg hover:shadow-md">
                <div className='flex items-center justify-between'>
                    <h3 className="text-base font-bold">配置云平台</h3>
                    <button 
                        className="p-2 px-4 rounded-md flex items-center text-blue-700 text-sm font-medium hover:text-blue-600" 
                        onClick={() => setShowCreate({show: true, provider: {...initalProvider}})} 
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        添加云平台
                    </button>
                </div>
                {
                    providerIsLoading ? (
                        <div className='flex-1 flex items-center justify-center h-[600px]'>
                            <div className='flex flex-col items-center gap-4'>
                                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                                <span className='text-gray-500'>加载中....</span>
                            </div>
                        </div>
                    ) : providersInfo.providers && providersInfo.providers.length > 0 ? (
                        <ProvidersComponent 
                            providersInfo={providersInfo.providers}
                            pagination={providersInfo.pagination}
                            onChangePage={onProviderPageChange}
                            isLoading={providerIsLoading}
                            deleteCallback={onDeleteProviderCallback}
                            editCallback={onEditCallback}
                        />
                    ) : (
                        <div className='flex items-center justify-center mt-5'>
                            <span className='font-light text-gray-500'>暂无记录</span>
                        </div>
                    )
                    
                }
            </div>


            <div className="p-4 flex flex-col gap-4 border border-gray-200 bg-white rounded-lg hover:shadow-md">
                <div className='flex items-center justify-between'>
                    <h3 className="text-base font-bold">云平台账号</h3>
                    <button 
                        className="p-2 px-4 rounded-md flex items-center text-blue-700 text-sm font-medium  hover:text-blue-600" 
                        onClick={() => setShowCreateAccount({show: true, account: { ...initalAccount }})} 
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        添加云平台账号
                    </button>
                </div>
                {
                    accountIsLoading ? (
                        <div className='flex-1 flex items-center justify-center h-[600px]'>
                            <div className='flex flex-col items-center gap-4'>
                                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                                <span className='text-gray-500'>加载中....</span>
                            </div>
                        </div>
                    ) : accountInfo.accounts && accountInfo.accounts.length > 0 ? (
                        <AccountComponent  
                            pagination={accountInfo.pagination}
                            onChangePage={onAccountPageChange}
                            isLoading={accountIsLoading}
                            accounts={accountInfo.accounts}
                            providers={providerName}
                            onEdit={handleEditAccount}
                            deleteCallback={handleDeleteAccount}
                        />
                    ) : (
                        <div className='flex items-center justify-center mt-5'>
                            <span className='font-light text-gray-500'>暂无记录</span>
                        </div>
                    )
                }
            </div>



            {
                showCreate.show &&
                <CloudCreatePortal 
                    show={showCreate.show}
                    onClose={() => handleCloseCreateProvider()}
                    onChange={handleCreateProviderChange}
                    initalProvider={showCreate.provider}
                    onSubmit={handleCreateProviderSubmit}
                    
                />
            }
            {
                showDelete.show &&
                <CloudDeletePortal 
                    show={showDelete.show}
                    onDelete={handleDeleteProvider}
                    provider={showDelete.provider}
                    onClose={() => setShowDelete(prev => ({...prev, show: false}))}
                />
            }
            {
                showEdit.show &&
                <CloudEditPortal 
                    show={showEdit.show}
                    onClose={() => setShowEdit(prev => ({ ...prev, show: false }))}
                    provider={showEdit.provider}
                    onChange={onEditChange}
                    onSubmit={handleEditProviderSubmit}
                />
            }

            {
                showCreateAccount.show &&
                <AccountCreateComponent 
                    show={showCreateAccount.show}
                    onClose={() =>handleCloseCreateAccount()}
                    onChange={handleCreateAccountChange}
                    account={showCreateAccount.account}
                    providers={providerName}
                    onSubmit={handleCreateAccountSubmit}
                />
            }
            {
                showEditAccount.show &&
                <AccountEditComponent 
                    show={showEditAccount.show}
                    onClose={() => setShowEditAccount(prev => ({...prev, show:false}))}
                    account={showEditAccount.account}
                    providers={providerName}
                    onChange={handleEditAccountChange}
                    onSubmit={handleEditAccountSubmit}
                />
            }
            {
                showDeleteAccount.show &&
                <AccountDeleteComponent 
                    show={showDeleteAccount.show}
                    onClose={() => setShowDeleteAccount(prev => ({...prev, show: false}))}
                    account={showDeleteAccount.account}
                    deleteCallback={handleDeleteAccountCallback}
                    providers={providerName}
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