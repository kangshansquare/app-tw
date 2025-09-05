'use client';
import ReactDOM from 'react-dom'
import React, { useState } from "react";
import { CloseCircleFilled, WarningFilled } from '@ant-design/icons'
import type { TipsData } from '@/types/tips';
import Notification from '../../Notification/Notification';

interface DeleteTipsProps {
    show: boolean;
    onClose: () => void;
    tipDelete: TipsData | null
    onNotify: (type: "success" | "error" | "info", message: string)  => void
    user_id: number | null
    fetchTips: () => void                 
}

export default function DeleteTips({ show, onClose, tipDelete, onNotify, user_id, fetchTips }: DeleteTipsProps) {

    const [ showNotification, setShowNotification ] = useState<boolean>(false)

    const handleDelete = async () => {
        // e.stopPropagation();
        // 删除tip
        if (tipDelete?.id === null || user_id === null) return;
        try {
            const res = await fetch(`/api/tips/${tipDelete?.id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user_id })
            })
            const data = await res.json();
            if (data?.success) {
                
                onNotify("success", "任务已成功删除")  
                onClose();       
                setShowNotification(false)
                fetchTips()   // 删除成功，通知父组件刷新
            } else {
                console.log("删除失败！")
            }

        } catch (error) {
            console.log("网络失败~")
        }

       
    }
    
    return (
        ReactDOM.createPortal(
            <div className='fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center' onClick={onClose}>
                <div className='bg-white w-full max-w-md rounded-2xl mx-4' onClick={(e) => e.stopPropagation()}>
                    <div className='p-6 flex justify-between border-b border-gray-200'>
                        <h3 className='font-bold text-xl text-red-500'>确认删除</h3>
                        <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                            <CloseCircleFilled className="text-xl"/>
                        </button>
                    </div>
                    <div className='p-6'>
                        <div className='flex items-start gap-4'> 
                            <div className=''>
                                <WarningFilled  className='text-red-500'/>
                            </div>
                            <div className='flex flex-col gap-4'>
                                <p className="font-medium text-xl">您确定要删除这个任务吗？</p>
                                <span className='font-light text-sm'>您确定要删除 <strong className='font-semibold'>{tipDelete?.title}</strong> 吗？此操作无法撤销，任务数据将被永久删除。</span>
                            </div>
                            
                        </div>
                    </div>
                    <div className='p-6 flex justify-end gap-4'>
                        <button  className='p-2 px-4 border border-gray-200 rounded-md hover:bg-gray-100' onClick={onClose}>取消</button>
                        <button 
                            className='p-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-400'
                            onClick={handleDelete}
                        >
                            确认删除
                        </button>
                    </div>
                </div>
                { showNotification && <Notification  show={showNotification} closeNotification={() =>setShowNotification(false)} type='success' message='删除成功' /> }
            </div>,
            document.body
        )
    )
}