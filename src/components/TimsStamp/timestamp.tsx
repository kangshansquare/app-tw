'use client';

import { useState, useEffect, useRef } from "react";

export default function TimeStampComponent() {
    const [currentTimeStamp, setCurrentTimeStamp] = useState<number | null>(null);       // 时间戳
    const [inputTimestamp, setInputTimestamp] = useState<number | null>(null);           // input输入的时间戳
    const [inputDate, setInputDate] = useState<string | null>(null);                     // input输入的日期时间

    const [covertedDate, setCovertedDate] = useState<string | null>(null);               // 秒/毫秒转换的日期时间： YYYY/MM/DD HH:mm:ss
    const [covertedTime, setCovertedTime] = useState<string | null>(null);               // 日期时间转换的时间戳秒/毫秒

    const [currentTimeUnit, setCurrentTimeUnit] = useState<string>("秒");                // 时间单位：秒、毫秒

    const [buttonText, setButtonText] = useState<string>("停止");                        // 时间单位切换按钮：开始、停止

    const [selectDateToTimeUnit, setSelectDateToTimeUnit] = useState<string>("秒");
    const [selectTimeToDateUnit, setSelectTimeToDateUnit] = useState<string>("秒");

    // useRef存储intervalId
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        console.log("useEffect监听了currentTimeUnit变化，当前单位: " + currentTimeUnit);
        console.log("组件初次挂载、点击切换时间单位按钮就会触发，按钮状态：", buttonText)
        console.log("将切换时间单位按钮的事件函数中处理计时器的逻辑移到这里，该事件函数只负责切换时间单位即可")

        if (buttonText === "停止") {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            
            setCurrentTimeStamp(Math.floor(Date.now() / (currentTimeUnit === '秒' ? 1000 : 1)))    
            intervalRef.current = setInterval(() => {
                setCurrentTimeStamp(currentTimeUnit === "秒" ? Math.floor(Date.now() / 1000) : Math.floor(Date.now()));
                
            }, 1000);

        } else if (buttonText === "开始") {

            setCurrentTimeStamp(currentTimeUnit === "秒" ? Math.floor(Date.now() / 1000) : Math.floor(Date.now()));
        }
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [currentTimeUnit]);          // useEffect 监听currentTimeUnit变化 

    
    const handlerButtonStartOrStopClick = () => {

        if (buttonText === "停止") {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            setButtonText("开始");

        } else if (buttonText === "开始") {

            setCurrentTimeStamp(Math.floor(Date.now() / (currentTimeUnit === '秒' ? 1000 : 1)))
            intervalRef.current = setInterval(() => {
                setCurrentTimeStamp(currentTimeUnit === "秒" ? Math.floor(Date.now() / 1000) : Math.floor(Date.now()));
            }, 1000);
            setButtonText("停止");

        }
    }

    const handlerButonCopyClick = () => {
        if (currentTimeStamp) {
            navigator.clipboard.writeText(currentTimeStamp.toString())
                .then(() => {
                    console.log("复制成功！");
                })
                .catch((error) => {
                    console.error("复制失败：", error);
                });
        } else {
            console.log("当前时间戳为空，无法复制！");
        }
    }

    const handlerButtonTimeUnitClick = () => {
        setCurrentTimeUnit(currentTimeUnit === "秒" ? "毫秒" : "秒");
        
    }


    const handlerInputTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputTimestamp(value ? parseInt(value) * 1000 : null);                       

    }

    const handlerInputDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputDate(value ? String(value) : null)
    }

    const handlerDateToTimeSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('Select Date To Time Unit: ', event.target.value)
        setSelectDateToTimeUnit(event.target.value);
    }


    const handlerTimeToDateSelectChangeAfter = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log("Select Time To Date Unit:", event.target.value)
        setSelectTimeToDateUnit(event.target.value)
        
    }

    const handlerDateToTimeButtonClick = () => {
        
        selectDateToTimeUnit === "秒" ? setCovertedDate(inputTimestamp ? new Date(inputTimestamp).toLocaleString(): null) : setCovertedDate(inputTimestamp ? new Date(Math.floor(inputTimestamp / 1000)).toLocaleString() : null)
    }

    const handlerTimeToDateButtonClick = () => {
        selectTimeToDateUnit === "秒" ? setCovertedTime(inputDate ? String(new Date(inputDate).getTime() / 1000) : null) : setCovertedTime(inputDate ? String(new Date(inputDate).getTime()) : null)
    }

    return (
        <div className="w-full flex flex-col gap-2 border-gray-300 border-2 rounded-lg p-4">
            <div className="flex flex-col gap-2 border-gray-50 border-2 p-1 rounded-md">
                <h3 className="p-1 font-bold">时间戳转换</h3>
                <span>当前时间戳：{currentTimeStamp} {currentTimeUnit}</span>
                <div className="flex gap-5 items-center">
                    <button 
                        className="bg-gray-200 p-2 pl-4 pr-4 outline-none rounded-lg hover:bg-gray-100"
                        onClick={handlerButtonTimeUnitClick}
                    >
                        切换单位
                    </button>
                    <button 
                        className="bg-gray-200 p-2 pl-4 pr-4 outline-none rounded-lg hover:bg-gray-100"
                        onClick={handlerButonCopyClick}
                    >
                        复制
                    </button>
                    <button 
                        className={`${buttonText === "停止" ? "bg-red-500" : "bg-green-500"} p-2 pl-4 pr-4 outline-none text-white rounded-lg`}
                        onClick={handlerButtonStartOrStopClick}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-2 border-gray-50 border-2 p-1 rounded-md">
                <h3 className="p-1">时间戳转日期时间</h3>
                <div className="flex gap-4 items-center p-1">
                    <input
                     className="p-1 w-1/5 rounded-md outline-none border-gray-600 border-2" 
                     onChange={handlerInputTimeChange} 
                     type="number"
                     placeholder="输入时间戳(秒)" 
                    />
                    {/* <label htmlFor="timestamp">秒</label> */}
                    <select className="p-1 pr-5 pl-2 outline-none border-gray-600 border-2 rounded-md" defaultValue="秒" onChange={handlerDateToTimeSelectChange}>
                        <option>秒</option>
                        <option>毫秒</option>
                    </select>
                    <button
                     className="bg-slate-800 text-white p-1 border-none rounded-md pl-3 pr-3"
                     onClick={handlerDateToTimeButtonClick} 
                    >转换</button>
                    {covertedDate && <span className="text-slate-800">转换结果：{covertedDate}</span>}
                </div>
            </div>
            <div>
                <h3 className="p-1">日期时间转时间戳</h3>
                <div className="flex gap-4 items-center p-1">
                    <input 
                        className="p-1 w-1/5 rounded-md outline-none border-gray-600 border-2"
                        type="date-local"
                        placeholder="YYYY/MM/DD HH:mm:ss"
                        onChange={handlerInputDateChange}
                    />
                    <button className="bg-slate-800 text-white p-1 border-none rounded-md pl-3 pr-3" onClick={handlerTimeToDateButtonClick}>转换</button>
                    <span className="text-slate-800">转换结果：{covertedTime}</span>
                    <select className="p-1 pr-5 pl-2 outline-none border-gray-600 border-2 rounded-md" defaultValue="秒" onChange={handlerTimeToDateSelectChangeAfter}>
                        <option>秒</option>
                        <option>毫秒</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

