import { EditFilled, DeleteFilled } from "@ant-design/icons";
import type { TipsData } from "@/types/tips";
import TipInput from "./TipInput";
import DeleteTips from "../DeleteTips/DeleteTips";
import UpdateTips from "../UpdateTips/UpdateTips";
import { useState } from "react";


interface TipsItemsProps {
    tips: Array<{ id: number ,title: string, content: string, ExpireDate: Date, status: string, priority: string, create_time: Date, update_time: Date }>,
    handleTipsItemInputChange: (tip: TipsData) => void,
    user_id: number | null
    fetchTips: () => void
    setNotification: (type: "success" | "error" | "info", message: string) => void
}

type Priority = "high" | 'medium' | 'low';
const PRIORITY_LABEL: Record<Priority, string> = {
    high: '高',
    medium: '中',
    low: '低'
}

type Status = '已完成' | '未完成' | '已逾期';

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


export default function TipsItems({ tips, handleTipsItemInputChange, user_id, fetchTips, setNotification }: TipsItemsProps) {

    const [ showEditTips, setShowEditTips ] = useState<boolean>(false)
    const [ showDeleteTips, setShowDeleteTips ] = useState<boolean>(false)

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
                    onNotify={(type, message) => setNotification(type, message)}
                    fetchTips={fetchTips}
                /> 
            }
            
            { 
                showDeleteTips && 
                <DeleteTips 
                    show={showDeleteTips} 
                    onClose={() => setShowDeleteTips(false)} tipDelete={tipDelete} 
                    user_id={user_id}
                    onNotify={(type, message) => setNotification(type, message)}
                    fetchTips={fetchTips}
                /> 
            }

            
        </div>
    )
}