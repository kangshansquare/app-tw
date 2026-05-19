'use client';
import Modal from "@/components/Modal/Modal";
import { RoleResFields } from "@/types/rbac";

interface DeleteRoleProps {
    show: boolean;
    onClose: () => void;
    role: RoleResFields | null;
    onDeleteCallback: (id: number) => void;
}

export default function DeleteRoleComponent({ show, onClose, role, onDeleteCallback }: DeleteRoleProps) {

    if (!show || !role) return;
    return (
        <Modal title="删除角色" show={show} onClose={onClose} widthClass="max-w-xl">
            <div className="flex flex-col gap-5 p-5 items-center justify-center my-5">
                <div className="flex flex-col gap-3">
                    <p className="">确定要删除角色 <span className="font-semibold">{role.name}</span> 吗？</p>
                    {/* <div className="p-4 rounded-lg bg-gray-200 flex flex-col gap-1 text-sm text-gray-600">
                        <span>角色名称：{role.name ?? ""}</span>
                        <span>角色码：{role.code ?? ""}</span>
                    </div> */}
                </div>
                <div className="flex gap-10">
                    <button className="p-2 px-8 border border-gray-200 rounded-lg hover:bg-gray-100" onClick={onClose}>取消</button>
                    <button className="p-2 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-400" onClick={() => onDeleteCallback(role.id ?? 0)}>确认</button>
                </div>
            </div>
        </Modal>
    )
}