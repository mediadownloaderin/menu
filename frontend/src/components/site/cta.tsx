import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-red-600 to-red-600 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Header with badge */}
        <div className="inline-flex items-center justify-center mb-4 px-4 py-2 rounded-full bg-white text-red-600 text-sm font-medium">
          <Sparkles className="w-4 h-4 mr-2" />
          Launch Your Digital Menu in Minutes
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Transform your restaurant with a{' '}
          <span className="bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
            Smart Digital Menu
          </span>
        </h2>
        
        <p className="md:text-xl text-sm text-red-100 mb-10 max-w-3xl mx-auto leading-relaxed">
          Create a modern, scannable menu with live price updates and WhatsApp ordering — no app or coding required. 
          Customers can browse, order, and connect instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link 
            href="/signup" 
            className="group px-6 py-3 bg-white text-red-700 font-semibold rounded-md shadow-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-xl inline-flex items-center justify-center gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <p className="mt-6 text-red-200 text-sm">
          No credit card needed • Setup in under 2 minutes
        </p>
      </div>
    </section>
  )
}
