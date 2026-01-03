import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/context/auth-context/auth-provider";
import { CartProvider } from "@/lib/context/cart-context/cart-provider";
import { Suspense } from "react";
import BouncingDotsLoader from "@/components/ui/bounce-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sumit Art Menus | QR Code Digital Menu Builder",
  description: "Create QR Code digital menus for restaurants, cafes, and hotels in minutes. Upload your menu, get a shareable link, and boost your online presence.",
  keywords: ["digital menu", "qr code menu", "online menu maker", "restaurant menu", "MenuLink"],
  authors: [{ name: "MenuLink" }],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <AuthProvider>
            {/* Wrap all children in Suspense */}
            <Suspense fallback={<div className="w-full min-h-screen"><BouncingDotsLoader /></div>}>
              {children}
            </Suspense>
          </AuthProvider>
        </CartProvider>

        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
