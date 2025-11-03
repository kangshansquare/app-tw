
import { CalculatorOutlined } from '@ant-design/icons';

export default function Cards() {
    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-5 flex flex-col gap-1 border border-gray-200 rounded-md hover:shadow-md bg-white">
                <p>总机房数</p>
                <div className="flex items-center justify-between">
                    <span>8</span>
                    <div className="h-10 w-10 rounded-xl bg-[#165DFF]/10 flex items-center justify-center">
                        <CalculatorOutlined className='text-[#165DFF]' />
                    </div>
                </div>
            </div>
            <div className="p-5 flex flex-col gap-1 border border-gray-200 rounded-md hover:shadow-md bg-white">
                <p>机柜总数</p>
                <div className="flex items-center justify-between">
                    <span>8</span>
                    <div className="h-10 w-10 rounded-xl bg-[#0FC6C2]/10 flex items-center justify-center">
                        <CalculatorOutlined className='text-[#0FC6C2]' />
                    </div>
                </div>
            </div>
            <div className="p-5 flex flex-col gap-1 border border-gray-200 rounded-md hover:shadow-md bg-white">
                <p>物理机总数</p>
                <div className="flex items-center justify-between">
                    <span>8</span>
                    <p className="h-10 w-10 rounded-2xl bg-[#00B42A]/10 flex items-center justify-center">
                        <CalculatorOutlined className='text-[#00B42A]' />
                    </p>
                </div>
            </div>
            <div className="p-5 flex flex-col gap-1 border border-gray-200 rounded-md hover:shadow-md bg-white">
                <p>虚拟机总数</p>
                <div className="flex items-center justify-between">
                    <span>8</span>
                    <p className="h-10 w-10 rounded-2xl bg-[#FF7D00]/10 flex justify-center items-center">
                        <CalculatorOutlined className='text-[#FF7D00]' />
                    </p>
                </div>
            </div>
        </div>
    )
}