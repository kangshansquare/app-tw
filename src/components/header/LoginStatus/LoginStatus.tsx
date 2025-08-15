'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

// import { InfoCircleFilled, SettingFilled } from "@ant-design/icons"



export default function LoginStatus({ isLogin,username }: { isLogin: boolean, username: string }) {
    const [showDownMenu, setShowDownMenu] = useState<boolean>(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleLogout = async () => {
        const res = await fetch('/api/logout', {
            method: "POST",
            credentials: 'include'
            
        })
        const data = await res.json();  
        if (data?.success) {
            console.log("Logout~")
            window.location.href = '/login'
        }
    }

    const handleMouseEnter = () => {
        if(timerRef.current) clearTimeout(timerRef.current);
        setShowDownMenu(true)
    }

    const handleMouseLeave = () => {
        timerRef.current = setTimeout(() => setShowDownMenu(false), 200)
    }

    return (
        <div className="flex gap-4 items-center relative">
            {isLogin ? (
                <div className="flex flex-col gap-1 shadow-sm" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div className="flex gap-2 items-center justify-center hover:cursor-pointer"  >
                        <Image src="/user.png" height={40} width={40} alt="" />
                        <span className="">{username}</span>
                        <span>&or;</span>
                    </div>

                    {showDownMenu && (
                        <div className="flex flex-col gap-2 justify-center items-center
                                    border border-gray-200 bg-white text-sm pt-2 pb-2
                                    absolute top-[60px] left-2 rounded-md"
                        >
                            
                            <div className="flex flex-col gap-2 w-full">
                                <div className="flex gap-2 hover:cursor-pointer hover:bg-gray-300 p-2 items-center justify-center w-full">   
                                    {/* <Buy size={22} color="#000000"/> */}
                                    {/* <InfoCircleFilled className="text-black text-lg" /> */}
                                    <Link href="/profile/info" className="text-black block w-full">个人信息</Link>
                                </div>    
                                <div className="flex gap-2 hover:cursor-pointer hover:bg-gray-300 p-2 items-center justify-center w-full">
                                    {/* <Buy size={22} color="#000000"/> */}
                                    {/* <SettingFilled className="text-black text-lg"/> */}
                                    <Link href="/profile/user/settings" className="text-black  block w-full">偏好设置</Link>
                                </div>
                            </div>
                            <div className="border border-gray-100 w-full"/>
                            <div className="flex gap-2 hover:cursor-pointer hover:bg-gray-300 p-2 items-center justify-center">
                                {/* <AddUser size={22} color="#000000"/> */}
                                <button 
                                    className="text-black block w-full"
                                    onClick={handleLogout}
                                >退出登录</button>
                            </div>    
                        </div>
                    )}
                    
                </div>
            ): (
                <>
                    <Link 
                        className="p-2 bg-slate-600 rounded-md text-white border-none text-sm hover:bg-slate-500"
                        href="/login"
                    >Login</Link>
                </>
            )}
        </div>
    )
}