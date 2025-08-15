"use client"

import Link from "next/link"

import { ToolOutlined, DatabaseOutlined, HighlightFilled, HomeFilled, CloudFilled, DownOutlined, AliyunOutlined, QqOutlined, PushpinFilled } from "@ant-design/icons";

import { usePathname } from "next/navigation";
import { useState } from "react";



export default function Menu() {

    const MENU: Array<{
        label: string;
        href?: string;
        icon: React.ReactNode;
        children?: Array<{ label: string; href: string; icon?: React.ReactNode }>
        
    }> = [
            { label: "Dashboard", href: "/", icon: <HomeFilled className="text-lg" /> },
            { label: "工具", href: "/tools", icon: <ToolOutlined className="text-lg" /> },
            { label: "记录", href: "/record", icon: <HighlightFilled className="text-lg" /> },
            { label: "中间件管理", href: "/middle", icon: <DatabaseOutlined className="text-lg" /> },
            { 
                label: "云平台",
                icon: <CloudFilled className="text-lg" />,
                children: [
                    { label: "阿里云", href: "/aliyun", icon: <AliyunOutlined /> },
                    { label: "腾讯云", href: "/tencent-cloud", icon: <QqOutlined /> }
                ]
            },
            { label: "提醒事项", href: "/tips", icon: <PushpinFilled className="text-lg" /> }
        ]

    const baseLinkClass = "flex items-center gap-3 ml-1 mr-1 hover:cursor-pointer hover:text-gray-100 p-2 pl-4 rounded-md"


    const pathname = usePathname()

    const [ showSubMenu, setShowSubMenu ] = useState<boolean>(false)

    const handleMenuClick = () => {
        setShowSubMenu(!showSubMenu)
    }

    return (
        <nav className="flex-[1] flex flex-col item-center justify-between bg-gray-600">
            <div className="flex flex-col gap-4 w-full text-gray-300 mt-1">
                {MENU.map((item, index) => {
                    const isActive = item.href && pathname === item.href
                    const hasChildren = item.children && item.children.length > 0;

                    if (hasChildren) {
                        return (
                            <div key={index} className="flex flex-col">
                                <div 
                                    className={`${baseLinkClass} justify-between`}
                                    onClick={handleMenuClick}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span className="text-center text-lg">{item.label}</span>
                                    </div>
                                    <div className="flex items-center"> 
                                        <DownOutlined className={`text-xs transition-transform duration-200 ${showSubMenu ? "rotate-180": ""}`} />
                                    </div>
                                </div>

                                {showSubMenu && (
                                    <div className="flex flex-col gap-3 mt-2">
                                        {item.children?.map((subItem,index) => {
                                            return (
                                                <Link
                                                    key={index}
                                                    href={subItem.href}
                                                    className={`flex items-center pl-10 ml-1 mr-1 gap-3 p-2 hover:cursor-pointer hover:text-gray-100 rounded-md ${pathname === subItem.href ? "bg-blue-500" : ""}`}
                                                >
                                                    {subItem.icon}
                                                    <span>{subItem.label}</span>
                                                </Link>
                                            )
                                        })}
                                        
                                    </div>
                                )}

                            </div>
                        )
                    }

                    return (
                        <Link
                            key={index}
                            href={item.href || "#"}
                            className={`${baseLinkClass} ${isActive ? "bg-blue-500" : ""}`}
                        >
                            {item.icon}
                            <span className="text-lg">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )




    // return (
    //     <div className="flex-[1] flex flex-col items-center justify-between  bg-gray-600">
    //         <div className="flex flex-col gap-4 w-full text-gray-300 m-1">
    //             <Link href="/" className={`flex items-center gap-3 ml-1 mr-1 hover:cursor-pointer hover:text-gray-100 p-2 pl-4 rounded-md ${pathname === "/" ? "bg-blue-500" : ""}`}>
    //                 <HomeFilled className="text-lg" />
    //                 <span className="text-lg">Dashboard</span>
    //             </Link>

    //             <Link href="/tools" className={`flex items-center gap-3 ml-1 mr-1 hover:cursor-pointer hover:text-gray-100 p-2 pl-4 rounded-md ${pathname === "/tools" ? "bg-blue-500" : ""}`}>
    //                 <ToolOutlined className="text-lg" />
    //                 <span className="text-lg">工具</span>
    //             </Link>

    //             <Link href="/record" className={`flex items-center gap-3 ml-1 mr-1 hover:cursor-pointer hover:text-gray-100 p-2 pl-4 rounded-md ${pathname === "/record" ? "bg-blue-500" : ""}`}>
    //                 <HighlightFilled className="text-lg" />
    //                 <span  className="text-lg">记录</span>
    //             </Link>

    //             <Link href="/middle" className={`flex items-center gap-3 ml-1 mr-1 hover:cursor-pointer hover:text-gray-100 p-2 pl-4 rounded-md ${pathname === "/middle" ? "bg-blue-500" : ""}`}>
    //                 <DatabaseOutlined  className="text-lg" />
    //                 <span className="text-lg">中间件管理</span>
    //             </Link>
                
    //             <div className="flex flex-col">
    //                 <div 
    //                     className="flex items-center justify-between ml-1 mr-1 hover:cursor-pointer p-2 pl-4 rounded-md"
    //                     onClick={handleMenuClick}
    //                 >
    //                     <div className="flex items-center gap-3">
    //                         <CloudFilled className="text-lg" />
    //                         <span className="text-center text-lg">云平台</span>
    //                     </div>
    //                     <div className="flex items-center">
    //                         <DownOutlined className={`text-xs transition-transform duration-200 ${showSubMenu ? "rotate-180" : ""}`} />
    //                     </div>
    //                 </div>
                    
    //                 {showSubMenu && (
    //                     <div className="flex flex-col gap-3">
    //                         <Link href="/aliyun" className={`flex items-center mt-2 pl-10 ml-1 mr-1 gap-3 p-2 hover:cursor-pointer hover:text-gray-100 rounded-md ${pathname === '/aliyun' ? "bg-blue-500" : ""}`}>
    //                             <AliyunOutlined />
    //                             <span>阿里云</span>
    //                         </Link>
    //                         <Link href="/tencent-cloud" className={`flex items-center pl-10 ml-1 mr-1 gap-3 p-2 hover:cursor-pointer hover:text-gray-100 rounded-md ${pathname === '/tencent-cloud' ? "bg-blue-500" : ""}`}>
    //                             <QqOutlined />
    //                             <span>腾讯云</span>
    //                         </Link>
    //                     </div>
    //                 )}

    //             </div>
    //         </div>
    //     </div>
    // )


}