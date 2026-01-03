"use client";

import { Check, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PlanType } from '@/lib/types';
import { config } from '@/lib/config';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/lib/context/auth-context/auth-context';
import { useRestaurant } from '@/lib/context/restaurant-context/use-restaurant';
import { startRazorPayCheckout } from '@/lib/razorpay';
import BouncingDotsLoader from '../ui/bounce-loader';

type PlatformData = {
  id: number;
  paymentType: 'whatsapp' | 'razorpay';
  whatsapp: string;
  adminEmail: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
};

export default function Pricing({
  slug,
  text = 'Get Started',
  action,
}: {
  slug: string;
  text?: string;
  action: 'signup' | 'dashboard' | 'payment';
}) {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const restaurant = useRestaurant();

  const [platformData, setPlatformData] = useState<PlatformData | null>(null);

  // ✅ Fetch all plans
  useEffect(() => {
    const fetchedPlans = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${config.backend_url}/api/admin/plans`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch plans');

        const data = await res.json();
        console.log("Fetched plans:", data);
        setPlans(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchedPlans();
  }, []);

  // ✅ Fetch platform data if action = payment
  useEffect(() => {
    if (action !== 'payment') return;

    const getPlatformData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${config.backend_url}/api/admin/platform-data`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch platform data');

        const data = await res.json();
        setPlatformData(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    getPlatformData();
  }, [action]);

  // ✅ Handle button click
  const handleButtonClick = (plan: PlanType) => {
    if (action === 'signup') {
      router.push('/signup');
      return;
    }

    if (action === 'dashboard') {
      router.push(`/c/dashboard/membership?slug=${slug}`);
      return;
    }

    if (action === 'payment' && platformData) {
      if (platformData.paymentType === 'whatsapp') {
        const message = encodeURIComponent(
          `Hello, I'd like to purchase the "${plan.name}" plan for my account (${slug}).`
        );
        const whatsappUrl = `https://wa.me/${platformData.whatsapp}?text=${message}`;
        window.open(whatsappUrl, '_blank');
      } else if (platformData.paymentType === 'razorpay') {
        handleBuyPlan(plan);
      }
    }
  };

  const handleBuyPlan = async (plan: PlanType) => {
    try {
      setIsPaymentLoading(true);
      const res = await fetch(`${config.backend_url}/api/restaurant/order/create-one`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          planId: plan.id,
          restaurantId: restaurant?.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        startRazorPayCheckout({
          keyId: data.razorpay.keyId,
          razorPayOrderId: data.razorpay.razorPayOrderId,
          amount: data.razorpay.amount,
          currency: data.razorpay.currency,
          planId: plan.id,
          userId: user?.id,
          restaurantId: restaurant?.id,
        });
      } else {
        toast.error("Failed to start payment");
      }
    } catch{
      toast.error("An error occurred while processing payment");
    }

    finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-linear-to-b from-white to-red-50/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4 px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            One-time payment
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
            Simple,{" "}
            <span className="relative">
              <span className="relative z-10">Transparent Pricing</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-red-200/60 -z-10"></span>
            </span>
          </h2>
          <p className="md:text-xl text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that works best for you. All plans include core features with no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <BouncingDotsLoader />
          </div>
        ) : (
          <div className=" flex-col md:flex-row flex gap-6 items-center md:items-start justify-center mx-auto">
            {plans.length === 0 ? (
              <p className="text-gray-600 text-center">No plans available right now.</p>
            ) : (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-8 rounded-xl bg-white border shadow-sm hover:shadow-lg transition-all duration-300 group ${plan.popular ? "border-red-300" : "border-gray-200"
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">/{plan.type}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 mr-3 flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                  disabled={isPaymentLoading}
                    onClick={() => handleButtonClick(plan)}
                    className="w-full py-4 px-6 rounded-xl font-medium bg-linear-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg group/btn"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {
                        isPaymentLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                        ) :
                          (<>{plan.cta}
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                          </>)
                      }
                    </span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </section>
  );
}