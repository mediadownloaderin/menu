"use client";

import { AdminBoardHeader } from "@/components/admin-panel/header";
import { AdminBoardSidebar } from "@/components/admin-panel/sidebar";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/context/auth-context/auth-context";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function AdminBoardLayout({ children }: { children: ReactNode }) {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user || user.id !== 1) {
      router.replace("/signin");
      setIsAllowed(false);
    } else {
      setIsAllowed(true);
    }
  }, [user, isAuthLoading, router]);

  // Still loading auth? Show loader
  if (isAuthLoading || isAllowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <BouncingDotsLoader />
      </div>
    );
  }

  // If user is not allowed, show nothing (redirect already happened)
  if (!isAllowed) return ;

  return (
    <SidebarProvider>
      <AdminBoardSidebar />
      <main className="min-h-screen bg-gray-100 w-full">
        <header className="mb-16">
          <AdminBoardHeader />
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
}
