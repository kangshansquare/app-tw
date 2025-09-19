'use client';
import { UserOutlined, LockOutlined, WechatOutlined, QqOutlined, GithubOutlined } from '@ant-design/icons'
import { useState } from 'react';
// import { useRouter } from "next/navigation";

export default function Login() {

    const [inputs, setInputs] = useState<{ [key: string]: string }>({});


    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(inputs)

        if (!inputs.username || !inputs.password) {
            // setMsg('用户名和密码不能为空');
            return;
        }

        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...inputs, action: 'login'})
        })
        
        const data = await res.json();
        console.log(data)
        if(data.success) {
            // redirect('/')
            console.log('登录成功，页面跳转中~')
            window.location.href = '/'
        } else {
            // setMsg(data.message || '登录失败，请重试');
            console.log('登录失败')
        }
    }

    const handleInputChange = (key: string) =>  (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputs(prev => ({ ...prev, [key]: value }))

        // if (timers.current[key]) {
        //     clearTimeout(timers.current[key]);
        // }
        // timers.current[key] = setTimeout(() => {
        //     setInputs(prev => ({ ...prev, [key]: value }))
        // },300)
        
    }


    return (
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
                <label className='font-medium text-gray-600'>用户名</label>
                <div className='relative justify-center'>
                    <UserOutlined className='absolute text-gray-400 text-xl left-2 top-1/2 -translate-y-1/2' /> 
                    <input 
                        className='outline-none border border-gray-300 rounded-md p-3 w-full pl-10 placeholder:text-gray-400 ' 
                        placeholder='请输入用户名' 
                        onChange={handleInputChange('username')}
                    />
                </div>
            </div> 
            <div className="flex flex-col gap-2">
                <label className='font-medium text-gray-600'>密码</label>
                <div className='relative justify-center'>
                    <LockOutlined className='absolute text-gray-400 text-xl left-2 top-1/2 -translate-y-1/2' />
                    <input 
                        type='password'
                        className='outline-none border border-gray-300 rounded-md p-3 w-full pl-10 placeholder:text-gray-400 ' 
                        placeholder='请输入密码' 
                        onChange={handleInputChange('password')}
                    />
                </div>
            </div> 
            <div className='flex gap-2'>
                <input type='checkbox' className='p-1' />
                <label className='font-medium text-gray-600'>记住我</label>
            </div>
            <button className='bg-blue-600 text-white py-3 rounded-md hover:bg-blue-500 mb-2'>登录</button>
            <div className='relative border border-gray-200 my-4'>
                <span className='absolute font-light text-gray-500 text-sm top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white px-2'>或使用以下方式登录</span>
            </div>
            <div className='grid grid-cols-3 gap-4'>
                <button className='border border-gray-300 py-1 px-5 rounded-xl hover:bg-gray-100' >
                    <WechatOutlined className='text-green-400 text-2xl' />
                </button>
                <button className='border border-gray-300 py-1 px-5 rounded-xl hover:bg-gray-100' >
                    <QqOutlined className='text-blue-400 text-2xl' />
                </button>
                <button className='border border-gray-300 py-1 px-5 rounded-xl hover:bg-gray-100' >
                    <GithubOutlined className='text-xl' />
                </button>
            </div>
        </form>
    )
}