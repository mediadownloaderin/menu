"use client";
import {
  Home,
  Inbox,
  Settings,
  User,
  ChevronRight,
  Box,
  Gem,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "../ui/badge";

export function DashboardSidebar() {
  const slug = useSearchParams().get("slug");
  const pathname = usePathname();

  // Grouped navigation structure
  const groups = [
    {
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: `/s/dashboard/home/?slug=${slug}`,
          icon: Home,
        },
        {
          title: "Membership",
          url: `/s/dashboard/membership/?slug=${slug}`,
          icon: Gem,
        },
      ],
    },
    {
      label: "Restaurant Management",
      items: [
        {
          title: "Menu Items",
          url: `/s/dashboard/menu/?slug=${slug}`,
          icon: Box,
        },
        // {
        //   title: "Categories",
        //   url: `/${slug}/dashboard/category`,
        //   icon: List,
        // },
        // {
        //   title: "All Images",
        //   url: `/s/dashboard/images/?slug=${slug}`,
        //   icon: Inbox,
        //   badge: "",
        // },
        // {
        //   title: "Banner",
        //   url: `/${slug}/dashboard/banner`,
        //   icon: Image,
        // },
        // {
        //   title: "Policy Pages",
        //   url: `/${slug}/dashboard/pages`,
        //   icon: File,
        // },
      ],
    },
    // {
    //   label: "Sales",
    //   items: [
    //     {
    //       title: "Orders",
    //       url: `/${slug}/dashboard/orders`,
    //       icon: ShoppingCart,
    //     },
    //     {
    //       title: "Payment Options",
    //       url: `/${slug}/dashboard/payment`,
    //       icon: CreditCard,
    //     },
    //   ],
    // },
    {
      label: "Restaurant Settings",
      items: [
        // {
        //   title: "Domain",
        //   url: `/${slug}/dashboard/domain`,
        //   icon: Globe,
        // },
        // {
        //   title: "Theme",
        //   badge:"Beta",
        //   url: `/${slug}/dashboard/theme`,
        //   icon: Pencil,
        // },
        {
          title: "Settings",
          url: `/s/dashboard/setting/?slug=${slug}`,
          icon: Settings,
        },
      ],
    },
  ];

  const isActive = (url: string) => {
    const cleanUrl = url.split("?")[0]; // remove ?slug= part for comparison
    return pathname === cleanUrl || pathname.startsWith(cleanUrl + "/");
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarContent className="bg-white text-gray-900 min-h-screen overflow-x-hidden overflow-y-scroll">
        {/* Header with brand */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-600 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Restaurant Admin</h1>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Manage your restaurant settings
          </p>
        </div>

        {groups.map((group) => (
          <SidebarGroup key={group.label} className="mt-4 ">
            <SidebarGroupLabel className="px-6 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "mx-4 rounded-lg mb-1 transition-all duration-200",
                          active
                            ? "bg-red-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <Link href={item.url}>
                          <div className="flex items-center gap-3 py-2.5 px-3">
                            <item.icon
                              className={cn(
                                "h-4 w-4 transition-colors",
                                active ? "text-white" : "text-gray-500"
                              )}
                            />
                            <span className="font-medium text-sm flex-1">
                              {item.title}
                            </span>
                            {/* {item.badge && (
                              <Badge
                                className={cn(
                                  "ml-auto text-xs px-1.5 py-0.5 min-w-[20px] flex justify-center",
                                  active
                                    ? "bg-white text-black"
                                    : "bg-gray-200 text-gray-800"
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )} */}
                            <ChevronRight
                              className={cn(
                                "h-3.5 w-3.5 transition-transform",
                                active ? "text-white" : "text-gray-400"
                              )}
                            />
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}