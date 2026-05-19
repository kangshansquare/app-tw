'use client';
import Modal from "@/components/Modal/Modal";
import { PermissionResFields } from "@/types/rbac";
import FormComponent from "@/components/PublicComponents/FormComponent";
import InputComponent from "@/components/PublicComponents/InputComponent";

interface EditPermissionProps {
    show: boolean;
    onClose: () => void;
    permission: PermissionResFields | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function EditPermissionComponent({show, onClose, permission, onChange, onSubmit}: EditPermissionProps) {
    
    if (!show || !permission) return;
    return (
        <Modal title="编辑权限" show={show} onClose={onClose}>
            <FormComponent className="p-5" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">名称: <span className="text-red-500">*</span></label>
                        <InputComponent 
                            className="text-sm"
                            name="name"
                            value={permission.name ?? ""}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">权限标识: <span className="text-red-500">*</span></label>
                        <InputComponent 
                            className="text-sm"
                            name="code"
                            value={permission.code ?? ""}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">模块名称: <span className="text-red-500">*</span></label>
                        <InputComponent 
                            className="text-sm"
                            name="module"
                            value={permission.module ?? ""}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">动作: <span className="text-red-500">*</span></label>
                        <InputComponent 
                            className="text-sm"
                            name="action"
                            value={permission.action ?? ""}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">描述: </label>
                        <InputComponent 
                            className="text-sm"
                            name="description"
                            value={permission.description ?? ""}
                            onChange={onChange}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-5 my-5">
                    <button className="p-2 px-6 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={onClose}>取消</button>
                    <button className="p-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-400">更新</button>
                </div>
            </FormComponent>
        </Modal>
    )
}