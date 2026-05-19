'use client';
import Modal from "@/components/Modal/Modal";
import { UserResField } from "@/types/SystemManage";
import ResetPasswordModal from "./ResetPasswordModal/ResetPassword";
import { useState } from "react";
import Confirm from "./ResetPasswordModal/Confirm/Confirm";
import Notification from "@/components/Notification/Notification";

interface UserEditComponentProps {
    show: boolean;
    onClose: () => void;
    user: UserResField | null;
    onChangeCallback: (e:React.FormEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function UserEditComponent({ show, onClose, user, onChangeCallback, onSubmit }: UserEditComponentProps) {
    const [ notifition, setNotification ] = useState<{
        show: boolean,
        type?: "success" | "error" | "info",
        message?: string
    }>({show: false})
    const onNotiy = (type: 'success' | 'info' | 'error', message: string) => {
        setNotification({ show: true, type, message })
    }
    const [ showReset, setShowReset ] = useState<boolean>(false)
    const [ showConfirm, setShowConfirm ] = useState<boolean>(false)
    const [ randomPass, setRandomPass ] =useState<string>("")
    function randomPassword(length = 12) {
        const charset =
          "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"; // 去掉容易混淆的字符 0/O, 1/I
      
        // 浏览器安全随机
        if (globalThis.crypto?.getRandomValues) {
          const bytes = new Uint32Array(length);
          globalThis.crypto.getRandomValues(bytes);
      
          let result = "";
          for (let i = 0; i < length; i++) {
            result += charset[bytes[i] % charset.length];
          }
          return result;
        }
      
        // 兜底（不如上面安全）
        let result = "";
        for (let i = 0; i < length; i++) {
          result += charset[Math.floor(Math.random() * charset.length)];
        }
        return result;
    }
    const handleResetConfirmCallback = async () => {
        const password = randomPassword();
        try {
            
            const res = await fetch(`/api/system-manage/user-manage/${user?.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            })
            const data = await res.json();
            if (data.success) {
                setShowReset(false)
                setShowConfirm(true)
                setRandomPass(password)
                onNotiy('success', String(data.message) || '重置密码成功')
            } else {
                onNotiy("error", String(data.message) || "重置用户密码失败")
            }

        } catch(error) {
            onNotiy("error", "网络异常")
        }
        
        
    }
    
    if (!show || !user) return null;
    return (
        <>
            <Modal title="用户信息修改" show={show} onClose={onClose}>
                <form className="p-5" onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600">用户名<span className="text-red-600">*</span></label>
                            <input 
                                className="outline-none p-2 border  border-gray-300 rounded-lg focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                                value={user.name ?? ""}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600">用户邮箱<span className="text-red-600">*</span></label>
                            <input 
                                className="outline-none p-2 border  border-gray-300 rounded-lg focus:border-blue-500"
                                name="email"
                                value={user.email ?? ""}
                                onChange={(e) => onChangeCallback(e)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600">角色权限</label>
                            <select className="outline-none p-2 border border-gray-300 rounded-lg focus:border-blue-500">
                                <option>权限管理员</option>
                                <option>运维管理员</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-10 mb-5">
                        <button 
                            className="p-2 px-6 bg-blue-600 rounded-lg text-white hover:bg-blue-400"
                            onClick={(e) => { e.preventDefault();setShowReset(true)}}
                        >
                            重置密码
                        </button>
                        <div className="flex gap-5">
                            <button 
                                className="p-2 px-6 border border-gray-100 rounded-lg hover:bg-gray-200" onClick={onClose}
                                type="button"
                            >
                                取消
                            </button>
                            <button 
                                className="p-2 px-6 bg-blue-600 rounded-lg text-white hover:bg-blue-400" 
                                type="submit" 
                            >
                                提交
                            </button>
                        </div>
                    </div>
                </form>
                
            </Modal>
            {
                showReset &&
                <ResetPasswordModal 
                    show={showReset}
                    onClose={() => setShowReset(false)}
                    onConfirmCallback={handleResetConfirmCallback}
                />
            }
            {
                showConfirm &&
                <Confirm 
                    show={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    user={user.name}
                    randomPass={randomPass}
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
        </>
    )
}