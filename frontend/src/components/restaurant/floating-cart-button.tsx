
import { useCart } from '@/lib/context/cart-context/use-cart';
import { ShoppingCart } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';

interface FloatingCartButtonProps {
  className?: string;
  iconSize?: number;
  buttonStyle?: 'default' | 'minimal';
}

export function FloatingCartButton({ 
  className = '', 
}: FloatingCartButtonProps) {
  const { cartItems } = useCart();
  const slug = useSearchParams().get("slug")
  const router = useRouter();
  
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (itemCount === 0) return null;

  const baseClasses = `
    fixed bottom-4 inset-x-0 z-50 flex justify-center px-4
    ${className}
  `;

  return (
    <div className={baseClasses}>
        <Button
        >
             <button
        onClick={() => router.push(`/s/cart?slug=${slug}`)}
        className={`
            bg-amber-600 text-white
          
          hover:bg-primary-dark
       text-xs font-medium
      py-3 px-5
      rounded-full
      shadow-md
      transition-all duration-200
      transform hover:scale-[1.03]
      active:scale-95
      flex items-center justify-center
      gap-1.5
      min-w-xs
      whitespace-nowrap`}
        aria-label={`View cart (${itemCount} items)`}
      >
        <ShoppingCart className="flex-shrink-0 w-5 h-5" />
        <span className=' text-sm'>Open Cart ({itemCount})</span>
      </button>
        </Button>
     
    </div>
  );
}