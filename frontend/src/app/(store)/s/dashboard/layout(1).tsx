"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/context/auth-context/auth-context";
import { useRestaurant } from "@/lib/context/restaurant-context/use-restaurant";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function RestaurantDashboardLayout({ children }: { children: ReactNode }) {
    const { user, isAuthLoading } = useAuth();
    const restaurant = useRestaurant();
    const router = useRouter();

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user) {
            router.push('/signin');
        } else if (user.id !== restaurant?.owner) {
            router.push('/signin');
        }
    })

    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main className="min-h-screen bg-gray-100 w-full">
                <header className=" mb-16"><DashboardHeader /></header>
                {children}
            </main>
        </SidebarProvider>
    )
}
