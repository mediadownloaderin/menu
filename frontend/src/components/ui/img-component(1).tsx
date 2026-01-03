// components/ui/Img.tsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type ImgProps = {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
};

export function Img({ src, alt, className, onClick }: ImgProps) {
  const [loaded, setLoaded] = useState(false);
  const imgSrc = src?src:"unknown image"

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", className)}
      onClick={onClick}
    >
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
      )}
     { // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-transform duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />}
    </div>
  );
}