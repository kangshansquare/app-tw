'use client';

import { PlusSquareFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import CreateTips from "./CreateTips/CreateTips";
import TipCards from "./TipsCards/Tips";
import TipsItems from "./TipsItems/TipsItems";



export default  function Tips() {

    const [ tips, setTips] = useState<Array<{ title: string, content: string, ExpireDate: Date, status: string, priority: string }>>([]);

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

    const user_id = getUserId();

        
    const [ showCreateTips, setShowCreateTips ] = useState<boolean>(false)


    const handleCreateTips: React.MouseEventHandler<HTMLButtonElement> = () => {
        console.log("Create Tips~")
        setShowCreateTips(true)
    }

    const handleLoadTips = () => {
        console.log("Load more tips~")
    }

    useEffect(() => {
        console.log("Tips:", tips);
        const fetchTips = async () => {
            const res = await fetch('/api/tips?page=4', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json();
            if (data?.success) {
                setTips(data.tips);
            }
        }
        fetchTips();
    }, [tips])

    

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

            { showCreateTips && <CreateTips  show={showCreateTips} onClose={() => setShowCreateTips(false)} /> }

            <TipCards />

            <div className="flex justify-start gap-5">
                <button className="outline-none p-2 pl-4 pr-4 bg-btn-primary text-white rounded-xl">全部</button>
                <button className="outline-none p-2 pl-4 pr-4 bg-white hover:bg-yellow-100 transition-colors rounded-xl">待完成</button>
                <button className="outline-none p-2 pl-4 pr-4 bg-white hover:bg-teal-100 transition-colors rounded-xl">已完成</button>
                <button className="outline-none p-2 pl-4 pr-4 bg-white hover:bg-red-100 transition-colors rounded-xl">已逾期</button>
            </div>

            <TipsItems tips={tips} />

            <div className="flex items-center justify-center mt-5">
                <button 
                    className={`border-gray-300 border bg-white p-3 pl-8 pr-8 rounded-2xl hover:bg-gray-100 ${tips.length === 0 ? "disabled:cursor-not-allowed" : ""}`} 
                    onClick={handleLoadTips}
                    disabled={tips.length === 0}
                >
                    加载更多
                </button>
            </div>
        </div>
    )
}