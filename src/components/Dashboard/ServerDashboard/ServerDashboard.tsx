'use client';
import dynamic from "next/dynamic";

const BarChart = dynamic(() => import('@/components/ChartComponent/BarChart'), { ssr: false });
const PieChart = dynamic(() => import('@/components/ChartComponent/PieChart'), { ssr: false });
const Doughnut = dynamic(() => import('@/components/ChartComponent/DoughnutChart'), { ssr: false })

export default function ServerDashboard() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full">
            <div className="flex flex-col gap-5">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center sm:text-left">仪表盘</h1>
                <div className="flex flex-col gap-2">
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-center sm:text-left">服务器信息总览</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 bg-white p-4 sm:p-6 border border-gray-100 rounded-md shadow-sm">
                            <div className="flex flex-col justify-between p-4 sm:p-6 rounded-md shadow-sm bg-gray-50">
                                <p className="text-xs sm:text-sm text-gray-500">服务器总数</p>
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#5541F0]">100</span>
                            </div>
                            <div className="flex flex-col justify-between p-4 sm:p-6 rounded-md shadow-sm bg-gray-50">
                                <p className="text-xs sm:text-sm text-gray-500">物理机</p>
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#088220]">60</span>
                            </div>
                            <div className="flex flex-col justify-between p-4 sm:p-6 rounded-md shadow-sm bg-gray-50">
                                <p className="text-xs sm:text-sm text-gray-500">虚拟机</p>
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#ED451F]">110</span>
                            </div>
                            <div className="flex flex-col justify-between p-4 sm:p-6 rounded-md shadow-sm bg-gray-50">
                                <p className="text-xs sm:text-sm text-gray-500">云主机</p>
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#AD098F]">30</span>
                            </div>
                        </div>
                        
                        <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border border-gray-100 h-72 sm:h-80 relative">
                            <div className="h-full">
                                <BarChart title="服务器/云平台服务器统计" label="服务器数量(台)" />
                            </div>
                        </div>
                        
                        <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border border-gray-100 h-72 sm:h-80 relative">
                            <div className="h-full">
                                <Doughnut />
                            </div>
                        </div>
                        <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border border-gray-100 h-72 sm:h-80 relative">
                            <div className="h-full">
                                <PieChart />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}