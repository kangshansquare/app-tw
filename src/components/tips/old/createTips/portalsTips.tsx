'use client';

import ReactDOM from "react-dom";
import { useMemo, useState } from "react";
import { Calendar } from "@deemlol/next-icons";

import SubDatePortal from "./datePortal/datePortal";


interface PorttalProps {
    show: boolean
    onClose: () => void
    
}

export default function PorttalsTips({ show, onClose }: PorttalProps) {
    

    const [selectedDate, setSelectedDate] = useState<{year: number, month: number, date: number} | null>(null)

    const handleOtherDateChange = (date: {year: number, month: number, date: number}) => {
        console.log('子组件选择的日期', date)
        setSelectedDate(date)
    }

    
    const todayStr = new Date().toLocaleDateString().replace(/\//g, '-')
    const tomorrowDate = new Date()
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toLocaleDateString().replace(/\//g, '-');
    const otherDateStr = useMemo(() => {
        return selectedDate ? 
            `${selectedDate.year}-${selectedDate.month}-${selectedDate.date}` : 
            "";
    }, [selectedDate])

    const initialDateInfo = [
        {key: 'today', label: '今天', selected: false},
        {key: 'tomorrow', label: '明天', selected: false},
        {key: 'otherDate', label: '其他日期', selected: false},
    ]
    const [dateInfo, setDateInfo] = useState<{key: string, label: string, selected: boolean}[]>(initialDateInfo)

    const handleDate = (key: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
        
        setDateInfo(prev => 
            prev.map(item =>
                item.key === key ?
                    { ...item, label: key === 'today' ? '今天 18:00 截止' : key === 'tomorrow' ? '明天 18:00 截止' : item.label, selected: true } :
                    { ...item, selected: false }
            )
        )
        if (key === 'otherDate') setShowDatePicker(true)
        

    }

    const handleResetDate = () => {
        setDateInfo(initialDateInfo)
    }

    // DatePicker
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);



    const [tipsInputs, setTipsInput] = useState<{[ key: string ]: string}>({})
    const handleInputs = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setTipsInput(prev => ({...prev, [key]: value}))
    }
   
    

    const handleCreateTips = (e: React.MouseEvent<HTMLButtonElement>) => {
        const d = dateInfo.find(i => i.selected)
        const ExpireDate = selectedDate ? otherDateStr : d?.key === 'today' ? todayStr : tomorrowStr
        const title = tipsInputs['tipsName'];
        const content = tipsInputs['tipsDescription']

        console.log('Title: ', title)
        console.log('Content: ', content)
        console.log('ExpireDate: ', ExpireDate)
        console.log("创建Tips")
        // 插入数据库


        // 关闭弹窗
        onClose()
        // 显示最新创建的tips
        
    }



    if (!show) {
        return null;
    }

    return (
        ReactDOM.createPortal(
            <main  >
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,.5)]"></div>
                <div id="sub-datePortal" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white  p-3 rounded-md w-1/3">
                    <div className="flex justify-between mb-5">
                        <h3 className="font-bold">新建Tips</h3>
                        <div 
                            className="text-gray-500 hover:cursor-pointer pl-2 pr-2 hover:bg-gray-300" 
                            onClick={onClose}>&Chi;</div>
                    </div>
                    <div className="flex flex-col gap-8 p-2">
                        
                        <div className="flex gap-5 items-center">
                            <label htmlFor="name" className="w-16">名称</label>
                            <input type="text" 
                                className="outline-none border border-gray-300 rounded-md w-[80%] p-1"
                                onChange={handleInputs("tipsName")}
                            />
                        </div>
                        <div className="flex gap-5 items-center">
                            <label htmlFor="content" className="w-16">描述</label>
                            <input type="text" 
                                className="outline-none border border-gray-300 rounded-md w-[80%] p-1"
                                onChange={handleInputs("tipsDescription")}    
                            />
                            
                        </div>
                        <div className="flex gap-5 items-center">
                            <label htmlFor="date" className="w-16">截止日期</label>
                            

                            {selectedDate ? (
                                <div 
                                    key='otherDate' 
                                    className="flex gap-2 items-center justify-between border border-gray-200 rounded-md p-2 hover:bg-gray-200 relative bg-teal-100"
                                >
                                    <Calendar size={14} />
                                    <button 
                                        className="outline-none text-sm text-[rgba(0,0,0,.5)]"
                                        onClick={handleDate('otherDate')}
                                    >
                                        {`${selectedDate.year}-${selectedDate.month}-${selectedDate.date} 18:00 截止`}
                                    </button>
                                    <span
                                        className="hover:cursor-pointer text-sm text-gray-400"
                                        onClick={() => {
                                            setSelectedDate(null);
                                            setDateInfo(initialDateInfo)
                                        }}
                                    >
                                        x
                                    </span>
                                </div>
                            ) : (
                                    dateInfo.map(item => {
                                    // 选中 today 或 tomorrow，只显示选中的
                                    if (
                                        (dateInfo.find(i => i.key === 'today')?.selected && item.key === 'today') ||
                                        (dateInfo.find(i => i.key === 'tomorrow')?.selected && item.key === 'tomorrow') 
                                    ) {
                                        return (
                                            <div 
                                                key={item.key} 
                                                className="flex gap-2 items-center justify-between border border-gray-200 rounded-md p-2 hover:bg-gray-200 relative">
                                                <Calendar size={14} />
                                                <button
                                                    className="outline-none text-sm text-[rgba(0,0,0,.5)]"
                                                    onClick={handleDate(item.key)}
                                                >
                                                    {item.label}
                                                </button>
                                                <span className="hover:cursor-pointer text-sm text-gray-400" onClick={handleResetDate}>x</span>
                                            </div>
                                        );
                                    }
                                    // 选中 otherDate 或初始状态，全部显示
                                    if (
                                        (dateInfo.find(i => i.key === 'otherDate')?.selected ||
                                        dateInfo.every(i => !i.selected))
                                    ) {
                                        // const otherDateLabel = selectedDate ? `${selectedDate.year}-${selectedDate.month}-${selectedDate.date} 18:00 截止` : item.label
                                        return (
                                            <div 
                                                key={item.key} 
                                                className={`flex gap-2 items-center justify-between border border-gray-200 rounded-md p-2 hover:bg-gray-200 relative ${item.selected ? 'bg-teal-100' : ''}`}>
                                                <Calendar size={14} />
                                                <button
                                                    className="outline-none text-sm text-[rgba(0,0,0,.5)]"
                                                    onClick={handleDate(item.key)}
                                                >
                                                    {/* {item.label === '其他日期' ? otherDateLabel : item.label} */}
                                                    {item.label}
                                                </button>
                                                {/* {item.selected && (
                                                    <span className="hover:cursor-pointer text-sm text-gray-400" onClick={handleResetDate}>x</span>
                                                )} */}
                                            </div>
                                        );
                                    }
                                    return null;
                                })
                            )}


                            { showDatePicker &&  <SubDatePortal showSubPortal={showDatePicker} onCloseSubPortal={() => setShowDatePicker(false)} onOtherDateChange={handleOtherDateChange} />}

                            

                        </div>
                        <div className="flex gap-5 items-center">
                            <span className="w-16">通知方式</span>
                            <div className="flex gap-2">
                                <input 
                                    type="checkbox" 
                                    className="outline-none" 
                                    defaultChecked={true}
                                    // onChange={() => setDingdingChecked(dingdingChecked === true ? false : true)}
                                />
                                <label>钉钉机器人</label>
                            </div>
                            
                        </div>
                        
                        <div className="min-h-6"></div>  
                        
                        <div className="flex justify-end gap-4">
                            <button 
                                className="outline-none p-2 pl-4 pr-4 border border-gray-300 rounded-md hover:bg-gray-50"
                                onClick={onClose}
                            >
                                取消
                            </button>
                            <button 
                                type="submit" 
                                className={`outline-none p-2 pl-4 pr-4 rounded-md text-white  
                                            ${!tipsInputs["tipsName"] || !tipsInputs['tipsDescription'] ? 
                                            "bg-[rgba(45,212,191,.3)] disabled:cursor-not-allowed" : 
                                            "bg-[rgba(45,212,191)] hover:cursor-pointer hover:bg-teal-300"
                                        }`}
                                disabled={!tipsInputs["tipsName"] || !tipsInputs['tipsDescription']}
                                onClick={handleCreateTips}
                            >
                                新建
                            </button>
                        </div>
                        
                    </div>
                </div>
            </main>,
            document.body,
        )
    )
}