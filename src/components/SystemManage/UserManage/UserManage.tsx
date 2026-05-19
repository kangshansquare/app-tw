'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis, faMagnifyingGlass, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/Pagination/Pagination";
import { useState, useEffect } from "react";
import { UserResField } from "@/types/SystemManage";
import Notification from "@/components/Notification/Notification";
import LoadingComponent from "@/components/PublicComponents/LoadingComponent";
import NoDataComponent from "@/components/PublicComponents/NoDataComponent";
import UserCreateComponent from "./UserCreate/UserCreateComponent";
import { UserSchema,extractCustomErrorMessage, UserEditSchema } from "@/lib/schemas/Schema";
import UserEditComponent from "./UserEdit/UserEditComponent";
import UserDeleteComponent from "./UserDelete/UserDeleteComponent";



export default function UserManageComponent() {
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ users, setUsers ] = useState<UserResField[] | null>(null)
    const [ pagination, setPagination ] = useState<{ 
        page: number, totalCount: number, totalPage: number 
    }>({
        page: 1,
        totalCount: 0,
        totalPage: 0
    })
    const [ notifition, setNotification ] = useState<{
        show: boolean,
        type?: "success" | "error" | "info",
        message?: string
    }>({show: false})
    const onNotiy = (type: 'success' | 'info' | 'error', message: string) => {
        setNotification({ show: true, type, message })
    }
    const onChangePage = (page: number) => {
        fetchUser(page, 5, query)
    }

    const [ query, setQuery ] = useState<string>("")
    const handleSearch = () => {
        if (query.trim() === "") return
        fetchUser(1, 5, query)
    }
    const clearSearch = () => {
        setQuery("")
        fetchUser(1, 5, "")
    }
    const fetchUser = async (page = 1, pageSize = 5, q = "") => {
        setIsLoading(true)
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize)
        })
        if (q.trim()) {
            params.set("q", q.trim())
        }
        try {
            const res = await fetch(`/api/system-manage/user-manage?${params.toString()}`, {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json()
            if (data.success) {
                const { users, pagination } = data
                setUsers(users)
                setPagination(pagination ?? { page: 1, totalCount: 0, totalPage: 0 })
            } else {
                onNotiy("error", "数据获取失败")
            }
        } catch (error) {
            onNotiy("error", "网络异常")
        } finally {
            setIsLoading(false)
        }

    }

    const [ showCreate, setshowCreate ] = useState<boolean>(false)
    type initalUser = {
        name: string;
        email: string;
        password: string;
    }
    const [ createUser, setCreateUser ] = useState<initalUser>({
        name: "",
        email: "",
        password: ""
    })
    const handleUserCreateChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget
        const key = name as keyof initalUser
        setCreateUser((prev) => ({ ...prev, [key]: value }))
    }
    const handleUserCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const parsed = UserSchema.safeParse(createUser)
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            onNotiy("error", String(error[0]) || "数据格式错误")
            return
        }
        try {
            const res = await fetch('/api/system-manage/user-manage', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data)
            })
            const data = await res.json()
            if (data.success) {
                fetchUser(1, 5)
                setshowCreate(false)
                onNotiy("success", String(data.message) || "创建成功")
            } else {
                onNotiy("error", String(data.message) || "创建失败")
            }
        } catch(error) {
            onNotiy("error", "网络异常")
        }
        
    }

    const [ showActionRow, setShowActionRow ] = useState<number | null>(null)
    const handleDisableUser = async (user: UserResField) => {
        try {
            const res = await fetch(`/api/system-manage/user-manage/${user.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !user.isActive })
            })
            const data = await res.json()
            if (data.success) {
                fetchUser(1, 5, query)
                onNotiy("success", String(data.message))
            } else {
                onNotiy("error", String(data.message) || "用户状态更新失败")
            }

        } catch(error) {
            onNotiy("error", "网络异常")
        }
    }

    const [ showEdit, setShowEdit ] = useState<{ show: boolean, user: UserResField | null}>({ show: false, user: null })
    const handleEditUserCallback = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget
        setShowEdit(prev => ({ ...prev, user: prev.user ? { ...prev.user, [name]: value } : null }))
        
    }
    const handleEditUserSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(showEdit.user)
        const parsed = UserEditSchema.safeParse(showEdit.user)
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            console.log(error)
            onNotiy("error", String(error[0]) || "数据格式错误");
            return
        }
        try {
            const res = await fetch(`/api/system-manage/user-manage/${showEdit.user?.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data)
            })
            const data = await res.json();
            if (data.success) {
                fetchUser(1,5, query)
                setShowEdit(prev => ({ ...prev, show: false }))
                onNotiy("success", String(data.message) || "更新成功")
            } else {
                onNotiy("error", String(data.message) || "更新失败")
            }
        } catch(error) {
            onNotiy("error", "网络异常")
        }
        
    }

    const [ showDelete, setShowDelete ] = useState<{ show: boolean, user: UserResField | null }>({ show: false, user: null })
    const handleDeleteUser = async (id: number) => {
        if (id == 0) {
            onNotiy('error', "无法获取用户ID");
            return;
        }
        try {
            const res = await fetch(`/api/system-manage/user-manage/${id}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json();
            if (data.success) {
                fetchUser(1, 5, query)
                setShowDelete(prev => ({ ...prev, show: false }))
                onNotiy("success", String(data.message) || "删除用户成功")
            } else {
                onNotiy('error', String(data.message) || "删除用户失败")
            }
        } catch(error) {
            onNotiy("error", "网络异常")
        }

    }

    useEffect(() => {
        fetchUser(1, 5)
    }, [])
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl sm:text-lg font-bold">用户管理</h1>
                <p className="text-base sm:text-sm text-gray-500">管理系统用户、用户组</p>
            </div>
            <div className="bg-white flex items-center justify-between p-5">
                <div className="flex gap-8 relative">
                    <select className="outline-none p-2 border border-gray-200 px-4 rounded-md">
                        <option value="">所有用户组</option>
                        <option value="admin">管理员组</option>
                    </select>
                    <input 
                        className="outline-none p-2 px-4 border border-gray-200 rounded-md placeholder:text-sm placeholder:text-gray-500 min-w-80" 
                        placeholder="搜索用户名" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                    />
                    <button 
                        className="flex gap-2 items-center absolute right-3 top-1/2 -translate-y-1/2" 
                        onClick={handleSearch}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#165DFF]" />
                    </button>
                    {
                        query &&
                        <button
                            type="button"
                            className='absolute right-10 top-1/2 -translate-y-1/2  rounded-full flex items-center justify-center' 
                            onClick={clearSearch}
                        >
                            <FontAwesomeIcon icon={faXmark} className="text-gray-600 text-sm" />
                        </button>
                    }
                </div>
                <button 
                    className="bg-[#00B42A] flex gap-2 items-center p-2 rounded-md text-white hover:-translate-y-1 duration-300"
                    onClick={() => setshowCreate(true)}
                >
                    <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                    添加用户
                </button>
            </div>
            {
                isLoading ? (
                    <LoadingComponent />
                ) : 
                users && users.length > 0 ? (
                    <>
                        <div className="bg-white rounded-lg shadow-md min-h-[500px] flex flex-col">
                            <div className='overflow-x-auto mb-2 border border-gray-200 overflow-hidden h-[430px] rounded-md'>
                                <table className='w-full divide-y divide-gray-50'>
                                    <thead className='bg-gray-50 border-b border-gray-200 sticky top-0 z-10'>
                                        <tr>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>用户名</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>邮箱</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>用户组</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>状态</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>创建时间</th>
                                            <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                        {users.map((user, index) => (
                                            <tr className='hover:bg-gray-50 transition-colors h-16' key={index}>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                    <div className='h-10 flex items-center'>{user.name}</div>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                    <div className='h-10 flex items-center'>{user.email}</div>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                                    <span className='p-1 px-2 line-flex items-center bg-[#165DFF]/10 rounded-md text-[#165DFF]'>管理员组</span>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                                    <span 
                                                        className={`p-1 px-2 line-flex ${user.isActive ? "bg-[#00B42A]/10 text-[#00B42A]" : "bg-red-100 text-red-500"} rounded-md`}>
                                                        {user.isActive ? "正常" : "禁用"}
                                                    </span>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                    <div className='h-10 flex items-center'>{user.create_time ? new Date(user.create_time).toISOString().replace("T", " ").replace(/\.\d+Z$/, "") : '---'}</div>
                                                </td>
                                                <td 
                                                    className='px-5 py-3 text-left text-xs font-medium tracking-wider relative'
                                                    onMouseEnter={() => setShowActionRow(Number(user.id))}
                                                    onMouseLeave={() => setShowActionRow(null)}
                                                >
                                                    <div className="flex items-center gap-2 hover:cursor-pointer">
                                                        <FontAwesomeIcon icon={faEllipsis} className="text-blue-600 text-sm"/>
                                                    </div>
                                                    {
                                                        showActionRow === user.id && (
                                                            <div className="absolute -translate-x-4 bg-white rounded-md shadow-md flex flex-col py-2 z-10">
                                                                <button 
                                                                    className="text-sm text-gray-600 py-2 px-4 hover:bg-blue-100 hover:text-blue-500"
                                                                    onClick={() => setShowEdit({show: true, user})}
                                                                >
                                                                    编辑
                                                                </button>
                                                                <button 
                                                                    className="text-sm text-gray-600 py-2 px-4 hover:bg-blue-100 hover:text-blue-500"
                                                                    onClick={() => handleDisableUser(user)}
                                                                >
                                                                    { user.isActive ? "禁用" : "启用" }
                                                                </button>
                                                                <button 
                                                                    className="text-sm text-gray-600 py-2 px-4 hover:bg-blue-100 hover:text-blue-500"
                                                                    onClick={() => setShowDelete({ show: true, user })}
                                                                >
                                                                    删除
                                                                </button>
                                                            </div>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination 
                                page={pagination.page} 
                                totalCount={pagination.totalCount} 
                                totalPage={pagination.totalPage} 
                                onChangePage={onChangePage} 
                                isLoading={isLoading} 
                            />
                        </div>
                    </>
                ) : (
                    <NoDataComponent />
                )
            }

            {
                showCreate &&
                <UserCreateComponent 
                    show={showCreate}
                    onClose={() => setshowCreate(false)}
                    onChange={handleUserCreateChange}
                    onSubmit={handleUserCreateSubmit}
                />
            }
            {
                showEdit.show &&
                <UserEditComponent 
                    show={showEdit.show}
                    onClose={() => setShowEdit(prev => ({ ...prev, show: false }))}
                    user={showEdit.user}
                    onChangeCallback={handleEditUserCallback}
                    onSubmit={handleEditUserSubmit}
                />
            }
            {
                showDelete.show &&
                <UserDeleteComponent 
                    show={showDelete.show}
                    onClose={() => setShowDelete(prev => ({ ...prev, show: false }))}
                    user={showDelete.user}
                    onDeleteCallback={handleDeleteUser}
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