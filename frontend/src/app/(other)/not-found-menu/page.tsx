"use client";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundMenu() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PlusCircle className="w-8 h-8 text-blue-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">Restaurant Not Found</h2>

                <p className="text-gray-600 mb-6 leading-relaxed">
                    It looks like you haven&apos;t created a restaurant yet. Let&apos;s get started by setting up your restaurant profile.
                </p>

                <button
                    onClick={() => router.push("/signup")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                    <PlusCircle className="w-5 h-5" />
                    Create Restaurant
                </button>

                <p className="text-sm text-gray-500 mt-4">
                    Need help? Contact our support team.
                </p>
            </div>


        </div>


    )
}