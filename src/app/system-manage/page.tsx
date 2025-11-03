import Link from 'next/link'


import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
// import {
//     faServicestack,
// } from '@fortawesome/free-brands-svg-icons';
import { 
    faUser,
    faUserGroup,
    faServer,
    faCubes,
    faBuilding,
    faFile,
} from '@fortawesome/free-solid-svg-icons';


export default function SystemManager() {
    return (
        <div className="flex flex-col gap-3">
            
            <div className='bg-white p-4 flex flex-col gap-8'>
                <div className="flex flex-col gap-5">
                    <h2 className="text-xl sm:text-lg font-bold">系统账号管理</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <Link href="/system-manage/user-manage" className='flex items-center justify-center gap-4 border border-gray-100 rounded-md p-4 hover:shadow-md max-w-80'>
                            <FontAwesomeIcon icon={faUser} className='h-10 w-10 text-blue-500' />
                            <div className=''>
                                <p className='text-lg sm:text-base font-bold'>登录账号管理</p>
                                <p className='text-xs sm:text-sm text-gray-500'>可创建访问系统的账号与分配权限，并对其进行管理</p>
                            </div>
                        </Link>
                        <Link href="/system-manage/group-manage" className='flex items-center justify-center gap-4 border border-gray-100 rounded-md p-4 hover:shadow-md max-w-80'>
                            <FontAwesomeIcon icon={faUserGroup} className='w-10 h-10 text-blue-500' />
                            <div className=''>
                                <p className='text-lg sm:text-base font-bold'>用户组管理</p>
                                <p className='text-xs sm:text-sm text-gray-500'>可创建系统中用户组，并对其进行管理</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className='flex flex-col gap-5'>
                    <h2 className="text-xl sm:text-lg font-bold">业务资源</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <Link href="/system-manage/service-line" className='flex items-center justify-center gap-4 border border-gray-100 rounded-md p-4 hover:shadow-md max-w-80'>
                            <FontAwesomeIcon icon={faCubes} className='h-10 w-10 text-blue-500' />
                            <div className=''>
                                <p className='text-lg sm:text-base font-bold'>业务线管理</p>
                                <p className='text-xs sm:text-sm text-gray-500'>可创建系统中业务信息，并对其进行管理</p>
                            </div>
                        </Link>
                        <Link href="/system-manage/idc-manage" className='flex items-center justify-center gap-4 border border-gray-100 rounded-md p-4 hover:shadow-md max-w-80'>
                            <FontAwesomeIcon icon={faBuilding} className='h-10 w-10 text-blue-500' />
                            <div className=''>
                                <p className='text-lg sm:text-base font-bold'>机房管理</p>
                                <p className='text-xs sm:text-sm text-gray-500'>可创建系统中机房信息，并对其进行管理</p>
                            </div>
                        </Link>
                        <Link href="/system-manage/cabinet-manage" className='flex items-center justify-center gap-4 border border-gray-100 rounded-md p-4 hover:shadow-md max-w-80'>
                        <FontAwesomeIcon icon={faServer} className='h-10 w-10 text-blue-500' />
                            <div className=''>
                                <p className='text-lg sm:text-base font-bold'>机柜管理</p>
                                <p className='text-xs sm:text-sm text-gray-500'>可创建系统中机柜信息，并对其进行管理</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className='flex flex-col gap-5'>
                    <h2 className="text-xl sm:text-lg font-bold">系统设置</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <Link href="/system-manage/logs" className='flex items-center gap-4 border border-gray-100 rounded-md p-4 hover:shadow-md max-w-80'>
                            <FontAwesomeIcon icon={faFile} className='h-10 w-10 text-blue-500' />
                            <div className=''>
                                <p className='text-lg sm:text-base font-bold'>操作日志管理</p>
                                <p className='text-xs sm:text-sm text-gray-500'>查看系统用户的操作记录</p>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}