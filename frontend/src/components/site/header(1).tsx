import Logo from '../ui/logo'
import { Sparkles, Lock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

export default function Header() {
    return (
        <header className="w-full px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-red-50 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo and Navigation */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo />
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        <Link href="#" className="text-gray-700 hover:text-red-600 transition-colors text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-lg">
                            Home
                        </Link>
                        <a href="#pricing" className="text-gray-700 hover:text-red-600 transition-colors text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-lg">
                            Pricing
                        </a>
                        <a href="#features" className="text-gray-700 hover:text-red-600 transition-colors text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-lg">
                            Features
                        </a>
                        <a href="https://wa.me/sumitart" className="text-gray-700 hover:text-red-600 transition-colors text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-lg">
                            Contact
                        </a>

                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/signin"
                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors border border-red-100"
                    >
                        <Lock className="h-4 w-4" />
                        <span>Sign In</span>
                    </Link>

                    <Button
                        asChild
                        className="bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Link href="/signup">
                            <Sparkles className="h-4 w-4" />
                            <span>Get Started</span>
                        </Link>
                    </Button>
                </div>

            </div>
        </header>
    )
}