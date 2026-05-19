'use client';
import Modal from "@/components/Modal/Modal";
import { RoleBaseFields } from "@/types/rbac";
import InputComponent from "@/components/PublicComponents/InputComponent";
import SelectCompoent from "@/components/PublicComponents/SelectComponent";

interface CreateRoleComponentProps {
    show: boolean;
    onClose: () => void;
    role: RoleBaseFields; 
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function CreateRoleComponent({ show, onClose, role, onChange, onSubmit }: CreateRoleComponentProps) {
    const optionsCode = [
        { label: '请选择', value: '' },
        { label: 'admin (全部权限)', value: 'admin' },
        { label: 'ops (运维管理员)', value: 'ops' },
        { label: 'viewer (只读)', value: 'viewer' },
        { label: 'default (默认)', value: 'default' },
    ]
    const optionsIsSystem = [
        { label: "是", value: 'true' },
        { label: "否", value: 'false' },
    ]

    if (!show) return;
    return (
        <Modal title="新建角色" show={show} onClose={onClose}>
            <form className="" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-500 text-sm">角色名称：<span className="text-red-600">*</span></label>
                        <InputComponent 
                            name="name"
                            value={role.name ?? ''}
                            onChange={onChange}
                        />
                        
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-500 text-sm">角色码：<span className="text-red-600">*</span></label>
                        <SelectCompoent 
                            options={optionsCode}
                            name="code"
                            value={role.code ?? ''}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-500 text-sm">系统内置：<span className="text-red-600">*</span></label>
                        <SelectCompoent 
                            options={optionsIsSystem}
                            name="isSystem"
                            value={String(role.isSystem)}
                            onChange={onChange}
                        />
                        
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-500 text-sm">描述：</label>
                        <InputComponent 
                            name="description"
                            value={role.description ?? ""}
                            onChange={onChange}
                        />
                    
                    </div>
                </div>
                <div className="p-5 flex justify-end gap-5 mb-5">
                    <button className="p-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-200" onClick={onClose}>取消</button>
                    <button className="p-2 px-4 bg-blue-600 rounded-lg text-white hover:bg-blue-400">创建</button>
                </div>
            </form>
        </Modal>
    )
}