'use client';
import Modal from "@/components/Modal/Modal";
import { PermissionResFields } from "@/types/rbac";

interface DeletePermissionProps {
    show: boolean;
    onClose: () => void;
    permission: PermissionResFields | null;
    onDeleteCallback: (id: number) => void;
}

export default function DeletePermissionComponent({show, onClose, permission, onDeleteCallback}: DeletePermissionProps) {

    if (!show || !permission) return null;
    return (
        <Modal title="删除权限" show={show} onClose={onClose} widthClass="max-w-xl">
            <div className="flex flex-col gap-5 items-center justify-center p-5 my-5">
                <p>确定要删除权限 <span className="font-semibold">{permission.name}</span> 吗？</p>
                <div className="flex gap-8">
                    <button className="p-2 px-8 border border-gray-200 rounded-lg hover:bg-gray-100" onClick={onClose}>取消</button>
                    <button className="p-2 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-400" onClick={() => onDeleteCallback(Number(permission.id) || 0)}>确认</button>
                </div>
            </div>
        </Modal>
    )
}