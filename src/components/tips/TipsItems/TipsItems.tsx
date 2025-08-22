import { EditFilled, DeleteFilled } from "@ant-design/icons";
import type { TipsData } from "@/types/tips";
import TipInput from "./TipInput";
import DeleteTips from "../DeleteTips/DeleteTips";
import UpdateTips from "../UpdateTips/UpdateTips";
import { useEffect, useState } from "react";
import Notification from '@/components/tips/Notification/Notification'

interface TipsItemsProps {
    tips: Array<{ id: number ,title: string, content: string, ExpireDate: Date, status: string, priority: string, create_time: Date, update_time: Date }>,
    handleTipsItemInputChange: (tip: TipsData) => void,
    user_id: number | null
    fetchTips: () => void
    
}

type Priority = "high" | 'medium' | 'low';
const PRIORITY_LABEL: Record<Priority, string> = {
    high: '高',
    medium: '中',
    low: '低'
}

type Status = '已完成' | '未完成' | '已逾期';
// const STATUS_BORDER_COLOR: Record<Status, string> = {
//     '已完成': 'border-green-500',
//     '未完成': 'border-blue-500',
//     '已逾期': 'border-red-500'
// }

const STATUS_COLOR: Record<Status, { borderColor: string, textColor: string }> = {
    '已完成': {
        borderColor: 'border-green-500',
        textColor: 'text-green-400'
    },
    '未完成': {
        borderColor: 'border-blue-500',
        textColor: 'text-blue-400'
    },
    '已逾期': {
        borderColor: 'border-red-500',
        textColor: 'text-red-400'
    }
}


export default function TipsItems({ tips, handleTipsItemInputChange, user_id, fetchTips }: TipsItemsProps) {

    const [ showEditTips, setShowEditTips ] = useState<boolean>(false)
    const [ showDeleteTips, setShowDeleteTips ] = useState<boolean>(false)

    // 显示通知（删除、更新tip后的提示）
    const [ notification, setNotification ] = useState<{
        show: boolean;
        type?: "success" | "error" | "info";
        message?: string
    }>({ show: false })

    const [ tipDelete, setTipDelete ] = useState<TipsData | null>(null)
    const [ tipEdit, setTipEdit ] = useState<TipsData | null>(null)

    function getDateTimeToString(date: Date) {
        const dateFormat = new Date(date)
        const date_year = dateFormat.getUTCFullYear();
        const date_month = String(dateFormat.getMonth() + 1).padStart(2, '0')
        const date_day = String(dateFormat.getUTCDate()).padStart(2, '0');

        return String(`${date_year}-${date_month}-${date_day}`)
    }

    


    return (
        <div className="space-y-4">
            { tips.length > 0 ? tips.map((tip, index) => (
                <div key={index} className={`bg-white rounded-xl p-4 border-l-8 ${STATUS_COLOR[tip.status as Status]['borderColor']} flex flex-col gap-2 hover:shadow-xl`}>
                    <div className="flex items-start justify-between">
                        <TipInput tip={tip} handleTipsItemInputChange={handleTipsItemInputChange}  />
                        
                        <div className="flex gap-5">
                            <span className={`${STATUS_COLOR[tip.status as Status]['textColor']} text-xs bg-gray-100 rounded-xl p-2`}>{tip.status}</span>
                            <button className="" onClick={(e) => {setShowEditTips(true); setTipEdit(tip)}}>
                                <EditFilled className="hover:cursor-pointer hover:bg-blue-500 hover:text-white hover:scale-110 bg-gray-200 p-2 rounded-full transition-transform" />
                            </button>
                            <button className="" onClick={(e) => {setShowDeleteTips(true); setTipDelete(tip)}}>
                                <DeleteFilled className="hover:cursor-pointer hover:bg-red-500 hover:text-white hover:scale-110 bg-gray-200 p-2 rounded-full transition-transform" />
                            </button>
                        </div>      
                    </div>
                    <p className="pl-7 font-thin text-sm">{tip.content}</p>
                    <div className="pl-7 flex gap-4">
                        <span className="font-thin text-xs">截止于 {getDateTimeToString(tip.ExpireDate)}</span>
                        <span className="font-thin text-xs">{PRIORITY_LABEL[tip.priority as Priority]} 优先级</span>
                    </div>
                </div>
            )) : (
                <div className="text-gray-500 text-center">暂无任务</div>
            )}
            
            { 
                showEditTips && 
                <UpdateTips 
                    show={showEditTips} 
                    onClose={() => setShowEditTips(false)} 
                    user_id={user_id} 
                    tipEdit={tipEdit}
                    onNotify={(type, message) => setNotification({ show: true, type, message })}
                    fetchTips={fetchTips}
                /> 
            }
            
            { 
                showDeleteTips && 
                <DeleteTips 
                    show={showDeleteTips} 
                    onClose={() => setShowDeleteTips(false)} tipDelete={tipDelete} 
                    user_id={user_id}
                    onNotify={(type, message) => setNotification({ show: true, type, message })}
                    fetchTips={fetchTips}
                /> 
            }

            
            {/* 提示弹窗 */}
            { 
                notification && 
                <Notification 
                    show={notification.show} 
                    type={notification.type} 
                    message={notification.message} 
                    closeNotification={() => setNotification({ ...notification, show: false })} 
                /> 
            }
            
        </div>





        // <div className="space-y-4">
        //     <div className="bg-white rounded-xl p-4 border-l-8 border-blue-500 flex flex-col gap-2 hover:shadow-xl">
        //         <div className="flex items-start justify-between">
        //             <label className="flex gap-2 text-xl items-center">
        //                 <input type="checkbox" className="w-5 h-5"/>
        //                 完成季度工作报告
        //             </label>
        //             <div className="flex gap-5">
        //                 <span className="text-green-400 text-sm bg-gray-100 rounded-xl p-1 pl-2 pr-2">未完成</span>
        //                 <button className="" onClick={handleTipsEdit}>
        //                     <EditFilled className="hover:cursor-pointer bg-gray-200 p-2 rounded-full hover:bg-gray-300" />
        //                 </button>
        //                 <button className="" onClick={handleTipsDelete}>
        //                     <DeleteFilled className="hover:cursor-pointer bg-gray-200 p-2 rounded-full hover:bg-gray-300" />
        //                 </button>
        //             </div>
        //         </div>
        //         <p className="pl-7 font-thin text-sm">需要汇总本季度销售数据并撰写分析报告</p>
        //         <div className="pl-7 flex gap-4">
        //             <span className="font-thin text-xs">截止于 今天</span>
        //             <span className="font-thin text-xs">高优先级</span>
        //         </div>
        //     </div>

        //     <div className="bg-white rounded-xl p-4 border-l-8 border-green-500 flex flex-col gap-2 hover:shadow-xl">
        //         <div className="flex items-start justify-between">
        //             <label className="flex gap-2 text-xl items-center">
        //                 <input type="checkbox" className="w-5 h-5" checked/>
        //                 制定下月工作计划
        //             </label>
        //             <div className="flex gap-5">
        //                 <span className="text-green-400 text-sm bg-gray-100 rounded-xl p-1 pl-2 pr-2">已完成</span>
        //                 <EditFilled className="hover:cursor-pointer bg-gray-200 p-2 rounded-full hover:bg-gray-300" />
        //                 <DeleteFilled className="hover:cursor-pointer bg-gray-200 p-2 rounded-full hover:bg-gray-300" />
        //             </div>
        //         </div>
        //         <p className="pl-7 font-thin text-sm">规划下个月的工作</p>
        //         <div className="pl-7 flex gap-4">
        //             <span className="font-thin text-xs">截止于 本周五</span>
        //             <span className="font-thin text-xs">中优先级</span>
        //         </div>
        //     </div>

        //     <div className="bg-white rounded-xl p-4 border-l-8 border-red-500 flex flex-col gap-2 hover:shadow-xl">
        //         <div className="flex items-start justify-between">
        //             <label className="flex gap-2 text-xl items-center">
        //                 <input type="checkbox" className="w-5 h-5"/>
        //                 处理工作邮件
        //             </label>
        //             <div className="flex gap-5">
        //                 <span className="text-red-400 text-sm bg-gray-100 rounded-xl p-1 pl-2 pr-2">已逾期</span>
        //                 <EditFilled className="hover:cursor-pointer bg-gray-200 p-2 rounded-full hover:bg-gray-300" />
        //                 <DeleteFilled className="hover:cursor-pointer bg-gray-200 p-2 rounded-full hover:bg-gray-300" />
        //             </div>
        //         </div>
        //         <p className="pl-7 font-thin text-sm">处理工作邮件</p>
        //         <div className="pl-7 flex gap-4">
        //             <span className="font-thin text-xs">截止于 昨天</span>
        //             <span className="font-thin text-xs">中优先级</span>
        //         </div>
        //     </div>
            
        // </div>
    )
}