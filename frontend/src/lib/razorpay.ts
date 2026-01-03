// lib/utils/razorpay.ts
import { toast } from "sonner";
import { config } from "./config";

interface RazorPayCheckOutProps {
  keyId: string;
  razorPayOrderId: string;
  amount: number;
  currency: string;
  planId: number;
  userId?: number;
  restaurantId?: number;
}

export async function startRazorPayCheckout({
  keyId,
  razorPayOrderId,
  amount,
  currency,
  planId,
  userId,
  restaurantId,
}: RazorPayCheckOutProps) {
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load Razorpay SDK. Please try again.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      toast.error("Razorpay SDK not initialized properly.");
      return;
    }

    const options = {
      key: keyId,
      amount,
      currency,
      name: config.name,
      description: "Membership Payment",
      order_id: razorPayOrderId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async function (response: any) {
        try {
          const verifyRes = await fetch(`${config.backend_url}/api/restaurant/order/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
              userId,
              restaurantId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) toast.success("Membership activated!, Please refresh page");
          else toast.error("Payment verification failed");
        } catch (err) {
          console.error("Verification error:", err);
          toast.error("Error verifying payment");
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Razorpay error:", error);
    toast.error("Something went wrong while starting the payment");
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) {
      resolve(true); // Already loaded
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};