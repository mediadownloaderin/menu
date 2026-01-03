"use client"
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart, Share2, CircleCheck, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { copyToClipBoard, shareText } from '@/lib/utils';
import { config } from '@/lib/config';
import { MenuType } from '@/lib/types';
import { useCart } from '@/lib/context/cart-context/use-cart';
import { usePathname } from 'next/navigation';
import { Img } from '../ui/img-component';


export function SingleProductComponent({ menu }: { menu: MenuType }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const { addToCart, getQuantity } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const quantity = getQuantity(menu.id);
    const [price, setPrice] = useState(0);
    const [name, setName] = useState("");
    const pathname = usePathname();

    const currentUrl = `${config.frontend_url}${pathname}`;

    const hasSale = menu.salePrice && menu.salePrice < menu.price;

    const mainImage = menu.images[selectedImageIndex] || '/placeholder-menu.jpg';

    // 🔥 normalize "variants" → "variant"
    const normalizedProduct = {
        ...menu,
        variant: menu?.variant || menu?.variants || [],
    };

    // 🔥 flatten variant and group by type
    const variants = (normalizedProduct?.variant?.flat?.() || []).reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: Record<string, any[]>, v: any) => {
            if (!acc[v.type]) acc[v.type] = [];
            acc[v.type].push(v);
            return acc;
        },
        {}
    );

    // keep track of selected options
    const [selectedVariants, setSelectedVariants] = useState<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Record<string, any>
    >({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selectVariant = (type: string, option: any) => {
        setSelectedVariants((prev) => ({ ...prev, [type]: option }));
        setPrice(option.price); // ✅ variant price replaces product/base price
        setName(`${menu.name} (${type}: ${option.value})`); // ✅ update name with selected variant
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) =>
            prev === menu.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) =>
            prev === 0 ? menu.images.length - 1 : prev - 1
        );
    };


    useEffect(() => {
        if (hasSale && menu.salePrice) {
            setPrice(menu.salePrice)
        } else {
            setPrice(menu.price)
        }
        setName(menu.name);
    }, [hasSale, menu])



    return (
        <div className="container max-h-[80vh]  overflow-y-scroll mx-auto px-4 py-8">
            <div className="flex mb-8 flex-col">
                {/* Image Gallery */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="  relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <Img
                            src={mainImage}
                            alt={menu.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Navigation Arrows */}
                        {menu.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {menu.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {menu.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`relative aspect-square rounded-md overflow-hidden border-2 ${selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                                        }`}
                                >
                                    <Img
                                        src={image}
                                        alt={`${menu.name} thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>


                {/* menu Info */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{menu.name}</h1>
                        <p className=' text-left'>{menu.description}</p>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        {hasSale ? (
                            <>
                                <span className="text-2xl font-bold ">
                                    ₹{price.toFixed(2)}
                                </span>
                                <span className="text-md text-gray-500 line-through ml-2">
                                    ₹{menu.price.toFixed(2)}
                                </span>
                                {menu.salePrice && <Badge variant="outline" className="ml-2">
                                    {Math.round((1 - menu.salePrice / menu.price) * 100)}% OFF
                                </Badge>}
                            </>
                        ) : (
                            <span className="text-2xl font-bold">
                                ₹{price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Variants */}
                    {Object.keys(variants).length > 0 && (
                        <div className="space-y-4">
                            {Object.entries(variants).map(([type, options]) => (
                                <div key={type} className="space-y-2">
                                    <p className="font-medium">{type}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            options.map((opt: any) => {
                                                const isSelected =
                                                    selectedVariants[type]?.id === opt.id;
                                                return (
                                                    <Button
                                                        key={opt.id}
                                                        variant={isSelected ? "default" : "outline"}
                                                        onClick={() => selectVariant(type, opt)}
                                                    >
                                                        {opt.value}
                                                    </Button>
                                                );
                                            })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}




                    <Separator />

                </div>
            </div>

            {/* Action Buttons */}
            <div className=" mt-2 fixed bottom-6 right-0 left-0 bg-white px-4 flex gap-4">
                <Button
                    onClick={() => {
                        if (quantity === 0) {
                            addToCart({ id: menu.id, name: name, price: price }, menu.minOrder);
                        } else {
                            addToCart({ id: menu.id, name: name, price: price }, 1);
                        }
                        setIsAdded(true);
                        setTimeout(() => setIsAdded(false), 1500);
                    }}
                    size="lg"
                    className="flex-1 relative overflow-hidden"
                >
                    {/* Added to Cart state */}
                    <span
                        className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-500 transform
      ${isAdded ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
                    >
                        <CircleCheck className="w-5 h-5 text-green-600" />
                        Added to Cart
                    </span>

                    {/* Default Add to Cart state */}
                    <span
                        className={`flex items-center justify-center gap-2 transition-all duration-500 transform
      ${isAdded ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                    </span>
                </Button>

                <Button onClick={() => copyToClipBoard(currentUrl)} variant="outline" size="icon">
                    <Copy className="w-5 h-5" />
                </Button>
                <Button onClick={() => shareText(currentUrl)} variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}