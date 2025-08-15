

export default function TipCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            <div className="flex flex-col bg-white">
                <div className="flex items-center justify-between p-4 rounded-xl">
                    <div className="flex flex-col">
                        <span>总任务数</span>
                        <span className="font-bold text-2xl">12</span>
                    </div>
                    <div className="bg-indigo-100 w-10 h-10" />
                </div>
                <span className="text-green-400 text-sm pl-4 pb-4">较昨日增加 2 项</span>
            </div>

            <div className="flex flex-col bg-white">
                <div className="flex items-center justify-between p-4 rounded-xl">
                    <div className="flex flex-col">
                        <span>待完成</span>
                        <span className="font-bold text-2xl">7</span>
                    </div>
                    <div className="bg-yellow-100 w-10 h-10" />
                </div>
                <span className="text-yellow-400 text-sm pl-4 pb-4">2项即将到期</span>
            </div>

            <div className="flex flex-col bg-white">
                <div className="flex items-center justify-between p-4 rounded-xl">
                    <div className="flex flex-col">
                        <span>已完成</span>
                        <span className="font-bold text-2xl">5</span>
                    </div>
                    <div className="bg-teal-100 w-10 h-10" />
                </div>
                <span className="text-green-400 text-sm pl-4 pb-4">完成率 58%</span>
            </div>

            <div className="flex flex-col bg-white">
                <div className="flex items-center justify-between p-4 rounded-xl">
                    <div className="flex flex-col">
                        <span>已逾期</span>
                        <span className="font-bold text-2xl">1</span>
                    </div>
                    <div className="bg-red-100 w-10 h-10" />
                </div>
                <span className="text-red-400 text-sm pl-4 pb-4">需要立即处理</span>
            </div>

        </div>
    )
}