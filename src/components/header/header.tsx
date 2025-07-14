'use client';

import LoginStatus from '@/components/header/LoginStatus/LoginStatus';



export default function Header({ isLogin, username }: { isLogin: boolean, username: string }) {


    return (
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
            <h3>Header</h3>
            <LoginStatus isLogin={isLogin} username={username} />
        </div>
    )
}