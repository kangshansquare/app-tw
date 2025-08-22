

interface TipsCardsProps {
    tips: Array<{ title: string, content: string, ExpireDate: Date, status: string, priority: string, create_time: Date, update_time: Date }>;
}

// type TipsDetail = '总任务数' | '待完成' | '已完成' | '已逾期';
// const TipsCount = Record<TipsDetail, number> = {
//     '总任务数': 
// }


export default function TipCards({  tips }: TipsCardsProps) {

    function getDateTimeToString(date: Date) {
        const dateFormat = new Date(date)
        const date_year = dateFormat.getUTCFullYear();
        const date_month = String(dateFormat.getMonth() + 1).padStart(2, '0')
        const date_day = String(dateFormat.getUTCDate()).padStart(2, '0');

        return String(`${date_year}-${date_month}-${date_day}`)
    }

    function isWithinLast7Day(date: Date) {
        const now = new Date();
        const sevenDayAgo = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return new Date(date) >= now  && new Date(date) <= sevenDayAgo
    }

    console.log('TipsCards: ', tips)

    const TipsCount = tips.length;
    const TipsUnfinished = tips.filter(item => item.status === '未完成').length;
    const TipsFinished = tips.filter(item => item.status === '已完成').length;
    const TipsExpired = tips.filter(item => item.status === '已逾期').length;

    const today = getDateTimeToString(new Date())

    const TodayCreateCount = tips.filter(item => getDateTimeToString(item.create_time) === today).length;

    const TipsSoonToExpire = tips.filter(item => isWithinLast7Day(item.ExpireDate) && item.status === '未完成').length;

    

    

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            <div className="flex flex-col bg-white">
                <div className="flex items-center justify-between p-4 rounded-xl">
                    <div className="flex flex-col">
                        <span>总任务数</span>
                        <span className="font-bold text-2xl">{TipsCount}</span>
                    </div>
                    <div className="bg-indigo-100 w-10 h-10" />
                </div>
                <span className="text-green-400 text-sm pl-4 pb-4">较昨日增加 {TodayCreateCount} 项</span>
            </div>

            <div className="flex flex-col bg-white">
                <div className="flex items-center justify-between p-4 rounded-xl">
                    <div className="flex flex-col">
                        <span>待完成</span>
                        <span className="font-bold text-2xl">{TipsUnfinished}</span>
                    </div>
                    <div className="bg-yellow-100 w-10 h-10" />
                </div>
                <span className="text-yellow-400 text-sm pl-4 pb-4">{ TipsSoonToExpire } 项即将到期</span>
            </div>

            <div className="flex flex-col bg-white">
                <div className="flex items-center justify-between p-4 rounded-xl">
                    <div className="flex flex-col">
                        <span>已完成</span>
                        <span className="font-bold text-2xl">{TipsFinished}</span>
                    </div>
                    <div className="bg-teal-100 w-10 h-10" />
                </div>
                <span className="text-green-400 text-sm pl-4 pb-4">完成率 { TipsFinished == 0 ? '0' : ((TipsFinished / TipsCount) * 100).toFixed(0) } %</span>
            </div>

            <div className="flex flex-col bg-white">
                <div className="flex items-center justify-between p-4 rounded-xl">
                    <div className="flex flex-col">
                        <span>已逾期</span>
                        <span className="font-bold text-2xl">{TipsExpired}</span>
                    </div>
                    <div className="bg-red-100 w-10 h-10" />
                </div>
                <span className="text-red-400 text-sm pl-4 pb-4">需要立即处理</span>
            </div>

        </div>
    )
}