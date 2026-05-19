'use client';
import Modal from "@/components/Modal/Modal";
import { PermissionBaseFields } from "@/types/rbac";
import FormComponent from "@/components/PublicComponents/FormComponent";
import InputComponent from "@/components/PublicComponents/InputComponent";

interface CreatePermissionComponentProps {
    show: boolean;
    onClose: () => void;
    permission: PermissionBaseFields; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function CreatePermissionComponent({ show, onClose, permission, onChange, onSubmit }: CreatePermissionComponentProps) {

    if (!show) return;
    return (
        <Modal title="新建权限" show={show} onClose={onClose}>
            <FormComponent className="p-5" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">名称:<span className="text-red-600">*</span></label>
                        <InputComponent 
                            name="name"
                            value={permission.name ?? ""}
                            placeholder="e.g.  查看用户"
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">权限码:<span className="text-red-600">*</span></label>
                        <InputComponent 
                            name="code"
                            value={permission.code ?? ""}
                            placeholder="e.g.  user:read"
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">模块名:<span className="text-red-600">*</span></label>
                        <InputComponent 
                            name="module"
                            value={permission.module ?? ""}
                            placeholder="e.g.  用户管理"
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">动作:<span className="text-red-600">*</span></label>
                        <InputComponent 
                            name="action"
                            value={permission.action ?? ""}
                            placeholder="e.g.  read/write/delete"
                            onChange={onChange}
                        />
                        
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">描述:</label>
                        <InputComponent 
                            name="description"
                            value={permission.description ?? ""}
                            onChange={onChange}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-5 my-4">
                    <button className="p-2 px-5 border border-gray-300 rounded-lg hover:bg-gray-100" onClick={onClose}>取消</button>
                    <button className="p-2 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-400">创建</button>
                </div>
            </FormComponent>
        </Modal>
    )
}