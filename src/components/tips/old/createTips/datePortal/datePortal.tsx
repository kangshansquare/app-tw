'use client';


import { useEffect, useMemo, useState } from "react";
import  ReactDOM  from "react-dom";

interface SubDatePortalProps {
    showSubPortal: boolean,
    onCloseSubPortal: () => void
    onOtherDateChange: (date:{year: number, month: number, date: number}) => void
}

interface DatePanelFormat {
    year: number,
    month: number,
    date: number,
    isFill: boolean
}


function DatePanel(year: number, month: number): DatePanelFormat[][] {
    
    // 当月第一天、最后一天
    const firstDay = new Date(year, month - 1, 1).getDate()
    const lastDay = new Date(year, month, 0).getDate()

    // 获取month第一天、最后一天是周几，0是周日，1是周一、2是周二，以此类推
    const weekDay_firtst = new Date(year, month - 1, 1).getDay();     
    const weekDay_last = new Date(year, month, 0).getDay();
    
    // month一共有多少天，month是自然月
    const days = []
    const startFillArr = []                     // 上月填充列表
    const endFilllArr = []                     // 下月填充列表

    for (let i = 1; i <= lastDay; i++) {
        days.push({
            year,
            month,
            date: i,
            isFill: false
        })
    }

    // 填充上月
    // 当月第一天周几：周日填充6天，周一填充0天，周二填充1，周三填充2天
    let preFill = weekDay_firtst === 0 ? 6 : weekDay_firtst -1;
    // 上月最后一天(31 or 30 or 29 or 28)
    const lastDayPreMonth = new Date(year, month - 1, 0).getDate()
    
    // 上个月真实年、月
    const prevMonthDate = new Date(year, month - 2, 1)
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = prevMonthDate.getMonth() + 1;

    for (let i = preFill; i > 0; i--) {      
        // preFile=6(周日)，填充6天:
        // 一、二、三、四、五、六、日
        // lastDayPreMonth - 5、lastDayPreMonth - 4、lastDayPreMonth - 3、lastDayPreMonth - 2、lastDayPreMonth - 1、lastDayPremonth、1
        
        startFillArr.push({
            year: prevYear,
            month: prevMonth,
            date: lastDayPreMonth - i + 1,
            isFill: true
        })
    }

    // 填充下月
    // 当月最后一天是周几：周日填充0天，周一填充6天，周二填充5天，周三填充4天
    let postFill = weekDay_last === 0 ? 0 : 7 - weekDay_last
    // 下个月真实年、月
    const nextMonthDate = new Date(year, month, 1);
    const nextYear = nextMonthDate.getFullYear();
    const nextMonth = nextMonthDate.getMonth() + 1;

    for (let i = 1; i <= postFill; i++) {
        endFilllArr.push({
            year: nextYear,
            month: nextMonth,
            date: i,
            isFill: true
        })
    }

    const allDays = startFillArr.concat(days, endFilllArr)
    
    // 按每7天分组为5行或6行
    const weeksArr = [];
    for (let i = 0; i < allDays.length; i += 7) {
        weeksArr.push(allDays.slice(i, i + 7))
    }

    return weeksArr;
}



export default function SubDatePortal({ showSubPortal,onCloseSubPortal, onOtherDateChange }: SubDatePortalProps) {

    const week = ['一','二','三','四','五','六','日']

    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    const today = now.getDate();

    const [yearState, setYearState] = useState<number>(year)
    const [monthState, setMonthState] = useState<number>(month)

    // const weeksArr = DatePanel(yearState, monthState)
    const weeksArr = useMemo(() => DatePanel(yearState, monthState), [yearState, monthState])

    const [selectedDate, setSelectedDate] = useState<{ year: number, month: number, date: number } | null>(null)

    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    

    const handleDateChange = (key: string) => {

        
        let newYear = yearState;
        let newMonth = monthState;

        if (key === 'next') {
            const next = new Date(yearState, monthState, 1)
            newYear = next.getFullYear()
            newMonth = next.getMonth() + 1;
        } else if (key === 'prev') {
            const prev = new Date(yearState, monthState - 2, 1)
            newYear = prev.getFullYear()
            newMonth = prev.getMonth() + 1;
        }
        
        setYearState(newYear);
        setMonthState(newMonth)    
    }

    // 选中日期，向父组件传递
    const handleSelectDate = (cell: DatePanelFormat)  => {
        // const value = (e.target as HTMLSpanElement).textContent;

        const selectedTimeStamp = new Date(cell.year, cell.month - 1, cell.date).getTime();
        const todayTimestamp = new Date(year, month - 1, today).getTime();
        
        

        if (selectedTimeStamp < todayTimestamp) return

        console.log("selected", cell.year,cell.month,cell.date)

        setSelectedDate({year: cell.year, month: cell.month, date: cell.date})
        
        
        
    }

    const handleButtonDateSelected = () => {
        const d = selectedDate ? selectedDate : {year, month, date: today}
        onOtherDateChange(d) 
        onCloseSubPortal()

    }
    

    useEffect(() => {

        setModalRoot(document.getElementById('sub-datePortal'))
    },[])

    if (!modalRoot || !showSubPortal) return null;

    return (
        ReactDOM.createPortal(
            <div className="absolute inset-0 bg-[rgba(0,0,0,.4)] flex items-center justify-center">
                <div className=" bg-white h-full p-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-lg">{yearState}年{monthState}月</span>
                            <div className="flex gap-3">
                                <span className="text-lg hover:cursor-pointer" onClick={() =>handleDateChange('prev')}>&lt;</span>
                                <span className="text-lg hover:cursor-pointer" onClick={() =>handleDateChange('next')}>&gt;</span>
                            </div>
                        </div>
                        

                        <div className="flex flex-col gap-2">

                            {/* ...头部和星期... */}
                            <div className="flex gap-4">
                                {week.map((item, i) => (
                                    <span key={i} className="w-8 h-8 flex items-center justify-center">{item}</span>
                                ))}
                            </div>

                            <div className="flex flex-col gap-1 mt-2 mb-4">
                                {weeksArr.map((weeks, i) => (
                                    <div key={i} className="flex gap-4">
                                        {weeks.map((cell, j) => {
                                            
                                            const isToday = !selectedDate && cell.year === year && cell.month === month && cell.date === today
                                            const isSelected = selectedDate && selectedDate.year === cell.year && selectedDate.month === cell.month && selectedDate.date === cell.date


                                            return (
                                                <span
                                                    key={j}
                                                    className={`w-8 h-8 flex items-center justify-center rounded hover:cursor-pointer
                                                        ${(cell.isFill && !isSelected) ? 'text-gray-300' : 'text-black'}
                                                        ${(isSelected || isToday) ? "bg-blue-300": ""}
                                                        ${isSelected ? "border border-blue-400": ""}
                                                        
                                                    `}
                                                    onClick={() => handleSelectDate(cell)}
                                                >
                                                    {cell.date}
                                                </span>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className="flex gap-3 items-center justify-end">
                        <button className="outline-none p-2 pl-4 pr-4 border border-gray-300 rounded-md hover:bg-gray-50" 
                            // onClick={() => onCloseSubPortal(false)}
                            onClick={onCloseSubPortal}
                        >
                            取消
                        </button>
                        <button className="outline-none p-2 pl-4 pr-4 rounded-md text-white bg-[rgba(45,212,191)] hover:cursor-pointer hover:bg-teal-300"
                            onClick={handleButtonDateSelected}
                        >
                            确定
                        </button>
                    </div>
                </div>
            </div>,
            modalRoot
        )
    )
}