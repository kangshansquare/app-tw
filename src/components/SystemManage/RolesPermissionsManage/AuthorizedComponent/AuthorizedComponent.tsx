'use client';

import ModalCustom from '@/components/Modal/ModalCustom';
import { PermissionResFields, RoleResFields, saveRolePermissionsPayload } from '@/types/rbac';
import {  buildPermissionTreeNode } from '@/lib/permission-tree';
import { useState } from 'react';
import { AuthorizedConfigResponse } from '@/types/rbac';





interface AuthorizedProps {
    show: boolean;
    onClose: () => void;
    role: RoleResFields | null
    permissions: PermissionResFields[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    config: AuthorizedConfigResponse;
    onSave: () => void;
}

type Action = 'view' | 'read' | 'write' | 'delete' | 'update' | 'edit' | 'remove'
const ACTION_LABEL: Record<Action, string> = {
    'view': '显示',
    'read': '查看',
    'write': '修改',
    'delete': '删除',
    'update': '更新',
    'edit': '编辑',
    'remove': '移除'
}

export default function AuthorizedComponent({show, onClose, role, permissions, onChange, config, onSave}: AuthorizedProps) {
    
    const tree = buildPermissionTreeNode(permissions);
    console.log('=========', config)
    
    
    return (
        <ModalCustom title='权限配置' show={show} onClose={onClose} widthClass='w-96' positionClass='flex justify-end items-stretch'>
            <div className='flex flex-col gap-8 text-sm text-gray-600'>
                <div className='flex flex-col gap-5'>
                    <div>正在配置角色: <span className='text-base font-semibold'>{role?.name}</span></div>
                    <div className="flex flex-col gap-4">
                        {tree.map(t => (
                            <div className='flex flex-col gap-5' key={t.node}>
                                <h3 className='font-semibold'>{t.node}</h3>
                                {t.node === '导航栏管理' ? (
                                    t.nav && t.nav.length > 0 ? (
                                        <div className='ml-5 flex flex-col gap-2'>
                                            {t.nav.map(n => (
                                                <label key={n.id} className='text-gray-700 flex items-center gap-2'>
                                                    <input 
                                                        type='checkbox' 
                                                        name={n.module}
                                                        onChange={(e) => onChange(e, n.id)}
                                                    />
                                                    {n.module}
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='text-gray-800'>无</div>
                                    )
                                ) : (
                                    t.data && t.data.length > 0 ? (
                                        <div className='ml-5 flex flex-col gap-2'>
                                            {t.data.map(d => (
                                                <div className='flex flex-col gap-2' key={d.module}>
                                                    <span className='font-semibold'>{d.module}</span>
                                                    <div className='flex'>
                                                        {d.actions.map(a => (
                                                            <label key={a.id} className='ml-5 flex items-center gap-2'>
                                                                <input 
                                                                    type='checkbox' 
                                                                    name={d.module}
                                                                    onChange={(e) => onChange(e, a.id)}
                                                                />
                                                                {ACTION_LABEL[a.action as Action]}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='text-gray-800'>无</div>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex justify-end gap-8'>
                    <button className='p-2 px-6 border border-gray-200 rounded-lg hover:bg-gray-100' onClick={onClose}>取消</button>
                    <button className='p-2 px-6 bg-blue-600 rounded-lg text-white hover:bg-blue-400' onClick={onSave}>保存</button>
                </div>
            </div>
        </ModalCustom>
    )
}





