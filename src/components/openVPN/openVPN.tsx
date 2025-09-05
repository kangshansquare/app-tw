'use client';

import { PlusSquareFilled, SearchOutlined, EyeFilled, EditFilled, DeleteFilled } from '@ant-design/icons';
import ItemCards from './ItemCards/ItemCards';
import Notification from '@/components/Notification/Notification';
import { useEffect, useState } from 'react';
import CreateRecord from './CreateRecord/CreateRecord';
import DetailRecord from './DetailRecord/DetailRecord';
import EditRecord from './EditRecord/EditRecord';
import DeleteRecord from './DeleteRecord/DeleteRecord';


import type { OpenVPNRecordType } from '@/types/record';
import Pagination from '@/components/Pagination/Pagination';

// const RecordData = [
//     {
//         id: 1,
//         name: '张三',
//         sector: "研发技术平台-互联网产品研发部-互联网_运维组",
//         account_ip: 'san.zhang,172.19.6.2',
//         apply_date: '2025-08-12',
//         dest_ip: '172.18.55.40 9080;192.168.23.203 9021,9221',
//         type: "开通规则",
//         reason: '工作需要',
//         apply_duration: '永久',
//         status: '已开通',
//         description: ''
//     },
//     {
//         id: 2,
//         name: '李四',
//         sector: "研发技术平台-互联网产品研发部-互联网_运维组",
//         account_ip: 'wangwu,172.89.7.102;zhaoliu,172.19.3.78',
//         apply_date: '2025-08-12',
//         dest_ip: '172.18.55.40 9080',
//         type: "开通规则",
//         reason: '工作需要',
//         apply_duration: '永久',
//         status: '已开通',
//         description: ''
//     },
//     {
//         id: 3,
//         name: '赵六',
//         sector: "研发技术平台-互联网产品研发部-互联网_运维组",
//         account_ip: 'wangwu',
//         apply_date: '2025-08-12',
//         dest_ip: '-',
//         type: "申请账号",
//         reason: '工作需要',
//         apply_duration: '永久',
//         status: '已开通',
//         description: ''
//     },
//     {
//         id: 4,
//         name: '孙七',
//         sector: "研发技术平台-互联网产品研发部-互联网_运维组",
//         account_ip: 'wangwu,172.89.7.102;zhaoliu,172.19.3.78',
//         apply_date: '2025-08-12',
//         dest_ip: '172.18.55.40 9080',
//         type: "申请账号+开通规则",
//         reason: '新入职',
//         apply_duration: '永久',
//         status: '已开通',
//         description: ''
//     },
//     {
//         id: 5,
//         name: '-',
//         sector: "-",
//         account_ip: 'wangwu,172.89.7.102',
//         apply_date: '2025-08-12',
//         dest_ip: '-',
//         type: "注销账号",
//         reason: '离职',
//         apply_duration: '永久',
//         status: '已注销',
//         description: ''
//     }
// ]


type RuleType = "apply_account" | "open_rule" | "account_and_rule" | "delete_rule" | "close_account"
const RuleType_LABEL: Record<RuleType, string> = {
    apply_account: "申请账号",
    open_rule: "开通规则",
    account_and_rule: "申请账号+开通规则",
    delete_rule: "删除规则",
    close_account: "注销账号"
}



export default function OpenVPN() {

    const [ recordData, setRecordData ] = useState<OpenVPNRecordType[] | null>(null)
    const fetchRecords = async () => {
        console.log("执行了fetchRecord函数")
        try {
            const res = await fetch("/api/record", {
                method: 'GET'
            })

            const data = await res.json();
            if (data?.success) {
                setRecordData(data.records);
            }

        } catch (error) {
            console.log("获取Record失败~")
        }
    }

    const [ userId, setUserId ] = useState<number | null>(null)
    const getUserId = async() => {
        try {
            const res = await fetch("/api/user/get-id");

            const data = await res.json();

            if (data?.success) {
                setUserId(data.userId)
            }

        } catch (error) {
            console.log("获取userId失败~")
        }
    }

    const [ notifition, setNotification ] = useState<{
        show: boolean,
        type?: "success" | "error" | "info",
        message?: string
    }>({show: false})

    const onNotify = (type: "success" | "error" | "info", message: string) => {
        setNotification({ show: true, type, message })
    }

    // 创建、详情、编辑、删除 弹窗
    const [ showCreatePortal, setShowCreatePortal ] = useState<boolean>(false)
    const [ DetailPortal, setDetailPortal ] = useState<{ show: boolean, record: OpenVPNRecordType | null }>({ show: false, record: null })
    const [ EditPortal, setEditPortal ] = useState<{ show: boolean, record: OpenVPNRecordType | null }>({ show: false, record: null })
    const [ DeletePortal, setDeletePortal ] = useState<{ show: boolean, record: OpenVPNRecordType | null }>({ show: false, record: null })
    
    useEffect(() => {
        fetchRecords();
    }, [])

    useEffect(() => {
        getUserId();
    }, [userId])

    return (
        <div className="w-full h-full overflow-auto flex flex-col gap-6 p-8 bg-gray-100">
            <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-2'>
                    <h3 className='font-black text-2xl'>openVPN申请记录</h3>
                    <span className='font-light'>管理和查看openVPN申请记录</span>
                </div>
                <div className="flex gap-4 items-center">
                    <div className='relative'>
                        <input 
                            placeholder="搜索记录..." 
                            className='outline-none border border-gray-300 p-2 pl-12 rounded-md sm:w-64 placeholder:text-sm focus:border-blue-500 focus:shadow-md'
                        />
                        <SearchOutlined className='text-2xl text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
                    </div>
                    <button 
                        className={`p-2 flex gap-2 bg-teal-500 rounded-md hover:bg-teal-400 hover:-translate-y-0.5 transition-all ${userId === 1 ? "" : "disabled:cursor-not-allowed"}`} 
                        onClick={() => setShowCreatePortal(true)}
                        disabled={userId === 1 ? false : true}   
                    >
                        <PlusSquareFilled className="text-lg text-white" />
                        <span className='text-white'>添加新记录</span>
                    </button>
                </div>
            </div>

            {
                showCreatePortal && 
                <CreateRecord 
                    show={showCreatePortal} 
                    onClose={() => setShowCreatePortal(false)} 
                    onNotify={onNotify} 
                    fetchRecords={fetchRecords}
                />
            }
            
            <ItemCards />

            {/* Charts */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='flex flex-col gap-2 lg:col-span-2 bg-white p-5  rounded-lg shadow-md'>
                    <div className='flex justify-between'>
                        <h3 className='font-bold text-lg'>记录趋势</h3>
                        <div className='flex gap-4'>
                            <button>周</button>
                            <button>月</button>
                        </div>
                    </div>
                    
                    <div className=''>
                    
                    </div>
                </div>

                <div className='bg-white p-5  rounded-lg shadow-md'>
                    <div className=''>
                        <h3 className='font-bold text-lg'>申请类型分布</h3>
                    </div>
                    
                </div>
            </div>

            <div className='p-5 bg-white rounded-lg shadow-md'>
                <div className='flex flex-col md:flex-row justify-between'>
                    <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='flex flex-col gap-2'>
                            <span className='font-light text-sm'>申请类型</span>
                            <select className='p-2 pl-4 pr-10 outline-none border border-gray-200 rounded-md focus:border-blue-400 w-full'>
                                <option>全部类型</option>
                                <option>开通账号</option>
                                <option>开通规则</option>
                                <option>申请账号+开通规则</option>
                                <option>注销账号</option>
                                <option>删除规则</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <span className='font-light text-sm'>申请日期</span>
                            <select className='p-2 pl-4 pr-10 outline-none border border-gray-200 rounded-md focus:border-blue-400 w-full'>
                                <option>全部日期</option>
                                <option>近7天</option>
                                <option>近30天</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <span className='font-light text-sm'>状态</span>
                            <select className='p-2 pl-4 pr-10 outline-none border border-gray-200 rounded-md focus:border-blue-400 w-full'>
                                <option>全部状态</option>
                                <option>已开通</option>
                                <option>已删除</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex gap-4 items-end'>
                        <button className='outline-none border border-gray-300 p-2 px-4 rounded-lg hover:bg-gray-100'>重置筛选</button>
                        <button className='outline-none bg-blue-500 text-white p-2 px-4 rounded-lg hover:bg-blue-400'>应用筛选</button>
                    </div>

                </div>
            </div>


            {
                recordData ? (
                    <div className='bg-white rounded-lg shadow-md'>
                        <div className='overflow-x-auto mb-2 border border-gray-200'>
                            <table className='min-w-full divide-y divide-gray-50'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                            <div className='flex items-center'>
                                                <input type='checkbox' className='' />
                                            </div>
                                        </th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请人</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请部门</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>账号/IP</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请日期</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>目的IP-端口</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请类型</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请原因</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>申请时长</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>状态</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>备注</th>
                                        <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>操作</th>
                                    </tr>

                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {
                                        recordData.map((record) => (
                                            <tr key={record.id} className='hover:bg-gray-50 transition-colors'>
                                                <td className='px-5 py-3 whitespace-nowrap'>
                                                    <input type='checkbox' />
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{record.name}</td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{record.sector}</td>
                                                <td className='px-5 py-3'>
                                                    <div className='flex flex-col gap-1'>
                                                        { record.account_ip.split(";").map((r, index) => (<span key={r + index} className='text-left text-xs font-medium text-gray-500 tracking-wider'>{r}</span>)) }
                                                    </div>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{new Date(record.apply_date).toISOString().split('T')[0]}</td>
                                                <td className='px-5 py-3'>
                                                    <div className='flex flex-col gap-1'>
                                                        { record.dest_ip.split(";").map((r, index) => (<span key={r + index} className='text-left text-xs font-medium text-gray-500 tracking-wider'>{r}</span>)) }
                                                    </div>
                                                </td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{RuleType_LABEL[record.type as RuleType]}</td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{record.type === 'close_account' ? "离职" : record.reason}</td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{record.apply_duration}</td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{record.type === 'close_account' ? "已删除" : record.status }</td>
                                                <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>{record.description}</td>
                                                <td className='px-5 py-3 text-left text-sm font-medium text-gray-500 tracking-wider'>
                                                    <div className='flex gap-3'>
                                                        <button title='查看详情' onClick={() => setDetailPortal({show: true, record})}>
                                                            <EyeFilled className='text-blue-500 hover:text-blue-400 text-base' />
                                                        </button>
                                                        <button 
                                                            title='编辑' disabled={userId === 1 ? false : true} className={`${userId === 1 ? "" : "disabled:cursor-not-allowed"}`}
                                                            onClick={() => setEditPortal({ show: true, record })}
                                                        >
                                                            <EditFilled className='text-yellow-500 hover:text-yellow-400 text-base' />
                                                        </button>
                                                        <button 
                                                            title='删除' 
                                                            disabled={userId === 1 ? false : true} className={`${userId === 1 ? "" : "disabled:cursor-not-allowed"}`}
                                                            onClick={() => setDeletePortal({ show: true, record })}
                                                        >
                                                            <DeleteFilled className='text-red-500 hover:text-red-400 text-base' />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    
                                </tbody>
                            </table>
                        </div>

                        
                        {
                            DetailPortal.show && 
                            <DetailRecord  show={DetailPortal.show} onClose={() => setDetailPortal(prev => ({...prev, show: false}))} record={DetailPortal.record} />
                        }
                        
                        {
                            DeletePortal.show && 
                            <DeleteRecord 
                                show={DeletePortal.show} 
                                onClose={() => setDeletePortal(prev => ({...prev, show: false}))} 
                                record={DeletePortal.record}
                                onNotify={onNotify}
                                fetchRecords={fetchRecords}
                                
                            />
                        }

                        {
                            EditPortal.show && 
                            <EditRecord 
                                show={EditPortal.show} 
                                onClose={() => setEditPortal(prev => ({...prev, show: false}))} 
                                onNotify={onNotify}  
                                fetchRecords={fetchRecords} 
                                record={EditPortal.record} 
                            />
                        }

                        <Pagination />

                    </div>
                ) : (
                    <div className='flex items-center justify-center mt-5'>
                        <span className='font-light text-gray-500'>暂无记录</span>
                    </div>
                )
            }


            {/* 提示 */}
            {
                notifition && 
                <Notification 
                    show={notifition.show}
                    type={notifition.type}
                    message={notifition.message}
                    closeNotification={() => setNotification({...notifition, show: false})}
                />
            }

        </div>
    )
}