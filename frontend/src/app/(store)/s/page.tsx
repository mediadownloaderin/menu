"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryList } from "@/components/restaurant/category-list";
import { RestaurantHeader } from "@/components/restaurant/header";
import { config } from "@/lib/config";
import { CategoryType, MenuType, RestaurantType } from "@/lib/types";
import { ContactButtons } from "@/components/restaurant/contact-buttons";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { RestaurantFooter } from "@/components/restaurant/footer";
import { FloatingCartButton } from "@/components/restaurant/floating-cart-button";
import { useRestaurant } from "@/lib/context/restaurant-context/use-restaurant";
import { AlertTriangle, RefreshCw } from "lucide-react";


export default function RestaurantPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const restaurant = useRestaurant();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [membershipError, setMembershipError] = useState(false);
  const [restaurantData, setRestaurantData] = useState<RestaurantType | null>(null);

  useEffect(() => {
    if (!slug) return;

    const getRestaurantData = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(`${config.backend_url}/api/restaurant/public-data/${slug}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch restaurant data");
          return;
        }

        const data = await res.json();
        setMenus(data.menus || []);
        setCategories(data.categories || []);
        setRestaurantData(data.restaurant || null);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (restaurant?.membershipType !== "lifetime" && (restaurant?.expiryDate && new Date(restaurant.expiryDate) < new Date())) {
      setMembershipError(true)
    } else {
      getRestaurantData();
    }

  }, [restaurant, slug]);

  if (membershipError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Membership Expired</h2>

          <p className="text-gray-600 mb-6 leading-relaxed">{membershipError}</p>

          <button
            onClick={() => router.push("/s/dashboard/membership?slug=" + slug)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Renew Membership
          </button>
        </div>
      </div>
    );
  }

  if (!restaurantData) {
    return (
      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center px-4">
       <BouncingDotsLoader/>
      </div>
    );
  }

  if (isLoading) return <div className="w-full min-h-screen flex items-center justify-center"><BouncingDotsLoader /></div>;

  return (
    <div className="w-full min-h-screen flex items-start justify-center bg-gray-200">
      <div className="max-w-2xl w-full min-h-screen bg-white">
        <RestaurantHeader />
        <ContactButtons restaurant={restaurantData} />
        <CategoryList menus={menus} categories={categories} />
        <FloatingCartButton />
        <RestaurantFooter />
      </div>
    </div>
  );
}
