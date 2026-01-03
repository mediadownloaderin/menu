import { Button } from '@/components/ui/button'
import { Play, CheckCircle, } from 'lucide-react'
import { Img } from '../ui/img-component'
import Link from 'next/link'
import hero from "@/assets/hero.png"

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-br from-red-50 via-white to-emerald-100/30 py-12 lg:py-20 overflow-hidden">
      <div className="container px-4 sm:px-6 flex flex-col items-center gap-12 lg:gap-16">
        {/* Content */}
        <div className="space-y-6 text-center max-w-3xl">
          <div className="inline-flex items-center rounded-full bg-red-100 px-4 py-1.5 text-xs font-medium text-red-700 mb-2">
            <span className="mr-1">✨</span> The future of menus is here
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gray-900">
            Say Goodbye to <br />
            <span className="relative whitespace-nowrap text-red-600">
              Old Paper Menus
              <svg
                className="absolute -bottom-2 left-0 w-full h-4 text-red-400"
                viewBox="0 0 200 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,10 C 30,8 70,6 100,10 130,14 170,16 200,12"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="text-md text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Still printing menus every time prices change? Customers struggle to
            scan outdated PDFs? Hygiene concerns with reused paper menus?
            <span className="font-semibold text-red-600"> We fix all that.</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
            {[
              "Stop wasting money on reprinting costs",
              "Instantly update prices and items from your dashboard",
              "Contactless & hygienic experience for customers",
              "Works on any phone with just a QR code"
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row mt-8 gap-4 justify-center">
            <Button asChild
              className="text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-4 rounded-lg transform hover:-translate-y-1">
              <Link href={'/signup'}>
                Create Your Digital Menu →
              </Link>
            </Button>

            {/* <Button
              onClick={() => {
                window.location.href = 'https://menulink.xyz/s?slug=demo'
              }}
              variant="outline"
              className="text-sm border-red-300 text-red-600 hover:bg-red-50 gap-2 hover:border-red-400 px-6 py-4 rounded-lg transition-all duration-300"
            >
              <Play className="h-4 w-4 fill-red-600 text-red-600" />
              See Demo
            </Button> */}
          </div>

          <div className="flex flex-col items-center gap-3 mt-6">
            <div className="flex -space-x-3">
              {["A", "D", "F", "H", "M"].map((item) => (
                <div
                  key={item}
                  className="h-10 w-10 rounded-full bg-red-200 border-2 border-white flex items-center justify-center text-xs font-bold text-red-700"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="flex items-center text-sm font-medium text-red-700">
              <span>Trusted by 100+ Restaurants, Cafes & Salons</span>
              {/* <div className="flex items-center ml-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />
                ))}
                <span className="ml-1 text-gray-600">4.9/5</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Hero Image with shadow and border */}
        <div className="relative w-full flex  items-center justify-center max-w-2xl mx-auto px-4">
          <div className="relative  max-w-2xs  transform hover:scale-[1.02] transition-transform duration-500">
            <Img
              src={hero.src as unknown as string}
              alt="Digital menu demo showing a modern interface on a mobile device"
              className="w-full h-auto"
            />
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          </div>

          {/* Floating QR code element */}
          {/* <div className="absolute -right-4 bottom-1/4 bg-white p-2 rounded-lg shadow-lg border border-gray-100 transform hover:scale-105 transition-transform duration-300 hidden lg:block">
            <div className="w-20 h-20 bg-white flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500 font-medium">
                QR Code
              </div>
            </div>
            <div className="absolute -top-2 -left-2 w-5 h-5 bg-red-600 rounded-full animate-ping"></div>
          </div> */}
        </div>
      </div>
    </section>
  )
}