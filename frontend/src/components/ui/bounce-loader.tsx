"use client"
import React, { useState, useEffect } from 'react';
import { Utensils, Coffee, Pizza, Salad, IceCream } from 'lucide-react';

interface CulinaryIconLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

// Define custom keyframes for the 'pop-in' animation using a standard approach
// Note: In a real Tailwind project, this should be configured in tailwind.config.js.
// Since we are limited to a single file, we will rely on standard Tailwind utilities and transitions.
// We'll use a `key` prop change to trigger the transition.

const BouncingDotsLoader: React.FC<CulinaryIconLoaderProps> = ({ 
  size = 'sm', 
  message = 'Preparing your order...' 
}) => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  
  const icons = [
    { Icon: Utensils, color: 'text-orange-500', bgColor: 'bg-orange-500/20' },
    { Icon: Pizza, color: 'text-red-600', bgColor: 'bg-red-600/20' },
    { Icon: Coffee, color: 'text-amber-700', bgColor: 'bg-amber-700/20' },
    { Icon: Salad, color: 'text-green-500', bgColor: 'bg-green-500/20' },
    { Icon: IceCream, color: 'text-pink-500', bgColor: 'bg-pink-500/20' },
  ];

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 18,
    md: 36,
    lg: 48
  };
  
  // Custom Tailwind class for a slower, smooth rotation effect
  // Equivalent to: @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  // We'll use a slower rotation duration for the outer element
  const slowSpin = 'animate-[spin_6s_linear_infinite]';


  useEffect(() => {
    // Cycles the icons every 500ms
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length);
    }, 500);

    return () => clearInterval(interval);
  }, [icons.length]);

  const { Icon: CurrentIcon, color: currentColor, bgColor: currentBgColor } = icons[currentIconIndex];
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  return (
    <div 
      className=" w-full h-full flex flex-col items-center justify-center space-y-6 p-6 font-inter"
      // Apply a font-based style for a cleaner look
      style={{ fontFamily: 'Inter, sans-serif' }} 
    >
      {/* Outer Container with Subtle Rotation */}
      <div className={`
        relative 
        ${sizeClass} 
        flex items-center justify-center 
        rounded-full 
        shadow-xl 
        bg-white 
        p-2 
        ${slowSpin} 
        border border-gray-100
      `}>
        
        {/* Pulsing Ring Effect - Creates a modern glow */}
        <span className={`
          absolute 
          inline-flex 
          h-full w-full 
          rounded-full 
          ${currentColor.replace('text', 'bg')} 
          opacity-30 
          animate-ping 
          duration-1000
        `}></span>

        {/* Inner Icon Container - Static, but icon inside transitions */}
        <div className={`
          relative 
          z-10 
          w-full h-full 
          rounded-full 
          flex items-center justify-center 
          transition-colors duration-500 ease-in-out 
          ${currentBgColor}
        `}>
          {/* Cycling Icon with Pop Effect */}
          <CurrentIcon 
            key={currentIconIndex} // Key forces re-render, triggering the transition/animation
            className={`
              ${currentColor} 
              drop-shadow-md 
              transition-all 
              duration-300 
              ease-out 
              // Custom Pop Animation: scales from 0.5 to 1.1 then back to 1 on mount
              animate-[pop-and-settle_0.3s_ease-out_forwards]
            `}
            size={iconSize}
          />
        </div>
      </div>

      {/* Custom Keyframes for the Pop Effect (Simulated) 
          In a true React component, this logic is usually handled via CSS-in-JS or global CSS, 
          but for single-file presentation, we illustrate the intended animation here.
          Since we can't define keyframes easily, we rely on the `key` prop and a smooth `scale` transition.
      */}
      <style>
        {`
          @keyframes pop-and-settle {
            0% { transform: scale(0.5); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-\\[pop-and-settle_0\\.3s_ease-out_forwards\\] {
            animation: pop-and-settle 0.5s ease-out forwards;
          }
        `}
      </style>

      {/* Loading Message */}
      {/* <p className="text-gray-700 text-lg font-semibold tracking-wide">
        {message}
      </p> */}

     
    </div>
  );
};

export default BouncingDotsLoader;