'use client';
import Modal from "@/components/Modal/Modal";

interface ConfirmProps {
    show: boolean;
    onClose: () => void;
    user: string;
    randomPass: string
}

export default function Confirm({ show, onClose, user,randomPass }: ConfirmProps) {

    const handleCopy = () => {
        
        navigator.clipboard.writeText(`Username: ${user}\nPassword: ${randomPass}`)
            .then(() => {
                console.log("账号密码复制成功")
            })
            .catch((error) => {
                console.log("账号密码复制失败", error)
            })
    }

    return (
        <Modal title="提示" show={show} onClose={onClose} widthClass="max-w-xl" >
            <div className="flex flex-col gap-5 items-center justify-center p-5 mb-5">
                <p className="">重置账号成功</p>
                <div className="bg-blue-100 p-2 flex flex-col gap-5 rounded-lg w-[70%]">
                    <div className="flex flex-col gap-2">
                        <span className="text-gray-500">账号：{user}</span>
                        <span className="text-gray-500">密码：{randomPass}</span>
                    </div>
                    <div className="flex justify-end text-blue-500">
                        <button onClick={handleCopy}>一键复制账号密码</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}