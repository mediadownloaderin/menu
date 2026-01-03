"use client";

import { Button } from "../ui/button";
import { Card, CardFooter } from "../ui/card";
import { CircleCheck, Link2, List, ShoppingCart, Plus } from "lucide-react";
import { formatIndianCurrency, getAbsoluteUrl } from "@/lib/utils";
import type { MenuType } from "@/lib/types";
import { useEffect, useState } from "react";
import { Img } from "../ui/img-component";
import { useRestaurant } from "@/lib/context/restaurant-context/use-restaurant";
import { useCart } from "@/lib/context/cart-context/use-cart";
import ProductDrawer from "./single-product-drawer";
import { defaultCurrency } from "@/lib/data";

export function ProductCard({ menu }: { menu: MenuType }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { getQuantity, addToCart } = useCart();
  const restaurant = useRestaurant();
  const currencySymbol = restaurant?.settings?.currency?.symbol || defaultCurrency.symbol;
  const isGrid = restaurant?.settings?.isGrid ?? false;

  const [buttonText, setButtonText] = useState({
    icon: ShoppingCart,
    text: "Add to Cart",
  });

  const [isAdded, setIsAdded] = useState(false);
  const imageUrl = menu.images?.[0] ?? "";
  const hasSale =
    menu.salePrice !== undefined &&
    menu.salePrice > 0 &&
    menu.salePrice < menu.price;

  const hasVariant =
    menu.type === "variant" ||
    (menu.variant !== undefined && menu.variant?.length > 0);

  const goToProductPage = () => setDrawerOpen(true);

  const addItemToCart = (id: number, name: string, price: number) => {
    const quantity = getQuantity(id);
    addToCart({ id, name, price }, quantity === 0 ? menu.minOrder : 1);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  useEffect(() => {
    if (hasVariant) {
      setButtonText({ icon: List, text: "Select Options" });
    } else if (menu.type === "affiliate") {
      setButtonText({ icon: Link2, text: "Buy Now" });
    }
  }, [hasVariant, menu.type]);

  const price = menu.salePrice || menu.price;

  // ✅ List view
  if (!isGrid) {
    return (
      <>
        <Card className="overflow-hidden hover:shadow-md border border-gray-100 flex h-32 justify-center px-3">
          <div className="flex">
            {imageUrl && (
              <div
                className="flex-shrink-0 w-24 h-24 relative overflow-hidden rounded-md cursor-pointer"
                onClick={goToProductPage}
              >
                <Img
                  src={imageUrl}
                  alt={menu.name}
                  className="w-full h-full object-cover rounded-md"
                />
                {hasSale && (
                  <span className="absolute top-1 left-1 text-xs font-bold px-1.5 py-0.5 rounded z-10 bg-white text-black">
                    SALE
                  </span>
                )}
              </div>
            )}

            <div
              className={`flex-1 pl-4 flex flex-col justify-between ${
                !imageUrl ? "pl-2" : ""
              }`}
            >
              <div>
                <h3
                  className="font-semibold text-gray-900 line-clamp-1 cursor-pointer"
                  onClick={goToProductPage}
                >
                  {menu.name}
                </h3>
                {menu.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {menu.description}
                  </p>
                )}
              </div>

              <CardFooter className="p-0 pt-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-600">
                    {currencySymbol}{formatIndianCurrency(price.toFixed(2))}
                  </span>
                  {hasSale && (
                    <span className="text-xs text-gray-400 line-through">
                      {currencySymbol}{formatIndianCurrency(menu.price.toFixed(2))}
                    </span>
                  )}
                </div>

                <Button
                  onClick={() => {
                    if (hasVariant) {
                      goToProductPage();
                    } else if (menu.type === "affiliate") {
                      window.open(getAbsoluteUrl(menu.link ?? ""), "_blank");
                    } else {
                      addItemToCart(menu.id, menu.name, price);
                    }
                  }}
                  className="rounded-full p-1 bg-amber-50"
                  size="icon"
                >
                    {hasVariant?
                  <List className="h-3 w-3 text-amber-600" />:
                  
                  <Plus className="h-3 w-3 text-amber-600" />}
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>

        {/* ✅ Drawer Component */}
        <ProductDrawer
          open={drawerOpen}
          id={menu.id}
          setOpen={setDrawerOpen}
        />
      </>
    );
  }

  // ✅ Grid view
  return (
    <>
      <div className="group relative rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white">
        <div
          onClick={goToProductPage}
          className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer"
        >
          {hasSale && (
            <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded z-10 bg-white text-black">
              SALE
            </span>
          )}
          <Img
            src={imageUrl}
            alt={menu.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-3 space-y-1.5">
          <h3
            onClick={goToProductPage}
            className="font-medium truncate text-black cursor-pointer"
          >
            {menu.name}
          </h3>

          <div onClick={goToProductPage} className="flex items-center gap-2">
            <p className="text-base font-bold text-gray-900">
              {currencySymbol}{formatIndianCurrency(price.toFixed(2))}
            </p>
            {hasSale && (
              <p className="text-xs text-gray-400 line-through">
                {currencySymbol}{formatIndianCurrency(menu.price.toFixed(2))}
              </p>
            )}
          </div>

          <Button
            onClick={() => {
              if (hasVariant) {
                goToProductPage();
              } else if (menu.type === "affiliate") {
                window.open(getAbsoluteUrl(menu.link ?? ""), "_blank");
              } else {
                addItemToCart(menu.id, menu.name, price);
              }
            }}
            variant="default"
            size="sm"
            className="w-full mt-2 relative overflow-hidden bg-amber-600 text-white"
          >
            <span
              className={`flex items-center justify-center absolute inset-0 transition-opacity duration-500 ${
                isAdded ? "opacity-100" : "opacity-0"
              }`}
            >
              <CircleCheck className="w-4 h-4 mr-2 text-green-600" />
              Added to Cart
            </span>

            <span
              className={`flex items-center justify-center transition-opacity duration-500 ${
                isAdded ? "opacity-0" : "opacity-100"
              }`}
            >
              <buttonText.icon className="w-4 h-4 mr-2" />
              {buttonText.text}
            </span>
          </Button>
        </div>
      </div>

      {/* ✅ Drawer Component */}
      {
        drawerOpen?
      <ProductDrawer open={drawerOpen} id={menu.id} setOpen={setDrawerOpen} />:<></>
      }
    </>
  );
}
