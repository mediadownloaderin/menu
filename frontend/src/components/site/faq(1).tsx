import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react'
import { config } from '@/lib/config'

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

   const faqs = [
  {
    question: "How long does it take to set up my digital menu?",
    answer: `Most restaurants can set up their ${config.name} in under 90 seconds. Our intuitive editor makes it easy to add your menu items, prices, and images. If you need help, our team can have you set up in minutes.`
  },
  {
    question: "Do customers need to download an app?",
    answer: `No! ${config.name} is 100% web-based. Customers simply scan your QR code or visit your menu link in their mobile browser - no app download required.`
  },
  {
    question: "Can I manage everything from my phone?",
    answer: `Yes! ${config.name} works perfectly on mobile. You can add items, update prices, and check orders directly from your smartphone—no laptop required.`
  },
  {
    question: "How do I update my menu?",
    answer: "You can update your menu anytime in real-time through our dashboard. Changes appear immediately - no waiting or extra costs like with printed menus."
  },
  {
    question: `Does ${config.name} support orders through WhatsApp?`,
    answer: "Yes! You can enable WhatsApp ordering so customers can place their orders directly from your digital menu. It's fast, familiar, and widely used across India."
  }
]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-red-50/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4 px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium">
            <HelpCircle className="w-4 h-4 mr-2" />
            Support Center
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
            Frequently <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Asked Questions</span>
          </h2>
          <p className="md:text-xl text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about starting and growing your online store
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-red-200 hover:shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-red-50 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                {activeIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-red-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {activeIndex === index && (
                <div className="p-6 bg-red-50 text-gray-700 border-t border-red-100">
                  <p className="leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-red-100 rounded-full px-6 py-3">
            <HelpCircle className="h-5 w-5 text-red-700" />
            <span className="text-red-700 font-medium">Still have questions?</span>
            <button className="text-red-700 text-sm font-semibold hover:underline inline-flex items-center">
              Contact our team <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}