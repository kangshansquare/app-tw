'use client';
import { useState } from "react";
import Login from "./Login/Login";
import Register from "./Register/Register";

export default function LoginComponent() {

    const [ buttonFlag, setButtonFlag ] = useState('login')

    const handleButtonFlag = (flag: string) => {
        setButtonFlag(flag)
    }

    return (
        <div className="p-10 flex flex-col md:w-1/4 h-[600px] bg-white rounded-2xl shadow-2xl">
            <div className="grid grid-cols-2 border-b border-gray-200 w-full">
                <button
                    onClick={() => handleButtonFlag('login')}
                    className={`${buttonFlag === 'login' ? 'border-b-2 border-blue-600 text-blue-600' : 'border-b-2 border-white text-gray-600'} pb-3`}
                >
                    登录
                </button>
                <button
                    onClick={() => handleButtonFlag('register')}
                    className={`${buttonFlag === 'register' ? 'border-b-2 border-blue-600 text-blue-600' : 'border-b-2 border-white text-gray-600'} pb-3`}
                >
                    注册
                </button>
            </div>
            
            <div className="mt-5">
                { buttonFlag === 'login' ? <Login /> : <Register /> }
            </div>
        </div>
    )
}