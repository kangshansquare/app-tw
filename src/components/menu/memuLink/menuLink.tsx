import Link from "next/link";

interface MenuLinkProps  {
    href: string,
    name: string,
    icon: React.ReactNode,
    arrow: React.ReactNode
}

export default function MenuLink({ name, href, icon, arrow }: MenuLinkProps) {
    
    return (
        <Link href={href} className="flex items-center gap-2 text-center p-4 hover:bg-gray-500 hover:cursor-pointer">
            {icon}
            <span className="">{name}</span>
            {arrow}
        </Link>
    )
}