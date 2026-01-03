"use client";
import { RestaurantType } from "@/lib/types";
import { createContext } from "react";

export const RestaurantContext = createContext<RestaurantType | null>(null);
