'use client';
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {

    const [msg, setMsg] = useState<string | null>(null);
    const [inputs, setInputs] = useState<{ [key: string]: string}>({})
    const timers = useRef<{[key: string]: NodeJS.Timeout | null}>({});
    const router = useRouter();

    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('注册表单提交');

        if (!inputs.username || !inputs.email || !inputs.password) {
            setMsg('用户名、邮箱和密码不能为空');
            return;
        }

        // 检查输入合法性：用户名、邮箱是否已存在、邮箱格式是否正确、密码长度等
        const res = await fetch('/api/auth', {
            method: 'POST',
            body: JSON.stringify(inputs),
        })

        const data = await res.json();
        if (data.success) {
            // 注册成功，跳转到登录页面
            console.log('注册成功，页面跳转中~');
            setMsg(null);
            router.push('/login');
        } else {
            // 注册失败，显示错误信息
            setMsg(data.message || '注册失败，请重试');
            console.log('注册失败');
        }
    }

    const handleInputChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (timers.current[key]) {
            clearTimeout(timers.current[key]);
        }
        timers.current[key] = setTimeout(() => {
            setInputs(prev => ({ ...prev, [key]: value }))
        }, 300);
    }

    useEffect(() => {
        return () => {
            Object.values(timers.current).forEach(timer => timer && clearTimeout(timer));
        }
    }, []);

    return (
        <form onSubmit={handlerSubmit}>
            <div className="flex flex-col gap-6 items-center justify-center w-[400px] h-[400px] bg-white border-2 shadow-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-md">
                <h2 className="font-bold">Register</h2>
                <input 
                    type="text"
                    placeholder="Username"
                    className="outline-none border border-gray-200 w-[80%] p-2 rounded-md"
                    onChange={handleInputChange('username')}
                />
                <input 
                    type="text"
                    placeholder="email"
                    className="outline-none border border-gray-200 w-[80%] p-2 rounded-md"
                    onChange={handleInputChange('email')}
                />
                <input 
                    type="password"
                    placeholder="Password"
                    className="outline-none border border-gray-200 w-[80%] p-2 rounded-md"
                    onChange={handleInputChange('password')}
                />
                <div className="flex flex-col gap-2 items-center justify-center w-full">
                    <button className="bg-[#5a67d8] hover:bg-[#4c51bf] text-white w-1/2 p-2 rounded-lg">注册</button>
                    <Link href="/login" className="text-teal-400 hover:text-teal-500">已有账号？登录</Link>
                    <p className="text-red-500 text-sm min-h-[20px]">{msg || '\u00A0'}</p>
                </div>
            </div>
        </form>
    )
}