'use client';

import { useEffect, useState } from "react";
import TableComponent from "@/components/PublicComponents/TableComponent";
import { ColumnDef } from "@/types/table";
import { RoleResFields, PermissionBaseFields, RoleBaseFields, PermissionResFields, AuthorizedConfigResponse, saveRolePermissionsPayload } from "@/types/rbac";
import Notification from "@/components/Notification/Notification";
import CreatePermissionComponent from "./PermissionComponent/CreatePermissionComponent";
import CreateRoleComponent from "./RoleComponent/CreateRoleComponent";
import EditRoleComponent from "./RoleComponent/EditRoleComponent";
import DeleteRoleComponent from "./RoleComponent/DeleteRoleComponent";
import { PermissionSchema, RoleSchema, extractCustomErrorMessage } from "@/lib/schemas/Schema";
import AuthorizedComponent from "./AuthorizedComponent/AuthorizedComponent";
import EditPermissionComponent from "./PermissionComponent/EditPermissionComponent";
import DeletePermissionComponent from "./PermissionComponent/DeletePermissionComponent";
import { number } from "zod";
import { buildPermissionTreeNode } from "@/lib/permission-tree";


type BUTTONTYPE = 'role' | 'permission' | 'authorized'
const BUTTONTYPE_LABEL: Record<BUTTONTYPE, string> = {
    'role': "新增角色",
    'permission': '新增权限',
    'authorized': '新增授权'
}

export default function RolesPermissionsManageComponent() {
    const [ buttonFlag, setButtonFlag ] =useState<'role' | 'permission' | 'authorized'>("role")
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ roles, setRoles ] = useState<RoleResFields[]>([])
    const [ permissions, setPermissions ] = useState<PermissionBaseFields[]>([])
    const [ notifition, setNotification ] = useState<{
        show: boolean,
        type?: "success" | "error" | "info",
        message?: string
    }>({show: false})
    const onNotiy = (type: 'success' | 'info' | 'error', message: string) => {
        setNotification({ show: true, type, message })
    }

    const roleColumns: ColumnDef<RoleResFields>[] = [
        {
            key: "name",
            header: "名称"
        },
        {
            key: 'code',
            header: "角色"
        },
        {
            key: 'isSystem',
            header: "系统内置",
            render: item => item.isSystem ? '是' : '否'
            
        },
        {
            key: 'description',
            header: "描述"
        }
    ]
    
    
    // const handleRoleToggleStatus = async () => {}

    const permissionColumns: ColumnDef<PermissionBaseFields>[] = [
        {
            key: "name",
            header: "名称"
        },
        {
            key: 'code',
            header: "权限标识"
        },
        {
            key: 'module',
            header: "模块名称"
        },
        {
            key: 'action',
            header: "动作"
        },
        {
            key: 'description',
            header: "描述"
        }
    ]
    
    
    // const handlePermissionToggleStatus = async () => {}
    
    const initRole: RoleBaseFields = {
        code: "",
        name: "",
        isSystem: false,
        description: ""
    }
    const initPermission: PermissionBaseFields = {
        name: '',
        code: '',
        module: '',
        action: '',
        description: ''
    }
    const [ showCreateRole, setShowCreateRole ] = useState<{ show: boolean, role: RoleBaseFields }>({show: false, role: initRole})
    const handleCrete = () => {
        // buttonFlag === 'role' ? setShowCreateRole(prev => ({ ...prev, show: true })) : (buttonFlag === "permission" ? setShowCreatePerm(prev => ({...prev, show: true})) : setShowCreateAuthorized(prev => ({...prev, show:true})) )
        buttonFlag === 'role' ? setShowCreateRole(prev => ({...prev, show: true})) : setShowCreatePerm(prev => ({...prev, show: true}))
    }
    const handleCreateRoleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.currentTarget
        
        setShowCreateRole(prev => ({
            ...prev,
            role: {
                ...prev.role,
                [name]: name === 'isSystem' ? Boolean(value) : value
            }
        }))
    }
    const handleCreateRoleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const parsed = RoleSchema.safeParse(showCreateRole.role) 
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            onNotiy('error', String(error[0] || "数据格式错误"))
            return;
        }

        try {
            const res = await fetch('/api/system-manage/role-manage', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: parsed.data })
            })
            const data = await res.json();
            if (data.success) {
                fetchRolePermission()
                setShowCreateRole({ show: false, role: initRole })
                onNotiy("success", String(data.message) || 'Role创建成功')
            } else {
                onNotiy("error", String(data.message) || 'Role创建失败')
            }
        } catch (error) {
            onNotiy('error', '网络异常')
        }

    }

    const [ showCreatePerm, setShowCreatePerm ] = useState<{ show: boolean, permission: PermissionBaseFields }>({show: false, permission: initPermission})
    const handleCreatePermOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setShowCreatePerm(prev => ({
            ...prev,
            permission: {
                ...prev.permission,
                [name]: value
            }
        }))
    }
    const handleCreatePermOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const parsed = PermissionSchema.safeParse(showCreatePerm.permission);
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            onNotiy("error", String(error[0]) || "数据格式错误")
            return;
        }

        try {
            const res = await fetch('/api/system-manage/permission-manage', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data)
            })
            const data = await res.json()
            if (data.success) {
                fetchRolePermission()
                setShowCreatePerm({ show: false, permission: initPermission })
                onNotiy("success", String(data.message) || "创建成功")
            } else {
                onNotiy("error", String(data.message) || "创建失败")
            }
        } catch(error) {
            onNotiy("error",  "网络异常")
        }
    }

    const [ showEditPerm, setShowEditPerm ] = useState<{show: boolean, permission: PermissionResFields | null}>({show: false, permission: null})
    const handlePermissionEdit = (item: PermissionResFields) => {
        setShowEditPerm({show: true, permission: item})
    }
    const handlePermissionEditOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setShowEditPerm(prev => {
            if (!prev.permission) return prev;
            return {
                ...prev,
                permission: {
                    ...prev.permission,
                    [name]: value
                }
            }
        })
    }
    const handlePermissionEditOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const parsed = PermissionSchema.safeParse(showEditPerm.permission)
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            onNotiy("error", String(error[0]) || "数据格式错误")
            return;
        }

        try {
            const res = await fetch(`/api/system-manage/permission-manage/${showEditPerm.permission?.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(parsed.data)
            })
            const data = await res.json();
            if (data.success) {
                fetchRolePermission()
                setButtonFlag("permission")
                setShowEditPerm(prev => ({...prev, show: false}))
                onNotiy("success", String(data.message) || "更新成功")
            } else {
                onNotiy("error", String(data.message) || "更新失败")
            }
        } catch (error) {
            console.log(error)
            onNotiy("error",  "网络异常")
        }
        
    }
    const [ showDeletePerm, setShowDeletePerm ] = useState<{show: boolean, permission: PermissionResFields | null}>({show: false, permission: null})
    const handlePermissionDelete = (item: PermissionResFields) => {
        setShowDeletePerm({show: true, permission: item})
    }
    const handlePermissionDeleteCallback = async (id: number) => {
        if (id === 0) {
            onNotiy("error", "无法获取ID信息");
            return;
        }
        try {
            const res = await fetch(`/api/system-manage/permission-manage/${showDeletePerm.permission?.id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"}
            })
            const data = await res.json()
            if (data.success) {
                fetchRolePermission()
                setButtonFlag("permission")
                setShowDeletePerm(prev => ({...prev, show: false}))
                onNotiy("success", String(data.message) || "删除成功")
            } else {
                onNotiy("error", String(data.message) || "删除失败")
            }
        } catch (error) {
            onNotiy("error", "网络异常")
        }
    }

    const [ showEditRole, setShowEditRole ] = useState<{ show: boolean; role: RoleResFields | null }>({ show: false, role: null })
    const handleRoleEdit = (item: RoleResFields) => {
        
        setShowEditRole({ show: true, role: item })
    }
    const handleRoleEditOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.currentTarget;
        
        setShowEditRole(prev => { 
            if (!prev.role) return prev;
            return {
                ...prev,
                role: {
                    ...prev.role,
                    [name]: name === 'isSystem' ? (value === 'true') : value
                }
            }
        })
    }
    const handleRoleEditOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!showEditRole.role) return;
        const parsed = RoleSchema.safeParse(showEditRole.role)
        if (!parsed.success) {
            const error = extractCustomErrorMessage(parsed.error)
            onNotiy('error', String(error[0]) || "数据格式错误")
            return;
        }

        try {
            const res = await fetch(`/api/system-manage/role-manage/${showEditRole.role.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data)
            })
            const data = await res.json();
            if (data.success) {
                fetchRolePermission()
                setShowEditRole(prev => ({ ...prev, show: false }))
                onNotiy('success', String(data.message) || "更新成功")
            } else {
                onNotiy("error", String(data.message) || "更新失败")
            }
        } catch(error) {
            onNotiy("error", "网络异常")
        }
    }
    
    const [ showDeleteRole, setShowDeleteRole ] = useState<{show: boolean, role: RoleResFields | null}>({show: false, role: null})
    const handleRoleDelete = (item: RoleResFields) => {
        setShowDeleteRole({ show: true, role: item })
    }
    const handleRoleDeleteCallback = async (id: number) => {
        if (id === 0) {
            onNotiy("error", "无法获取角色信息")
            return;
        }
        try {
            const res = await fetch(`/api/system-manage/role-manage/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json()
            if (data.success) {
                fetchRolePermission()
                setShowDeleteRole(prev => ({...prev, show: false}))
                onNotiy("success", String(data.message) || "删除成功")
            } else {
                onNotiy("error", String(data.message) || "删除失败")
            }

        } catch(error) {
            onNotiy("error",  "网络异常")
        }
    }

    // const [ authorized, setAuthorized ] = useState<AuthorizedResFields[]>([])
    // const authorizedColumns: ColumnDef<AuthorizedResFields>[] = [
    //     {
    //         key: 'id',
    //         header: "ID"
    //     },
    //     {
    //         key: 'name',
    //         header: "关联角色"
    //     },
    //     {
    //         key: 'permissions',
    //         header: '操作权限'
    //     }
    // ]
    // const handleAuthorizedEdit = () => {}
    // const handleAuthorizedDelete = () => {}
    // const handleAuthorizedToggleStatus = () => {}

    // const initalAuthorized = {
    //     name: '',
    //     permissions: []
    // }
    // const [ showCreateAuthorized, setShowCreateAuthorized ] = useState<{ show: boolean, authorized: AuthorizedBaseFields }>({ show: false, authorized: initalAuthorized })

    const [ showAuthorized, setShowAuthorized ] = useState<{show: boolean, role: RoleResFields | null}>({show: false, role: null})
    
    const handleAuthorizedConfig = (item: RoleResFields) => {
        // console.log("----------", item)
        setShowAuthorized({show: true, role: item})
        fecthAuthorizedConfig(Number(item.id))
    }
    const handleAuthorizedConfigOnChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const { name, checked } = e.currentTarget
        console.log(name, checked, id)
        // if (checked) setConfig(prev =>  {
        //     if (!prev.selectPermissionIds.includes(id)) {
        //         return {
        //             ...prev,
        //             selectPermissionIds: [...prev.selectPermissionIds, id]
        //         }
        //     }
        //     return prev
        // })
    }
    const [ config, setConfig ] = useState<AuthorizedConfigResponse>({role: initRole, permissionTree: [], selectPermissionIds: []})
    const fecthAuthorizedConfig = async (id: number) => {
        try {
            const res = await fetch(`/api/system-manage/role-permission?roleId=${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json();
            
            if (data.success) {
                setConfig(data.data)
            } else {
                
                onNotiy("error",  "请求失败")
            }

        } catch (error) {
            onNotiy("error", "网络异常")
        }
    }
    const saveRolePermissionsPayload = async () => {

        console.log('----------------',config)
        // try {
        //     const res = await fetch(`/api/system-manage/role-permision/${payload.roleId}`, {
        //         method: "PUT",
        //         headers: { "Content-Type": "application/json" }
        //     })
        //     const data = await res.json();
        //     if (data.success) {
                
        //         onNotiy('success', String(data.message) || "保存成功")
        //     } else {
        //         onNotiy("error", String(data.message) || "保存失败")
        //     }
        // } catch(error) {
        //     onNotiy("error", "网络异常")
        // }
    }

    const fetchRolePermission = async () => {
        setIsLoading(true)
        try {
            const [ roleRes, permRes ] = await Promise.all([
                await fetch('/api/system-manage/role-manage', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }),
                await fetch('/api/system-manage/permission-manage', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })
            ])
            const roleData = await roleRes.json()
            const permData = await permRes.json();
            
            // const authData = await authRes.json();
            
            setRoles(Array.isArray(roleData.roles) ? roleData.roles : [])
            setPermissions(Array.isArray(permData.permissions) ? permData.permissions : [])
            // setAuthorized(Array.isArray(authData.authorized) ? authData.authorized : [])

        } catch (error) {
            onNotiy("error","网络异常")
        } finally {
            setIsLoading(false)
        }
        
    }
    
    useEffect(() => {
        fetchRolePermission()
    }, [])

    return (
        <div className="flex gap-2 rounded-lg bg-gray-50 py-2">
            <div className="flex-[15%] h-full bg-white rounded-lg py-2">
                <div className="flex flex-col">
                    <button 
                        className={`text-start p-2 pl-8  ${buttonFlag === 'role' ? "bg-blue-50 text-blue-500 border-r-4 border-blue-600" : "hover:bg-gray-50"}`}
                        onClick={() => setButtonFlag("role")}
                    >
                        角色管理
                    </button>
                    <button 
                        className={`text-start p-2 pl-8  ${buttonFlag === 'permission' ? "bg-blue-50 text-blue-500 border-r-4 border-blue-600" : "hover:bg-gray-50"}`}
                        onClick={() => setButtonFlag('permission')}
                    >
                        权限管理
                    </button>
                    {/* <button 
                        className={`text-start p-2 pl-8  ${buttonFlag === "authorized" ? "bg-blue-50 text-blue-500 border-r-4 border-blue-600" : "hover:bg-gray-50"}`}
                        onClick={() => setButtonFlag('authorized')}
                    >
                        授权管理
                    </button> */}
                </div>
            </div>
            <div className="flex-[85%] h-full p-4 bg-white rounded-lg">
                <div className="flex justify-between mb-4">
                    <h3 className="text-gray-700 font-semibold text-lg">{buttonFlag === 'role' ? "角色管理" : (buttonFlag === "permission" ? "权限管理" : "授权管理")}</h3>
                    <button 
                        className="p-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                        onClick={handleCrete}
                    >
                        {BUTTONTYPE_LABEL[buttonFlag as BUTTONTYPE]}
                    </button>
                </div>
                
                {
                    buttonFlag === 'role' ?
                    <TableComponent 
                        data={roles}
                        columns={roleColumns}
                        showToggleStatus={false}
                        loading={isLoading}
                        renderActions={(row) => (
                            <div className="flex gap-2">
                                <button  className="text-sm text-blue-600" onClick={() => handleRoleEdit(row)}>编辑</button>
                                <button className="text-sm text-red-600" onClick={() => handleRoleDelete(row)}>删除</button>
                                <button className="text-sm text-[#FF7D00]" onClick={() => handleAuthorizedConfig(row)}>配置权限</button>
                            </div>
                        )}
                    /> :
                    <TableComponent 
                        data={permissions}
                        columns={permissionColumns}
                        loading={isLoading}
                        showToggleStatus={false}
                        actions={{ onEdit: handlePermissionEdit, onDelete: handlePermissionDelete }}
                    /> 
                }

                

            

            </div>
            {
                showCreateRole.show &&
                <CreateRoleComponent 
                    show={showCreateRole.show}
                    onClose={() => setShowCreateRole(prev => ({ ...prev, show: false }))}
                    role={showCreateRole.role}
                    onChange={handleCreateRoleOnChange}
                    onSubmit={handleCreateRoleOnSubmit}
                />
            }

            {
                showEditRole.show && 
                <EditRoleComponent 
                    show={showEditRole.show} 
                    onClose={() => setShowEditRole(prev => ({...prev, show: false}))} 
                    role={showEditRole.role}
                    onChange={handleRoleEditOnChange}
                    onSubmit={handleRoleEditOnSubmit}
                />     
            }

            {
                showDeleteRole.show &&
                <DeleteRoleComponent 
                    show={showDeleteRole.show}
                    onClose={() => setShowDeleteRole(prev => ({...prev, show: false}))}
                    role={showDeleteRole.role}
                    onDeleteCallback={handleRoleDeleteCallback}
                />
            }

            {
                showCreatePerm.show &&
                <CreatePermissionComponent 
                    show={showCreatePerm.show}
                    onClose={() => setShowCreatePerm(prev => ({ ...prev, show: false }))}
                    permission={showCreatePerm.permission}
                    onChange={handleCreatePermOnChange}
                    onSubmit={handleCreatePermOnSubmit}
                />
            }
            {
                showEditPerm.show &&
                <EditPermissionComponent 
                    show={showEditPerm.show}
                    onClose={() => setShowEditPerm(prev => ({ ...prev, show: false }))}
                    permission={showEditPerm.permission}
                    onChange={handlePermissionEditOnChange}
                    onSubmit={handlePermissionEditOnSubmit}
                />
            }
            {
                showDeletePerm.show &&
                <DeletePermissionComponent 
                    show={showDeletePerm.show}
                    onClose={() => setShowDeletePerm(prev => ({...prev, show: false}))}
                    permission={showDeletePerm.permission}
                    onDeleteCallback={handlePermissionDeleteCallback}
                />
            }


            
            {
                <AuthorizedComponent 
                    show={showAuthorized.show}
                    onClose={() => setShowAuthorized(prev => ({...prev, show: false}))}
                    role={showAuthorized.role}
                    permissions={permissions}
                    onChange={handleAuthorizedConfigOnChange}
                    config={config}
                    onSave={saveRolePermissionsPayload}
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