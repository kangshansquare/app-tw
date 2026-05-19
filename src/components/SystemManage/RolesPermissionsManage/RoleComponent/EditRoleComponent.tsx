'use client';
import Modal from "@/components/Modal/Modal";
import { RoleResFields } from "@/types/rbac";
import FormComponent from "@/components/PublicComponents/FormComponent";
import InputComponent from "@/components/PublicComponents/InputComponent";
import SelectCompoent from "@/components/PublicComponents/SelectComponent";

interface EditRoleProps {
    show: boolean;
    onClose: () => void;
    role: RoleResFields | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function EditRoleComponent({ show, onClose, role, onChange, onSubmit }: EditRoleProps) {
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

    if (!show || !role) return;
    return (
        <Modal title="编辑角色" show={show} onClose={onClose}>
            <FormComponent className="p-5 flex flex-col" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 text-sm gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">角色名称:<span className="text-red-600">*</span></label>
                        <InputComponent 
                            name="name"
                            value={role.name ?? ''}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">角色码:<span className="text-red-600">*</span></label>
                        <SelectCompoent 
                            options={optionsCode}
                            name="code"
                            value={role.code ?? ''}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">系统内置:<span className="text-red-600">*</span></label>
                        <SelectCompoent 
                            options={optionsIsSystem}
                            name="isSystem"
                            value={String(role.isSystem) ?? ''}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">描述:</label>
                        <InputComponent 
                            name="description"
                            value={role.description ?? ''}
                            onChange={onChange}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-5 my-5">
                    <button className="p-2 px-6 border border-gray-300 rounded-lg hover:bg-gray-200" onClick={onClose}>取消</button>
                    <button className="p-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-400">提交</button>
                </div>
            </FormComponent>
        </Modal>
    )
}