'use client';

import { usePathname } from "next/navigation";
import { useMemo } from "react";

type PathNameType = 'user-manage' | 'group-manage' | 'service-line' | 'idc-manage' | 'cabinet-manage' | 'logs' | 'cloud-manage' | 'roles';
const PathName_LABEL: Record<PathNameType, string> = {
    'user-manage': '用户管理',
    'group-manage': '用户组管理',
    'service-line': '业务线管理',
    'idc-manage': '机房管理',
    'cabinet-manage': '机柜管理',
    'logs': '操作日志',
    'cloud-manage': '云平台管理',
    'roles': '角色权限管理',
}

export default function SystemManagerNav() {

    const pathname = usePathname();
    const pathStr = useMemo(() => {
        const segments = pathname.split('/').filter(s => s !== '' && s !== 'system-manage');
        if (segments.length === 0) return '系统管理';
        const labels = segments.map(s => PathName_LABEL[s as keyof typeof PathName_LABEL] ?? s);
        return ['系统管理', ...labels].join(' / ')
    }, [pathname])

    return (
        <h1 className="text-lg sm:text-base text-gray-600">{ pathStr }</h1>
    )
}