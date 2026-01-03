"use client";

import { useRestaurant } from "@/lib/context/restaurant-context/use-restaurant";
import { Drawer, DrawerContent } from "../ui/drawer";
import { SingleProductComponent } from "./single-product";
import { useEffect, useState } from "react";
import { MenuType } from "@/lib/types";
import { config } from "@/lib/config";
import BouncingDotsLoader from "../ui/bounce-loader";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export default function ProductDrawer({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  id: number;
  setOpen: (value: boolean) => void;
}) {
  const restaurant = useRestaurant();
  const [menu, setMenu] = useState<MenuType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) return; // ✅ Only fetch when drawer is opened

    const getProductDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${config.backend_url}/api/menu/menuId/${id}`);
        const data = await res.json();
        if (res.ok) {
          setMenu(data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getProductDetails();
  }, [id, open, restaurant]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle> </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <BouncingDotsLoader />
          </div>
        ) : error ? (
          <div className="w-full min-h-[300px] flex items-center justify-center text-center">
            <div>
              <h2 className="text-xl font-medium text-gray-900">
                Menu item not found
              </h2>
              <p className="text-gray-600 mt-2">
                The menu item you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          </div>
        ) : (
          menu && 
          <SingleProductComponent menu={menu} />
        )}
      </DialogContent>
    </Dialog>
  );
}
