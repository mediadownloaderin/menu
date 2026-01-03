// src/components/restaurant/ContactButtons.tsx
import { MessageSquare, Instagram, Facebook, Utensils, Pizza } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RestaurantType } from '@/lib/types';

export function ContactButtons({ restaurant }: { restaurant: RestaurantType }) {
  const generateOrderMessage = () => {
    return encodeURIComponent(`Hi ${restaurant?.name}`);
  };

  return (
    <div className="mb-8 mt-3 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3">

        

          {restaurant.settings?.whatsapp && (
            <a 
              href={`https://wa.me/${restaurant.settings?.whatsapp}?text=${generateOrderMessage()}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px]"
            >
              <Button variant="outline" className="gap-2 border-amber-600 text-amber-600 hover:bg-amber-50 w-full">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs md:text-sm">WhatsApp</span>
              </Button>
            </a>
          )}

          {restaurant.settings?.instagram && (
            <a
              href={`https://instagram.com/${restaurant.settings?.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px]"
            >
              <Button variant="outline" className="gap-2 border-pink-500 text-pink-500 hover:bg-pink-50 w-full">
                <Instagram className="h-4 w-4" />
                <span className="text-xs md:text-sm">Instagram</span>
              </Button>
            </a>
          )}

          {restaurant.settings?.facebook?.trim() && (
            <a
              href={restaurant.settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px]"
            >
              <Button variant="outline" className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 w-full">
                <Facebook className="h-4 w-4" />
                <span className="text-xs md:text-sm">Facebook</span>
              </Button>
            </a>
          )}

          {restaurant.settings?.swiggy?.trim() && (
            <a
              href={restaurant.settings.swiggy}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px]"
            >
              <Button variant="outline" className="gap-2 border-orange-600 text-orange-600 hover:bg-orange-50 w-full">
                <Utensils className="h-4 w-4" />
                <span className="text-xs md:text-sm">Swiggy</span>
              </Button>
            </a>
          )}

          {restaurant.settings?.zomato?.trim() && (
            <a
              href={restaurant.settings.zomato}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px]"
            >
              <Button variant="outline" className="gap-2 border-red-600 text-red-600 hover:bg-red-50 w-full">
                <Pizza className="h-4 w-4" />
                <span className="text-xs md:text-sm">Zomato</span>
              </Button>
            </a>
          )}

        </div>
      </div>
    </div>
  );
}