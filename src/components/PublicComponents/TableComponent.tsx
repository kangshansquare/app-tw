'use client';
import { DataTableProps } from "@/types/table";
import LoadingComponent from "@/components/PublicComponents/LoadingComponent";
import NoDataComponent from "@/components/PublicComponents/NoDataComponent";

export default function TableComponent<T>({
    data,
    columns,
    actions,
    loading = false,
    showToggleStatus = true,
    statusKey = 'isActive' as keyof T,
    renderActions
}: DataTableProps<T>) {
    if (loading) {
        return <LoadingComponent />
    }
    if (!data || data.length === 0) {
        return <NoDataComponent />
    }

    const renderDefaultActions = (row: T) => {
        if (!actions)  return null;
        return (
            <>
                <button onClick={() => actions.onEdit(row)} className="text-blue-500">
                    编辑
                </button>
                {showToggleStatus && actions?.onToggleStatus && (
                    <button
                        onClick={() => actions.onToggleStatus?.(row)}
                        className={`${(row as any)[statusKey] ? "text-red-500" : "text-green-500"}`}
                    >
                        {(row as any)[statusKey] ? "禁用" : "启用"}
                    </button>
                )}
                <button onClick={() => actions.onDelete(row)} className="text-red-500">
                    删除
                </button>
            </>
        )
    }

    return (
        <div className='overflow-x-auto mb-2 border border-gray-200 overflow-hidden'>
            <table className='w-full divide-y divide-gray-50'>
                <thead className='bg-gray-50 border-b border-gray-200 sticky top-0 z-10'>
                    <tr>
                        { columns.map((col) => (
                            <th 
                                className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                                key={String(col.key)}

                            >
                                {col.header}
                            </th>
                        )) }
                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    {
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className='hover:bg-gray-50 transition-colors h-16'>
                                { columns.map((col) => (
                                    <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top' key={col.header}>
                                        <div className='h-10 flex items-center'>
                                            { col.render ? col.render(row) : String((row as any)[col.key] ?? "-") }
                                        </div>
                                    </td>
                                )) }

                                <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                    <div className='flex gap-3'>
                                        {renderActions ? renderActions(row) : renderDefaultActions(row)}

                                        {/* {
                                            renderActions ? (
                                                renderActions(row)
                                            ) : 
                                            <>
                                                <button
                                                    onClick={() => actions.onEdit(row)}
                                                    className="text-blue-500"
                                                >
                                                    编辑
                                                </button>
                                                { showToggleStatus && actions.onToggleStatus && (
                                                    
                                                    <button
                                                        onClick={() => actions.onToggleStatus!(row)}
                                                        className={`${(row as any)[statusKey] ? "text-red-500" : "text-green-500"}`}
                                                    >
                                                        {(row as any)[statusKey] ? "禁用" : "启用"}
                                                    </button>
                                                ) }
                                                <button
                                                    onClick={() => actions.onDelete(row)}
                                                    className="text-red-600"
                                                >
                                                    删除
                                                </button>
                                            </>
                                        } */}
                                        
                                    </div>
                                </td>
                            </tr>
                        )) 
                    }
                </tbody>
            </table>
        </div>
    )

}