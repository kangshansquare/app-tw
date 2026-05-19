'use client';
import Modal from "@/components/Modal/Modal";
import { UserResField } from "@/types/SystemManage";

interface UserDeleteComponentProps {
    show: boolean;
    onClose: () => void;
    user: UserResField | null;
    onDeleteCallback: (id: number) => void;
}

export default function UserDeleteComponent({ show, onClose, user, onDeleteCallback }: UserDeleteComponentProps) {

    if (!show || !user) return;
    return (
        <Modal title="删除用户" show={show} onClose={onClose} widthClass="max-w-xl">
            <div className="flex flex-col items-center justify-center gap-10 p-5 my-5">
                <p className="font-semibold">确认要删除用户：{user?.name} 吗？</p>
                <div className="flex gap-10">
                    <button 
                        className="border border-gray-200 p-2 px-10 rounded-lg hover:bg-gray-100"
                        onClick={onClose}
                    >
                        取消
                    </button>
                    <button 
                        className="bg-blue-600 text-white p-2 px-10 rounded-lg hover:bg-blue-400"
                        onClick={() => onDeleteCallback(user?.id || 0)}
                    >
                        确认
                    </button>
                </div>
            </div>
        </Modal>
    )
}