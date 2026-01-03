"use client"
import { RestaurantFooter } from "@/components/restaurant/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/context/cart-context/use-cart";
import { useRestaurant } from "@/lib/context/restaurant-context/use-restaurant";
import { defaultCurrency } from "@/lib/data";
import { formatIndianCurrency } from "@/lib/utils";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CartPage = () => {
    const router = useRouter();
    const slug = useSearchParams().get("slug");
    const { cartItems, clearCart, updateCartItem, removeFromCart } = useCart();
    const [total, setTotal] = useState(0);
    const restaurant = useRestaurant();

    const currencySymbol = restaurant?.settings?.currency?.symbol || defaultCurrency.symbol;

    useEffect(() => {
        setTotal(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
    }, [cartItems]);


    const handleWhatsAppOrderCreation = () => {
        if (!restaurant?.settings?.whatsapp) {
            toast.error("WhatsApp number not configured");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Cart is empty");
            return;
        }


        // 🛒 Items list
        const itemsList = cartItems
            .map(
                (item, index) =>
                    `${index + 1}. ${item.name} (x${item.quantity}) - ${currencySymbol}${formatIndianCurrency(
                        item.price * item.quantity
                    )}`
            )
            .join("\n");

        const itemsSection = `
*Order Items*
-------------
${itemsList}
`.trim();

        // 📦 Order summary
        const orderSummary = `
*Order Summary*
---------------
Total         : ${currencySymbol}${formatIndianCurrency(total)}
`.trim();

        // 📩 Final message
        const message = `
*🛍️ New Order from ${restaurant.name}*

${itemsSection}

${orderSummary}
`.trim();

        // Encode for WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${restaurant.settings.whatsapp}?text=${encodedMessage}`;

        // Open WhatsApp
        window.open(whatsappUrl, "_blank");

        clearCart();
        router.push(`/s?slug=${slug}`);
        toast.success("WhatsApp order created");
    };



    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
                    <div className="relative">
                        <ShoppingCart className="w-20 h-20 text-gray-300" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-sm">0</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Your cart is empty!</h2>
                        <p className="text-gray-500 max-w-md text-sm sm:text-base">
                            Looks like you haven&apos;t added any items to your cart yet. Go ahead and explore our menu.
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push(`/s?slug=${slug}`)}
                        className="mt-2 text-white bg-black hover:bg-green-700 px-6 py-2 h-11 text-base"
                        size="lg"
                    >
                        Back to Menu List
                    </Button>
                </div>
                <RestaurantFooter />
            </>
        );
    }

    return (
        <div className={`min-h-screen 
            bg-gray-50
        `}>
            <main className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
                        <p className="text-gray-600 text-sm sm:text-base mt-1">
                            {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/s?slug=${slug}`)}
                        className="hidden sm:flex"
                    >
                        Continue Shopping
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items Section */}
                    <section className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <Card key={item.id} className="p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-0 bg-white">
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    {/* Product Image */}
                                    {/* <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <ShoppingCart className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div> */}

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{item.name}</h3>
                                                <p className="text-lg font-bold text-black mt-1">
                                                    {currencySymbol}{formatIndianCurrency(item.price.toFixed(2))}
                                                </p>
                                            </div>

                                            {/* Quantity Controls - Desktop */}
                                            <div className="hidden sm:flex items-center gap-4">
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                                                        <button
                                                            onClick={() => updateCartItem(item.id, Math.max(item.minOrder ?? 1, item.quantity - 1))}
                                                            className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            disabled={item.quantity <= (item.minOrder ?? 1)}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-12 text-center font-medium text-gray-700 py-2">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                                            className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {item.minOrder && item.quantity === item.minOrder && (
                                                        <p className="text-xs text-orange-600 text-right">
                                                            Min. order: {item.minOrder}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="text-right min-w-[100px]">
                                                    <p className="font-bold text-lg text-gray-900">
                                                        {currencySymbol}{formatIndianCurrency((item.price * item.quantity).toFixed(2))}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity Controls - Mobile */}
                                        <div className="sm:hidden flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                                                    <button
                                                        onClick={() => updateCartItem(item.id, Math.max(item.minOrder ?? 1, item.quantity - 1))}
                                                        className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                        disabled={item.quantity <= (item.minOrder ?? 1)}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium text-gray-700 py-2">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                                        className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {item.minOrder && item.quantity === item.minOrder && (
                                                    <p className="text-xs text-orange-600">
                                                        Min: {item.minOrder}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <p className="font-bold text-lg text-gray-900">
                                                    {currencySymbol}{formatIndianCurrency((item.price * item.quantity).toFixed(2))}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full p-2 h-auto"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove Button - Desktop */}
                                    <div className="hidden sm:flex items-start">
                                        <Button
                                            variant="ghost"
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full p-2 h-auto"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {/* Continue Shopping Button - Mobile */}
                        <Button
                            variant="outline"
                            onClick={() => router.push(`/s?slug=${slug}`)}
                            className="w-full sm:hidden mt-4"
                        >
                            Continue Shopping
                        </Button>
                    </section>

                    {/* Order Summary Section */}
                    <div className="lg:col-span-1">
                        <Card className="w-full sticky top-6 shadow-lg border-0">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold text-gray-800">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start gap-2 pb-2 border-b border-gray-100 last:border-b-0">
                                            <div className="flex-1 flex flex-col  ">
                                                <div className="flex items-start justify-between">
                                                    <p className="font-medium text-gray-800 text-sm line-clamp-1 ">{item.name}</p>

                                                    <p className="font-semibold text-gray-900 ml-2 whitespace-nowrap flex-shrink-0">
                                                        {currencySymbol}{formatIndianCurrency((item.price * item.quantity).toFixed(2))}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center mt-1 w-full">
                                                    <p className="text-xs text-gray-500 flex-shrink-0">Qty: {item.quantity}</p>
                                                    <p className="text-xs text-gray-500  text-right flex-1 w-full pl-2">
                                                        {currencySymbol}{formatIndianCurrency(item.price.toFixed(2))} each
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span className="text-gray-800">Total Amount</span>
                                        <span className="text-black">{currencySymbol}{formatIndianCurrency(total.toFixed(2))}</span>
                                    </div>
                                </div>

                                {/* {store.settings?.minOrderPrice && total < store.settings.minOrderPrice && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                        <p className="text-orange-700 text-sm text-center">
                                            Add ${currencySymbol}{formatIndianCurrency((store.settings.minOrderPrice - total).toFixed(2))} more to place order
                                        </p>
                                    </div>
                                )} */}
                            </CardContent>
                            <CardFooter className="pt-4">
                                <Button
                                    onClick={handleWhatsAppOrderCreation}
                                    disabled={!restaurant?.settings?.whatsapp}
                                    className={`w-full bg-green-600`}>{restaurant?.settings?.whatsapp ? "Place Order on WhatsApp" : "Cannot Place Order, WhatsApp Number not provided"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main >
            <RestaurantFooter />
        </div >
    );
};

export default CartPage;