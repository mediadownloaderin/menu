"use client";
import { RestaurantType } from "@/lib/types";
import { RestaurantContext } from "./restaurant-context";

export const RestaurantProvider = ({
  restaurant,
  children,
}: {
  restaurant: RestaurantType | null;
  children: React.ReactNode;
}) => {
  return (
    <RestaurantContext.Provider value={restaurant}>
      {children}
    </RestaurantContext.Provider>
  );
};
