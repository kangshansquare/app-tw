'use client';
import ReactDOM  from "react-dom";
import { CloseCircleFilled } from '@ant-design/icons';
import { useState } from "react";
import { TipsData } from "@/types/tips";





interface CreateTipsProps {
    show: boolean
    onClose: () => void
    user_id: number | null
    onCreated: () => void
    onNotify: ( type: "success" | "error" | "info", message: string ) => void
    
}

export default function CreateTips({ show, onClose, user_id, onCreated, onNotify }: CreateTipsProps) {

    const [ messages, setMessages ] = useState<string | null>(null)
    

    const closeModel = (e: React.MouseEvent<HTMLDivElement> ) => {
        if (e.target === e.currentTarget) onClose();
    }

    const [ error, setError ] = useState<{ [key: string]: boolean }>({})

    const [ defaultFromData, setDefaultFormData ] = useState<Partial<TipsData>>({})

    const handleChaneg = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;
        console.log('-----', name, value)
        setDefaultFormData(prev => ({
            ...prev,
            [name]: name === 'ExpireDate' ? (value ? new Date(value) : null) : value
        }))
        if (error[name]) setError(prev => ({ ...prev, [name]: false }))
        
    }

    const handleCreateTipsForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const requiredFields = ['title', 'content', 'ExpireDate', 'status'];
        const nextError: { [key: string]: boolean } = {};
        requiredFields.forEach(f => {
            const v = (defaultFromData as any)[f];
            if (!v || (v instanceof Date && isNaN(v.getTime()))) nextError[f] = true
        })

        if (Object.keys(nextError).length > 0) {
            setError(nextError);
            return;
        }

        try {
            const res = await fetch('/api/tips', {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                // body: JSON.stringify({ title, content, ExpireDate, priority, status, user_id })
                body: JSON.stringify({ tip: defaultFromData, user_id })
            })

            const data = await res.json();

            if (data?.success) {
                
                if (onCreated) onCreated();    // 新增，通知父组件刷新

                setTimeout(() => {
                    // setMessages(null);
                    onNotify("success", "创建成功")
                    onClose();
                    
                }, 500)

            } else {
                onNotify("error", "创建失败，请重试！")
            }

        } catch (eror) {
            onNotify("error", "网络错误")
        }
        
    }
    

    return (
        ReactDOM.createPortal(
            <div id="taskModel" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={closeModel}>
                <div className="bg-white w-full max-w-md rounded-2xl mx-4" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 flex justify-between border-b border-gray-200">
                        <h3 className="font-bold">添加新任务</h3>
                        <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                            <CloseCircleFilled className="text-xl"/>
                        </button>
                    </div>
                    <div className="p-6">
                        <form className="space-y-5" onSubmit={handleCreateTipsForm}>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">任务标题</label>
                                <input 
                                    className={`border ${error.title ? "border-red-300" : "border-gray-300"} rounded-xl outline-none p-3 focus:border-blue-600 focus:ring-2`} placeholder="输入任务标题"
                                    name="title"
                                    onChange={handleChaneg}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">任务描述</label>
                                <textarea 
                                    className={`border ${error.content ? "border-red-300" : "border-gray-300"} rounded-xl outline-none p-3 focus:border-blue-600 focus:ring-2`} placeholder="输入任务详情描述" 
                                    name="content"
                                    onChange={handleChaneg}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">截止日期</label>
                                <input 
                                    type="date" 
                                    className={`border ${error.ExpireDate ? "border-red-300" : "border-gray-300"} rounded-xl p-2 outline-none focus:border-blue-600 focus:ring-2 w-1/2`}
                                    name="ExpireDate"
                                    onChange={handleChaneg}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex-col gap-2">
                                    <span className="text-sm">优先级</span>
                                    <div className="flex gap-3 py-2">
                                        <label className="flex gap-2">
                                            <input type="radio" name="priority" value="low" onChange={handleChaneg} />
                                            低
                                        </label>
                                        <label className="flex gap-2">
                                            <input type="radio" name="priority" value="medium" defaultChecked onChange={handleChaneg} />
                                            中
                                        </label>
                                        <label className="flex gap-2">
                                            <input type="radio" name="priority" value="high" onChange={handleChaneg} />
                                            高
                                        </label>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm">状态</label>
                                    <select id="taskStaus" className={`border ${error.status ? "border-red-300" : "border-gray-300"} outline-none px-4 py-2 rounded-xl mb-4`} name="status" onChange={handleChaneg}>
                                        <option value="">请选择状态</option>
                                        <option value="pending">未完成</option>
                                        <option value="done">已完成</option>
                                        <option value="expired">已逾期</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button className="border border-gray-200 p-2 px-5 rounded-xl" onClick={onClose}>取消</button>
                                <button 
                                    className="bg-btn-primary p-2 px-5 rounded-xl text-white"
                                >
                                    保存任务
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* <div className="text-center min-h-10 mb-2">
                        { messages && <p className="text-red-400">{messages}</p> }
                    </div> */}
                    
                </div>
                
            </div>,
            document.body
        )
        
    )
}