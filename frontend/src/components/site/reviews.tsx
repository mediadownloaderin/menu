import { config } from "@/lib/config";
import { Sparkles } from "lucide-react";

export default function Testimonials() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-red-50/50 to-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center mb-4 px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Reviews from our customers
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
                        <span className="relative">
                            <span className="relative z-10">Loved by</span>
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-red-200/60 -z-10"></span>
                        </span>
                        {' '}<br className="md:hidden"></br>Multiple Businesses
                    </h2>
                    <p className="md:text-xl text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Join thousands of businesses who boosted their sales with {config.name}
                    </p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            quote:
                                `${config.name} made it super easy to update our menu items during festive seasons. Our Diwali specials sold out faster than ever!`,
                            author: "Priya Sharma",
                            role: "Owner, Cake Baked",
                            rating: 5
                        },
                        {
                            quote:
                                "Earlier we used to reprint our menu for every small change. Now it's all digital and saves both time and money.",
                            author: "Rahul Verma",
                            role: "Owner, Kays Food land",
                            rating: 5
                        },
                        {
                            quote:
                                "Our guests now scan the QR code and order comfortably. It has reduced errors and made our service smoother.",
                            author: "Anjali Desai",
                            role: "Owner, Lotus Inn",
                            rating: 5
                        }
                    ].map((testimonial, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group hover:border-red-200">
                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed">{`"${testimonial.quote}"`}</p>
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold mr-4 group-hover:bg-red-200 transition-colors">
                                    {testimonial.author.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                {/* <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: "10K+", label: "Active Stores" },
              { number: "45%", label: "Average Sales Growth" },
              { number: "98%", label: "Customer Satisfaction" },
              { number: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div> */}
            </div>
        </section>
    )
}