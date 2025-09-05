'use client';
import ReactDOM  from "react-dom";
import { useEffect, useState, useRef } from "react";
import { CloseCircleFilled } from '@ant-design/icons';
import type { TipsData } from "@/types/tips";
import { type } from "node:os";



interface UpdateTipsProps {
    show: boolean;
    onClose: () => void;
    user_id: number | null
    tipEdit: TipsData | null;
    onNotify: (type: "success" | "error" | "info", message: string) => void
    fetchTips: () => void
}


export default function UpdateTips({ show, onClose, user_id, tipEdit, onNotify, fetchTips }: UpdateTipsProps) {

    const [ updateTip, setUpdateTip ] = useState<TipsData | null>(null)
    
    function getChangedFields<T extends object>(original: T, updated: T): Partial<T> {
        const changed: Partial<T> = {};

        (Object.keys(updated) as Array<keyof T>).forEach(key => {
            const originalValue = original[key]
            const updatedValue = updated[key]

            if (updatedValue !== originalValue) {
                changed[key] = updatedValue;
            }
        })

        return changed;
    }

    function getDateTimeToString(date: Date) {
        const dateFormat = new Date(date)
        const date_year = dateFormat.getUTCFullYear();
        const date_month = String(dateFormat.getMonth() + 1).padStart(2, '0')
        const date_day = String(dateFormat.getUTCDate()).padStart(2, '0');

        return String(`${date_year}-${date_month}-${date_day}`)
    }
    
    const tip = {
        ...updateTip,
        ExpireDate: updateTip?.ExpireDate ? getDateTimeToString(updateTip?.ExpireDate) : ""
    }

    

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name,value } = e.target;

        console.log("更改的字段: ", name, "类型： ", typeof name)
        console.log(value)

        setUpdateTip(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: name === "ExpireDate" ? new Date(value) : value
            }
        })
            
    }

    const handleUpdateTipsForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updateFromData = new FormData(e.currentTarget);
        const title = updateFromData.get('title') as string;
        const content = updateFromData.get('content') as string;
          

        if (!title || !content) {
            onNotify("error", "请填写信息")
            return;
        }

        if (tipEdit && updateTip) {
            const updateData = getChangedFields(tipEdit, updateTip)

            try {
                const res = await fetch(`/api/tips/${tip?.id}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ updateData, user_id })
                })

                const data = await res.json();
                if(data?.success) {
                    onNotify("success", "更新任务成功")
                    onClose();       
                    fetchTips();   // 通知父组件刷新

                }

            } catch (error) {
                onNotify("error", "更新任务失败")
            }
        }



    }
    
    useEffect(() => {
        setUpdateTip(tipEdit)
    }, [tipEdit])


    if (!tipEdit) return null;

    return (
        ReactDOM.createPortal(
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
                <div className="bg-white w-full max-w-md rounded-2xl mx-4" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 flex justify-between border-b border-gray-200">
                        <h3 className="font-bold">编辑任务</h3>
                        <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                            <CloseCircleFilled className="text-xl"/>
                        </button>
                    </div>
                    <div className="p-6">
                        <form className="space-y-5" onSubmit={handleUpdateTipsForm}>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">任务标题</label>
                                <input 
                                    className="border border-gray-300 rounded-xl outline-none p-3 focus:border-blue-600 focus:ring-2" 
                                    placeholder="输入任务标题"
                                    name="title"
                                    value={tip?.title ?? ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">任务描述</label>
                                <textarea 
                                    className="border border-gray-300 rounded-xl outline-none p-3 focus:border-blue-600 focus:ring-2" 
                                    placeholder="输入任务详情描述" 
                                    name="content"
                                    value={tip?.content ?? ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">截止日期</label>
                                <input 
                                    type="date" 
                                    className="border border-gray-300 rounded-xl p-2 outline-none focus:border-blue-600 focus:ring-2 w-1/2"
                                    name="ExpireDate"
                                    value={tip?.ExpireDate.toString() ?? ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex-col gap-2">
                                    <span className="text-sm">优先级</span>
                                    <div className="flex gap-3 py-2">
                                        <label className="flex gap-2">
                                            <input type="radio" name="priority" value="low" checked={tip.priority === 'low'} onChange={handleChange} />
                                            低
                                        </label>
                                        <label className="flex gap-2">
                                            <input type="radio" name="priority" value="medium"  checked={tip.priority === 'medium'} onChange={handleChange} />
                                            中
                                        </label>
                                        <label className="flex gap-2">
                                            <input type="radio" name="priority" value="high" checked={tip.priority === 'high'} onChange={handleChange} />
                                            高
                                        </label>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm">状态</label>
                                    <select 
                                        id="taskStaus" 
                                        className="border border-gray-300 outline-none px-4 py-2 rounded-xl mb-4" 
                                        name="status"
                                        value={tip.status ?? ""}
                                        onChange={handleChange}
                                    >
                                        <option value="未完成">未完成</option>
                                        <option value="已完成">已完成</option>
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
                </div>
            </div>,
            document.body
        )
    )
}

