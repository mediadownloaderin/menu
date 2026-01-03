import Link from "next/link";
import { Sidebar, SidebarContent } from "../ui/sidebar";
import { handleContactClick } from "@/lib/utils";
import Logo from "../ui/logo";
import { useState } from "react";

export default function PageSidebar() {
    const [open,setOpen] = useState(false)
    return (
        <Sidebar  side="right" collapsible="icon">
            <SidebarContent>
                <nav className="flex flex-col items-start pt-8 pl-4  gap-1">
                    <Logo />
                    <Link href="#" className="text-gray-700 hover:text-green-600 transition-colors text-sm font-medium hover:bg-green-50 px-3 py-2 rounded-lg">
                        Home
                    </Link>
                    <a href="#pricing" className="text-gray-700 hover:text-green-600 transition-colors text-sm font-medium hover:bg-green-50 px-3 py-2 rounded-lg">
                        Pricing
                    </a>
                    <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors text-sm font-medium hover:bg-green-50 px-3 py-2 rounded-lg">
                        Features
                    </a>
                    <p onClick={handleContactClick} className="text-gray-700 cursor-pointer hover:text-green-600 transition-colors text-sm font-medium hover:bg-green-50 px-3 py-2 rounded-lg">
                        Contact
                    </p>

                </nav>
            </SidebarContent>
        </Sidebar>
    )
} 