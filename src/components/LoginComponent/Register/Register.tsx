'use client';
import { UserOutlined, LockOutlined, MailFilled, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function Register() {

    const [ inputPasswd, setInputPasswd ] = useState<boolean>(true)
    const [ confirmInputPasswd, setConfirmInputPasswd ] = useState<boolean>(true)

    const [inputs, setInputs] = useState<{ [key: string]: string}>({})

    const router = useRouter();

    const handleInputChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputs(prev => ({ ...prev, [key]: value }))
        // if (timers.current[key]) {
        //     clearTimeout(timers.current[key]);
        // }
        // timers.current[key] = setTimeout(() => {
        //     setInputs(prev => ({ ...prev, [key]: value }))
        // }, 300);
    }

    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('注册表单提交', inputs);

        if (!inputs.username || !inputs.email || !inputs.password || !inputs.confirmPassword) {
            // setMsg('用户名、邮箱和密码不能为空');
            console.log('用户名、邮箱和密码不能为空')
            return;
        }

        if (inputs.password !== inputs.confirmPassword) {
            console.log("两次输入的密码不一致");
            return;
        }

        // 检查输入合法性：用户名、邮箱是否已存在、邮箱格式是否正确、密码长度等
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...inputs, action: 'register'}),
        })

        const data = await res.json();
        if (data.success) {
            // 注册成功，跳转到登录页面
            console.log('注册成功，页面跳转中~');
            // setMsg(null);
            // router.push('/login');
            window.location.href = '/login';
        } else {
            // 注册失败，显示错误信息
            // setMsg(data.message || '注册失败，请重试');
            console.log('注册失败');
        }
    }


    return (
        <form className='flex flex-col gap-4' onSubmit={handlerSubmit}>
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
                <label className='font-medium text-gray-600'>邮箱</label>
                <div className='relative justify-center'>
                    
                    <MailFilled className='absolute text-gray-400 text-xl left-2 top-1/2 -translate-y-1/2' />
                    <input 
                        className='outline-none border border-gray-300 rounded-md p-3 w-full pl-10 placeholder:text-gray-400 ' 
                        placeholder='请输入邮箱地址' 
                        onChange={handleInputChange('email')}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label className='font-medium text-gray-600'>密码</label>
                <div className='relative justify-center'>
                    <LockOutlined className='absolute text-gray-400 text-xl left-2 top-1/2 -translate-y-1/2' />
                    <input 
                        type={inputPasswd ? 'password' : ''}
                        className='outline-none border border-gray-300 rounded-md p-3 w-full pl-10 placeholder:text-gray-400 ' 
                        placeholder='请设置密码' 
                        onChange={handleInputChange('password')}
                    />
                    <button className='absolute top-1/2 -translate-y-1/2 right-3' onClick={() => setInputPasswd(!inputPasswd)}>
                        { 
                            inputPasswd ? 
                            <EyeInvisibleOutlined className=' text-gray-400 text-lg hover:text-gray-600' /> : 
                            <EyeOutlined className=' text-gray-400 text-lg hover:text-gray-600' /> 
                        }
                    </button>
                </div>
            </div> 
            <div className="flex flex-col gap-2">
                <label className='font-medium text-gray-600'>确认密码</label>
                <div className='relative justify-center'>
                    <LockOutlined className='absolute text-gray-400 text-xl left-2 top-1/2 -translate-y-1/2' />
                    <input 
                        type={confirmInputPasswd ? 'password' : ''}
                        className='outline-none border border-gray-300 rounded-md p-3 w-full pl-10 placeholder:text-gray-400 ' 
                        placeholder='请再次输入密码' 
                        onChange={handleInputChange('confirmPassword')}
                    />
                    <button className='absolute top-1/2 -translate-y-1/2 right-3' onClick={() => setConfirmInputPasswd(!confirmInputPasswd)}>
                        { 
                            confirmInputPasswd ? 
                            <EyeInvisibleOutlined className=' text-gray-400 text-lg hover:text-gray-600' /> : 
                            <EyeOutlined className=' text-gray-400 text-lg hover:text-gray-600' /> 
                        }
                    </button>
                </div>
            </div> 
            <button className='bg-blue-600 text-white py-3 rounded-md hover:bg-blue-500 mt-2'>注册</button>
        </form>
    )
}