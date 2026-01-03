import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import QRCode from 'react-qr-code'
import { config } from '@/lib/config'
export default function EmpowerBusiness() {
    return (
        <section id='features' className="py-4 md:py-12 bg-gradient-to-b from-white to-red-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center mb-4 px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                        <Sparkles className="w-4 h-4 mr-2" />
                       Create Diigtal menu for FREE
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
                        <span className="relative">
                            <span className="relative z-10">Create & Share</span>
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-red-200 -z-10"></span>
                        </span>
                        {' '}<br className="md:hidden"></br>Your Digital Menu Instantly
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Impress your customers with a sleek, mobile-friendly digital menu. Share it with a simple link or QR code — perfect for restaurants, cafes, food trucks, and cloud kitchens. <b>No app needed!</b>
                    </p>
                </div>



                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
                    {/* Menu Link Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-red-100 w-full max-w-xs text-center transition-all hover:shadow-lg hover:border-red-200">
                        <p className="text-gray-500 text-sm mb-2">Your Menu URL</p>
                        <p className="text-xl font-bold text-gray-700">
                            {config.frontend_url}/<span className="text-red-600">yourname</span>
                        </p>
                    </div>

                    {/* Divider Text */}
                    <div className="text-gray-400 font-medium hidden md:block">OR</div>

                    {/* QR Code Image */}
                    <div className="p-4 shadow w-40 h-40 bg-white rounded-lg flex items-center justify-center">
                        <div className="scale-[0.15] origin-center">
                            <QRCode
                                id="qr-code"
                                value={`https://menulink.xyz/demo`}
                                size={512}
                                level="H"
                                aria-label="QR Code for your menu"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                        {
                            icon: '⚡',
                            title: 'Create a Digital Menu in Minutes',
                            description: 'Say goodbye to paper menus. Easily build a stunning digital menu that customers can access instantly by scanning a QR code.',
                            color: 'bg-red-100'
                        },
                        {
                            icon: '📱',
                            title: 'Full Menu Access for Customers',
                            description: 'Let your customers view your complete menu anytime, anywhere — no app download required.',
                            color: 'bg-indigo-100'
                        },
                        {
                            icon: '🚀',
                            title: 'Instant Real-Time Updates',
                            description: 'Update your menu on the fly — prices, availability, and items reflect instantly for all customers.',
                            color: 'bg-white-100'
                        },
                        {
                            icon: '🍽️',
                            title: 'Digital Menu Display',
                            description: 'Showcase your restaurant’s menu with images, categories, and pricing — all beautifully organized.',
                            color: 'bg-pink-100'
                        },
                        {
                            icon: '💬',
                            title: 'WhatsApp Ordering',
                            description: 'Allow customers to place orders directly via WhatsApp — no complex setup or third-party apps required.',
                            color: 'bg-green-100'
                        },
                        {
                            icon: '🧾',
                            title: 'Easy Menu Management',
                            description: 'Add, edit, or remove items anytime from your dashboard — manage everything effortlessly in one place.',
                            color: 'bg-blue-100'
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all ${feature.color}`}
                        >
                            <div className="text-3xl mb-3">{feature.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/signup"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700"
                    >
                        Make Your Menu for Free
                    </Link>
                </div>
            </div>
        </section>
    )
}