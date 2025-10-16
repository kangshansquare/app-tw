import { MiddlewareData } from '@/types/MiddlewareData';
import  ReactDOM  from 'react-dom';
import { WarningFilled } from '@ant-design/icons';

interface DeleteMiddlewareProps {
    show: boolean;
    onClose: () => void
    middlewareData: MiddlewareData | null;
    onNotify: (type: 'success' | "error" | "info", message: string) => void;
    onFetch: (page: number, pageSize: number) => void;
}

export default function DeleteMiddleware({ show, onClose, middlewareData, onNotify, onFetch }: DeleteMiddlewareProps) {

    const fetchDelete = async (id: number) => {

        try {
            const res = await fetch(`/api/middleware/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (data.success) {
                if (onFetch) onFetch(1, 5);
                onClose();
                onNotify('success', '中间件删除成功')
            } else {
                onNotify("error", "中间件删除失败")
            }
        } catch (error) {
            onNotify('error', '网络错误')
        }
    }


    return (
        ReactDOM.createPortal(
            <div className="fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center" onClick={onClose}>
                <div className=' bg-white rounded-lg w-full max-w-lg overflow-y-auto max-h-[50vh]' onClick={(e) => e.stopPropagation()}>
                    <div className='p-5 flex flex-col gap-3'>
                        <div className='flex items-center justify-center'>
                            <WarningFilled className='text-red-500 p-5 bg-red-100 rounded-full text-lg' />
                        </div>
                        <div className='flex items-center justify-center'>
                            <span className='font-bold text-lg'>确认删除中间件</span>
                        </div>
                        <div className='flex flex-col items-center justify-center gap-1'>
                            <p className='font-medium text-gray-500'>您确定要删除中间件"<span className='font-bold text-lg text-black'>{middlewareData?.name}</span>"吗？此操作不可恢</p>
                            <p className='font-medium text-gray-500'>复，删除后将无法查看和管理该中间件。</p>
                        </div>
                        <div className='flex gap-2 items-center justify-center my-2'>
                            <button className='border p-2 px-5 rounded-md hover:bg-gray-50' onClick={onClose}>取消</button>
                            <button 
                                className='bg-red-600 p-2 px-4 rounded-md text-white' 
                                onClick={() => {
                                    if (middlewareData?.id !== undefined) {
                                        fetchDelete(middlewareData.id)
                                    }
                                }}
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}