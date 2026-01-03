import { config } from "@/lib/config";

// src/components/restaurant/RestaurantFooter.tsx
export function RestaurantFooter() {
  return (
    <div className="my-8 pt-6 text-center">
      <p className="text-gray-400 text-xs">
        Made with <span className="text-amber-600">♥</span> using{' '}
        <a 
          href={config.frontend_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-amber-600 hover:underline"
        >
          {config.name}
        </a>
      </p>
    </div>
  );
}