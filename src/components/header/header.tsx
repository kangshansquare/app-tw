'use client';

import LoginStatus from '@/components/header/LoginStatus/LoginStatus';



export default function Header({ isLogin, username }: { isLogin: boolean, username: string }) {


    return (
        <div className="bg-[#171717] text-white p-4 flex items-center justify-between">
            <h3 className='text-xl font-bold'>运维工作台</h3>
            <LoginStatus isLogin={isLogin} username={username} />
        </div>
    )
}