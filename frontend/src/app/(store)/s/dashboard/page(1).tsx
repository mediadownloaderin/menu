"use client";

import { useRestaurant } from "@/lib/context/restaurant-context/use-restaurant";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const restaurant = useRestaurant();

  useEffect(() => {
    // only redirect when we have the restaurant
    if (!restaurant?.slug) return
    router.replace(`/s/dashboard/home?slug=${restaurant.slug}`);

  }, [restaurant?.slug, router]);

  return null;
}
