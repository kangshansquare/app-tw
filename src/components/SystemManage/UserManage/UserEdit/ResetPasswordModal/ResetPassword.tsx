'use client';
import Modal from "@/components/Modal/Modal";
import { UserResField } from "@/types/SystemManage";




interface ResetPasswordModalProps {
    show: boolean;
    onClose: () => void;
    onConfirmCallback: () => void;
}

export default function ResetPasswordModal({ show, onClose, onConfirmCallback }: ResetPasswordModalProps) {
    
    

    if (!show) return;
    return(
        <>
            <Modal title="提示" show={show} onClose={onClose} widthClass="max-w-xl">
                <div className="flex flex-col gap-5 p-5">
                    <p className="text-gray-600">确认重置该用户密码吗？</p>
                    <div className="flex justify-end gap-5">
                        <button className="p-2 px-4 border border-gray-200 hover:bg-gray-200 rounded-lg" onClick={onClose}>取消</button>
                        <button 
                            className="p-2 px-4 bg-blue-600 rounded-lg text-white hover:bg-blue-400"
                            onClick={onConfirmCallback}
                        >
                            确认
                        </button>
                    </div>
                </div>
            </Modal>
            
        </>
    )
    
}