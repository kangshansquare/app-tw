'use client';
import Modal from "@/components/Modal/Modal";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

interface UserCreateComponentProps {
    show: boolean;
    onClose: () => void
    onChange: (e: React.FormEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function UserCreateComponent({ show, onClose, onChange, onSubmit }: UserCreateComponentProps) {
    const [ showPass, setShowPass ] = useState<boolean>(false)
    return (
        <Modal title="创建用户" show={show} onClose={onClose}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 p-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">用户名 <span className="text-red-600">*</span></label>
                        <input 
                            className="outline-none border border-gray-200 p-2 rounded-lg focus:border-blue-300"
                            name="name"
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">邮箱地址 <span className="text-red-600">*</span></label>
                        <input 
                            className="outline-none border border-gray-200 p-2 rounded-lg focus:border-blue-300"
                            name="email"
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-sm text-gray-500">密码 <span className="text-red-600">*</span></label>
                        <input 
                            className="outline-none border border-gray-200 p-2 rounded-lg focus:border-blue-300"
                            name="password"
                            type={showPass ? "" : "password"}
                            onChange={onChange}
                        />
                        <p className='absolute top-1/2 right-2 hover:cursor-pointer' onClick={() => setShowPass(!showPass)}>
                            {
                                showPass ? (
                                    <FontAwesomeIcon icon={faEye} className='text-gray-500' />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} className="text-gray-500" />
                                )
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-5 p-5 mb-5">
                    <button 
                        className="border border-gray-200 p-2 px-4 rounded-lg hover:bg-gray-200" onClick={onClose}
                        type="button"
                    >
                        取消
                    </button>
                    <button 
                        className="bg-blue-500 p-2 px-4 text-white rounded-lg hover:bg-blue-400"
                        type="submit"
                    >
                        创建
                    </button>
                </div>
            </form>
        </Modal>
    )
}