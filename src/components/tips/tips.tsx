'use client';

import { useEffect, useState } from "react";
import PorttalsTips from "./createTips/portalsTips";
import { FetchTips } from "@/utils/tips";

import UpdateTips from "./UpdateTips/UpdateTips";
import { time } from "console";


export default function Tips() {
    


    const [currentTab, setCurrentTab] = useState<string | null>("running")

    const [showPortal, setShowPortal] = useState<boolean>(false);

    const [showUpdateTips, setShowUpdateTips] = useState<boolean>(false);
    const [currentUpdateTips, setCurrentUpdateTips] = useState<any>(null)

    const [tipsData, setTipsData] = useState<any[]>([])
    const [runningTipsCount, setRunnningTipsCount] = useState<number>(0)
    const [complatedTipsCount, setComplatedTipsCount] = useState<number>(0)

    
    useEffect(() => {
        async function getData() {
            const data = await FetchTips();

            console.log("当前Tab", currentTab)
            
            // FetchTips 正常返回[{},{}]， 错误 返回 { code, msg }
            if (Array.isArray(data)) {
                setTipsData(data);
            } else if (data && Array.isArray(data.data)) {
                setTipsData(data.data);
            } else {
                setTipsData([])
            }
            console.log('getData() ----',data)
        }
        getData();
        
    }, [])


    const handlerLiClickChangeTab = (status: string) => {
        console.log(status)
        setCurrentTab(status)
    }

    const handlerCreateTipsClick = (status: boolean) => {
        setShowPortal(true);       // 显示弹窗

    }

    

    const handlerUpdateTipsClick = (item: Array<string>) => {
        console.log('handlerUpdateTipsClick ----',item)
        // 更新tips：显示弹窗，传入id；弹窗组件查询id对应tips数据，显示在弹窗中
        setShowUpdateTips(true)
        setCurrentUpdateTips(item)
    }

    return (
        <div className="flex flex-col gap-3  p-4 border-gray-300 border-2 rounded-lg">
            <h3 className="p-1 font-bold">Tips~</h3>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <ul className="flex hover:cursor-pointer gap-2">
                        <li 
                            className={`border-gray-200 border-t-2 border-l-2 border-r-2 p-1 rounded-tl-md rounded-tr-md ${currentTab === "running" ? "bg-white" : "bg-gray-100"} text-teal-400`}
                            onClick={() => handlerLiClickChangeTab("running")}
                        >
                            运行中({runningTipsCount})
                        </li>

                        <li 
                            className={`border-gray-200 border-t-2 border-l-2 border-r-2 p-1 rounded-tl-md rounded-tr-md ${currentTab === "expired" ? "bg-white" : "bg-gray-100"} text-red-400`}
                            onClick={() => handlerLiClickChangeTab("completed")}
                        >
                            已完成({complatedTipsCount})
                        </li>
                    </ul>
                    <button 
                        className="outline-none bg-teal-400 p-2 pl-4 pr-4 mr-10 text-white rounded-md hover:bg-teal-300"
                        style={{ letterSpacing: "0.2em" }}
                        onClick={() => handlerCreateTipsClick(true)}
                    >
                        新建
                    </button>
                    {showPortal && <PorttalsTips show={showPortal} onClose={() => setShowPortal(false)} />}
                    {showUpdateTips && <UpdateTips show={showUpdateTips} onClose={() => setShowUpdateTips(false)} item={currentUpdateTips} />}
                </div>
                { tipsData.length === 0 ? (
                        <div className="text-gray-400 text-center py-4">暂无数据</div>  
                ) : (
                        <div className="flex flex-col p-1 gap-4 justify-center items-center m-2">
                            {/* <span>当前Tab：</span> */}
                            <table className="p-4 w-full table-fixed border-collapse">
                                <colgroup>
                                    <col className="w-[10%]"></col>
                                    <col className="w-[20%]"></col>
                                    <col className="w-[30%]"></col>
                                    <col className="w-[10%]"></col>
                                    <col className="w-[10%]"></col>
                                    <col className="w-[20%]"></col>
                                </colgroup>
                                <thead className="border-t-2 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="text-center pt-2 pb-2">Id</th>
                                        <th className="text-center pt-2 pb-2">Title</th>
                                        <th className="text-center pt-2 pb-2">内容</th>
                                        <th className="text-center pt-2 pb-2">截止日期</th>
                                        <th className="text-center pt-2 pb-2">状态</th>
                                        <th className="text-center pt-2 pb-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {tipsData.map(item => (
                                        <tr key={item.id} className="">
                                            <td className="text-center pt-2 pb-2">{item.id}</td>
                                            <td className="text-center pt-2 pb-2">{item.title}</td>
                                            <td className="text-center pt-2 pb-2 truncate max-w-[120px] whitespace-nowrap overflow-hidden" title={item.content}>{item.content}</td>
                                            <td className="text-center pt-2 pb-2">{item.ExpireDate}</td>
                                            <td className="text-center pt-2 pb-2">{item.status}</td>
                                            <td className="text-center pt-2 pb-2 flex justify-center items-center gap-2">
                                                <button 
                                                    className="border border-gray-200 w-20 h-10 p-2 rounded-full hover:bg-gray-200 text-sm"
                                                    onClick={() => handlerUpdateTipsClick(item)}
                                                >
                                                    更新
                                                </button>
                                                <button className="border border-gray-200 w-20 h-10 p-2 rounded-full hover:bg-gray-200 text-sm">完成</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-center items-center gap-3 p-4">
                                <button className="border border-gray-200 w-20 h-10 p-2 rounded-full hover:bg-gray-200 text-sm">第一页</button>
                                <button className="border border-gray-200 w-10 h-10 p-2 rounded-full hover:bg-gray-200 text-lg flex items-center justify-center">&lt;</button>
                                <button className="border border-gray-200 w-10 h-10 p-2 rounded-full hover:bg-gray-200 text-sm">1</button>
                                <button className="border border-gray-200 w-10 h-10 p-2 rounded-full hover:bg-gray-200 text-lg flex items-center justify-center">&gt;</button>
                                <button className="border border-gray-200 w-20 h-10 p-2 rounded-full hover:bg-gray-200 text-sm">最后一页</button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}