'use client';

import { PlusSquareFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import CreateTips from "./CreateTips/CreateTips";
import TipCards from "./TipsCards/Tips";
import TipsItems from "./TipsItems/TipsItems";

import Notification from "@/components/Notification/Notification";


import type { TipsData } from "@/types/tips";


export default  function Tips() {

    const [ notification, setNotification ] = useState<{ show: boolean, type?: "success" | "error" | "info", message?: string }>({ show: false })
    const onNotify = (type: "success" | "error" | "info", message: string) => {
        setNotification({show: true, type, message })
    }

    const [ tips, setTips] = useState<Array<TipsData>>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false)

    const getUserId = async () => {
        const res = await fetch('/api/user/get-id', {
            method: 'GET',
            credentials: 'include'
        })

        const data = await res.json();
        if (data?.success) {
            console.log("获取用户ID成功:", data.userId);
            return data.userId;
        }
    }

    useEffect(() => {
        const fetchUserId = async () => {
            const user_id = await getUserId();
            
            if (typeof user_id === 'number') {
                setUserId(user_id);
            }
        };

        fetchUserId();
    }, [])

    // 点击button显示4种状态的tip：all（全部）、pending（待完成）、done(已完成)、expired（已逾期）
    const [ currentButton, setCurrentButton ] = useState<'all' | 'pending' | 'done' | 'expired'>('all')
    const filteredTips = tips.filter(tip => {
        if (currentButton === 'all') return true;
        if (currentButton === 'pending') return tip.status === '未完成';
        if (currentButton === 'done') return tip.status === '已完成';
        if (currentButton === 'expired') return tip.status === '已逾期';

        return true;
    })
    

    const handleTipsItemInputChange =  async (tip: TipsData) => {

        if (!tip.id || userId === null) return;

        const tipWithUserId = { ...tip, user_id: userId }

        console.log("父组件接收的tips: ", tip)
        // 更新tip
        try {
            const res = await fetch(`/api/tips/${tip.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ updateData: tip, user_id: userId })
            });
            const data = await res.json();
            if (data?.success) {
                fetchTips();
            } else {
                console.log("更新失败~")
            }

        } catch (error) {
            console.log("更新异常", error)
        }
        
        
    }

        
    const [ showCreateTips, setShowCreateTips ] = useState<boolean>(false)


    const handleCreateTips: React.MouseEventHandler<HTMLButtonElement> = () => {
        console.log("Create Tips~")
        setShowCreateTips(true)
    }

    const handleLoadTips = () => {
        console.log("Load more tips~")
    }

    const fetchTips = async () => {
        if (userId === null) return;

        setIsLoading(true)

        try {
            const res = await fetch(`/api/tips?user_id=${userId}`, {
                method: 'GET',
                credentials: 'include',
                
            })
            const data = await res.json();
            
            if (data?.success) {
                setTips(data.tips);
            }
        } catch(error) {
            onNotify("error", "网络错误")
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        fetchTips();
    }, [userId])

    

    return (
        <div className="flex flex-col p-8 bg-gray-100 w-full h-full gap-5 overflow-auto">
            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-2xl">我的任务</h1>
                    <span>管理您的日常提醒和待办事项</span>
                </div>
                <div className="flex items-center justify-center">
                    <button className="flex items-center gap-1 outline-none bg-teal-400 p-3 rounded-lg" onClick={handleCreateTips}>
                        <PlusSquareFilled className="text-lg text-white" />
                        <span className="font-thin text-white">添加新任务</span>
                    </button>
                </div>
            </div>

            { 
                showCreateTips && 
                <CreateTips  
                    show={showCreateTips} 
                    onClose={() => setShowCreateTips(false)} 
                    user_id={userId} 
                    onCreated={fetchTips}
                    onNotify={(type,message) => setNotification({show: true, type, message })}
                    // onNotify={onNotify}
                /> 
            }

            <TipCards tips={tips} />

            <div className="flex justify-start gap-5">
                <button 
                    className="outline-none p-2 pl-4 pr-4 bg-btn-primary text-white rounded-xl"
                    onClick={() => setCurrentButton('all')}
                >
                    全部
                </button>
                <button 
                    className="outline-none p-2 pl-4 pr-4 bg-yellow-500 text-white hover:bg-yellow-400 transition-colors rounded-xl"
                    onClick={() => setCurrentButton('pending')}
                >
                    待完成
                </button>
                <button 
                    className="outline-none p-2 pl-4 pr-4 bg-teal-500 text-white hover:bg-teal-400 transition-colors rounded-xl"
                    onClick={() => setCurrentButton('done')}
                >
                    已完成
                </button>
                <button 
                    className="outline-none p-2 pl-4 pr-4 bg-red-500 text-white hover:bg-red-400 transition-colors rounded-xl"
                    onClick={() => setCurrentButton('expired')}
                >
                    已逾期
                </button>
            </div>

            {
                isLoading ? (
                    <div className='flex-1 flex items-center justify-center h-[400px]'>
                        <div className='flex flex-col items-center gap-4'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                            <span className='text-gray-500'>加载中....</span>
                        </div>
                    </div>
                ) : (
                    <TipsItems 
                        tips={filteredTips}  
                        user_id={userId} 
                        handleTipsItemInputChange={handleTipsItemInputChange} 
                        fetchTips={fetchTips}
                        setNotification={(type, message) => setNotification({ show: true, type, message })}
                    />
                )
            }

            <div className="flex items-center justify-center mt-5">
                <button 
                    className={`border-gray-300 border bg-white p-3 pl-8 pr-8 rounded-2xl hover:bg-gray-100 ${tips.length === 0 ? "disabled:cursor-not-allowed" : ""}`} 
                    onClick={handleLoadTips}
                    disabled={tips.length === 0}
                >
                    加载更多
                </button>
            </div>

            {/* 新增、更新、删除任务 提醒 */}
            { 
                notification &&
                <Notification  
                    show={notification.show}
                    type={notification.type}
                    message={notification.message}
                    closeNotification={() => setNotification({...notification, show: false})}
                />             
            }

        </div>
    )
}