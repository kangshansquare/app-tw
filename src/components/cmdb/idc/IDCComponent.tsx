import { SearchOutlined, PlusSquareFilled } from "@ant-design/icons"
import Cards from "./Cards/Cards"
import ServerItems from "./ServerItems/ServerItems";

export default function IDC() {
    return (
        <div className="p-8 flex flex-col gap-6 bg-gray-50 w-full h-full">
            <div className="flex justify-between items-center">
                <h3 className="font-black text-2xl">IDC管理</h3>
                <div className="flex gap-4">
                    <div className="relative">
                        <input 
                            className="outline-none border border-gray-300 p-2 pl-12 rounded-md sm:w-64 placeholder:text-sm focus:border-blue-500 focus:shadow-md"
                            placeholder="搜索服务器"  
                        />
                        <button className="absolute left-3 top-1/2 -translate-y-1/2">
                            <SearchOutlined className='text-xl text-black' />
                        </button>
                    </div>
                    <button 
                        type="button" 
                        className='bg-blue-600 text-white flex gap-1 items-center justify-center p-2 rounded-md hover:bg-blue-500'
                    >
                        <PlusSquareFilled />
                        添加服务器
                    </button>
                </div>
            </div>
            {/* <Cards /> */}
            

            <div className="p-5 flex flex-col border border-gray-300 rounded-md shadow-md bg-white">
                <div className="py-2 flex items-center gap-5">
                    <select className="outline-none p-2 px-4 border border-gray-200 rounded-md focus:border-blue-500">
                        <option value="">所有机房</option>
                        <option value="bj">北京机房</option>
                        <option value="sh">上海机房</option>
                    </select>
                    <select className="outline-none p-2 px-4 border border-gray-200 rounded-md focus:border-blue-500">
                        <option value="">所有服务器</option>
                        <option value="server">物理机</option>
                        <option value="kvm">虚拟机</option>
                    </select>
                </div>
            </div>

            <ServerItems />
        </div>
    )
}