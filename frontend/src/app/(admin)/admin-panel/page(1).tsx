"use client";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (!redirected.current) {
      redirected.current = true;
      router.replace("/admin-panel/home");
    }
  }, []);

  return (
    <div className="min-h-screen w-full">
      <BouncingDotsLoader />
    </div>
  );
}
