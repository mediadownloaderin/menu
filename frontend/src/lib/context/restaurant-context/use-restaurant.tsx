"use client";
import { useContext } from "react";
import { RestaurantContext } from "./restaurant-context";

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
};
