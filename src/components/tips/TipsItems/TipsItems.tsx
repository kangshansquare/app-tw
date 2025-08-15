import { EditFilled, DeleteFilled } from "@ant-design/icons";


interface TipsItemsProps {
    tips: Array<{ title: string, content: string, ExpireDate: Date, status: string, priority: string }>;
}

export default function TipsItems({ tips }: TipsItemsProps) {

    const handleTipsEdit: React.MouseEventHandler<HTMLButtonElement> = () => {
        // 编辑选中tips
    }

    const handleTipsDelete: React.MouseEventHandler<HTMLButtonElement> = () => {
        // 删除选中tips
    }



    return (
        <div className="space-y-4">
            { tips.length > 0 ? tips.map((tip, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border-l-8 border-blue-500 flex flex-col gap-2 hover:shadow-xl">
                    <div className="flex items-start justify-between">
                        <label className="flex gap-2 text-xl items-center">
                            <input type="checkbox" className="w-5 h-5"/>
                            {tip.title}
                        </label>
                        <div className="flex gap-5">
                            <span className="text-green-400 text-sm bg-gray-100 rounded-xl p-1 pl-2 pr-2">{tip.status}</span>
                            <button className="" onClick={handleTipsEdit}>
                                <EditFilled className="hover:cursor-pointer bg-gray-200 p-2 rounded-full hover:bg-gray-300" />
                            </button>
                            <button className="" onClick={handleTipsDelete}>
                                <DeleteFilled className="hover:cursor-pointer bg-gray-200 p-2 rounded-full hover:bg-gray-300" />
                            </button>
                        </div>      
                        <p className="pl-7 font-thin text-sm">{tip.content}</p>
                        <div className="pl-7 flex gap-4">
                            <span className="font-thin text-xs">截止于 {tip.ExpireDate.toString()}</span>
                            <span className="font-thin text-xs">{tip.priority}优先级</span>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="text-gray-500 text-center">暂无任务</div>
            )}

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