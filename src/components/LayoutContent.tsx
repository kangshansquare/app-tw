'use client';

import { usePathname } from "next/navigation";
import Menu from "@/components/menu/menu";
import Header from "@/components/header/header";



export default function LayoutContent({ children, isLogin, username, user_id }: { children: React.ReactNode, isLogin: boolean, username: string, user_id: number | null }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login" || pathname === "/register";
   
    return (
        
        <div className="flex flex-col h-screen">
            <div>
                { !isLoginPage && <Header isLogin={isLogin} username={username} /> }
            </div>
            <div className="bg-gray-100 h-screen flex overflow-hidden">
                {/* <div className="flex-[1] bg-gray-600 text-white flex flex-col">
                    { !isLoginPage && <Menu /> }
                </div> */}
                { !isLoginPage && <Menu /> }
                <div className="flex-[9] bg-white rounded-md">
                    {children}
                </div>
            </div>
        </div>
    );
}