"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { RestaurantProvider } from "@/lib/context/restaurant-context/restaurant-provider";
import { RestaurantType } from "@/lib/types";
import { config } from "@/lib/config";

export default function RestaurantLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for slug to be available
    if (slug === null) return;

    if (!slug) {
      router.replace("/not-found-menu");
      return;
    }

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`${config.backend_url}/api/restaurant/check-slug/${slug}`);
        const data = await res.json();

        if (!data.exists) {
          router.replace("/not-found-menu");
        } else {
          setRestaurant(data.restaurant);
        }
      } catch {
        router.replace("/not-found-menu");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <BouncingDotsLoader />
      </div>
    );
  }

  return <RestaurantProvider restaurant={restaurant!}>{children}</RestaurantProvider>;
}
