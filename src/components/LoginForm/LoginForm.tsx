'use client';

import React, { useState,useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function LoginForm() {

    const route = useRouter();

    // const [username, setUsername] = useState<string>("")
    // const [password, setPassword] = useState<string>("")

    const [inputs, setInputs] = useState<{ [key: string]: string }>({});
    const timers = useRef<{ [key: string]: NodeJS.Timeout | null }>({});

    const [msg, setMsg] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(inputs)

        if (!inputs.username || !inputs.password) {
            setMsg('用户名和密码不能为空');
            return;
        }

        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs)
        })
        
        const data = await res.json();
        console.log(data)
        if(data.success) {
            // redirect('/')
            console.log('登录成功，页面跳转中~')
            window.location.href = '/'
        } else {
            setMsg(data.message || '登录失败，请重试');
            console.log('登录失败')
        }
        
    }

    const handleInputChange = (key: string) =>  (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (timers.current[key]) {
            clearTimeout(timers.current[key]);
        }
        timers.current[key] = setTimeout(() => {
            setInputs(prev => ({ ...prev, [key]: value }))
        },300)
        
    }

    useEffect(() => {
        return (() => {
            Object.values(timers.current).forEach(timer => timer && clearTimeout(timer))
        })
    })
    
    return (
        <form onSubmit={handleSubmit} 
            className="flex flex-col gap-6 items-center justify-center w-[400px] h-[400px] bg-white border-2 shadow-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-md">
            <h2 className="font-bold">Welcome</h2>
            <input 
                type="text"
                onChange={handleInputChange('username')}
                className="outline-none border border-gray-200 w-[80%] p-2 rounded-md"
                
            />
            <input 
                type="password"
                onChange={handleInputChange('password')}
                className="outline-none border border-gray-200 w-[80%] p-2 rounded-md"
            />
            <div className="flex flex-col gap-2 items-center justify-center w-full">
                <button className="bg-[#5a67d8] hover:bg-[#4c51bf] text-white w-1/2 p-2 rounded-lg">登录</button>
                <Link href="/register" className="text-teal-400 hover:text-teal-500">Register?</Link>
                <p className="text-red-500 text-sm min-h-[20px]">{msg || '\u00A0'}</p>
            </div>
            
        </form>
    )
}