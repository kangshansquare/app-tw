import MenuLink from "./memuLink/menuLink"

import Link from "next/link"

import { ArrowRight,Bookmark,Calendar,AddUser } from "@deemlol/next-icons";


export default function Menu() {
    const menuList = [
        {
            name: "Dashboard",
            href: "/",
            icon: <Bookmark size={16} />,
            arrow: <ArrowRight size={22} />
        },
        {
            name: "小工具",
            href: "/tools",
            icon: <Calendar size={16} />,
            arrow: <ArrowRight size={22} />
        },
        {
            name: "记录",
            href: "/record",
            icon: <AddUser size={16} />,
            arrow: <ArrowRight size={22} />
        },
        {
            name: "中间件管理",
            href: "/middle",
            icon: <AddUser size={16} />,
            arrow: <ArrowRight size={22} />
        }
    ]



    return (
        <div className="flex-[1] flex flex-col items-center justify-between  bg-gray-600">
            <div className="flex flex-col gap-4 w-full text-white">
                {/* <Link href="/" className="flex items-center gap-2 text-center p-4 hover:bg-gray-500 hover:cursor-pointer">
                    <Bookmark size={16} /> 
                    <span className="">Dashboard</span>
                    <ArrowRight size={22} />
                </Link>

                <Link href="/tools" className="flex items-center gap-2 text-center p-4 hover:bg-gray-500 hover:cursor-pointer">
                    <Calendar size={16} />
                    <span className="">小工具</span>
                    <ArrowRight size={22} />
                </Link>
                
                <Link href="/record" className="flex items-center gap-2 text-center p-4 hover:bg-gray-500 hover:cursor-pointer">
                    <AddUser size={16} />
                    <span className="">记录</span>
                    <ArrowRight size={22} />
                </Link> */}

                

                {
                    menuList.map((item) => (
                        <MenuLink key={item.name} name={item.name} href={item.href} icon={item.icon} arrow={item.arrow} />
                    ))
                }



            </div>
        </div>
    )
}