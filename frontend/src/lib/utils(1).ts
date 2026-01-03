import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 

export function copyToClipBoard(text: string) {
  navigator.clipboard.writeText(text);
}

export async function shareText(text: string) {
  if (navigator.share) {
    try {
      await navigator.share({
        text,
      })
      console.log("Shared successfully")
    } catch (err) {
      console.error("Error sharing:", err)
    }
  } else {
    console.warn("Web Share API not supported in this browser")
  }
}

export function formatIndianCurrency(amount: number | string): string {
  const num = Number(amount);
  if (isNaN(num)) return String(amount);
  return num.toLocaleString("en-IN");
}


export function handleContactClick() {
  const phoneNumber = "8455838503"; // Replace with your number
  const message = encodeURIComponent("Hello, Can I get more info about MenuLink?");
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, "_blank");
}




export function handleContactClickText(text:string) {
  const phoneNumber = "8455838503"; // Replace with your number
  const message = encodeURIComponent(text);
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, "_blank");
}

export function isExpired(expiryDate: number): boolean {
  // expiryDate is a timestamp in milliseconds
  return Date.now() > expiryDate;
}


export function getAbsoluteUrl(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Prepend a secure protocol if it's missing
  return 'https://' + url;
}


export async function getAddressFromLatLng(lat: number, lng: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.address; // {road, city, state, postcode, country, ...}
  } catch {
    return null;
  }
}