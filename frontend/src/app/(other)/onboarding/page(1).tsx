"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { config } from "@/lib/config";
import { useAuth } from "@/lib/context/auth-context/auth-context";
import { defaultCurrency } from "@/lib/data";
import { Settings } from "@/lib/types";

const Onboarding = () => {
  const router = useRouter();
  const { token, user } = useAuth();

  // form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // store settings
  const [settings, setSettings] = useState<Settings>({
    minOrderPrice: 0,
    shippingCharges: 0,
    pickup: false,
    delivery: false,
    addressType: "input",
    phone: "",
    banner: "",
    address: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    swiggy: "",
    zomato: "",
    isGrid: false,
    logo: "",
    currency: defaultCurrency,
    countryCode: "+91",
  });

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };


  useEffect(() => {
    if (!name) {
      setSlug("");
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    const formatted = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // replace invalid chars with hyphen
      .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens

    setSlug(`${formatted}-${randomNum}`);
  }, [name]);


  // handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(`${config.backend_url}/api/restaurant/create-one`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          settings, // ✅ include settings with currency
        }),
      });

      const data = await res.json();
      console.log("ONBOARD", data);

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create restaurant");
      } else {
        toast.success("Restaurant Created Successfully");
        router.push("/menu-list");
      }
    } catch {
      setErrorMessage("Internal Server Error");
    } finally {
      setIsLoading(false);
    }
  }

  // redirect if user not logged in
  useEffect(() => {
    if (user === undefined) return; // still loading
    if (!user) router.push("/signin");
  }, [router, user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden border border-red-200">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-red-800">Create Your Store</CardTitle>
            <CardDescription className="text-gray-600">
              Get started in just a few simple steps
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-3">
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                Restaurant Name
              </label>
              <Input
                id="storeName"
                placeholder="Example: Food Bites"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Currency */}
            {/* <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Restaurant Currency
              </label>
              <Select
                value={settings.currency?.code || ""}
                onValueChange={(value) => {
                  const selected = currency.find((item) => item.code === value);
                  if (selected) {updateSetting("currency", selected)
                    setSlug(`$`)
                  };
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Currencies</SelectLabel>
                    {currency.map((item) => (
                      <SelectItem key={item.code} value={item.code}>
                        {item.name} ({item.symbol})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div> */}

            {/* Slug */}
            {/* <div className="space-y-3">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Restaurant Slug (URL)
              </label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-sm">
                  {config.frontend_url || "yourdomain.com"}/
                </span>
                <Input
                  id="slug"
                  type="text"
                  placeholder="food-bites"
                  value={slug}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                    setSlug(value);
                  }}
                  required
                  pattern="[a-z0-9-]+"
                  title="Only lowercase letters, numbers, and hyphens are allowed"
                  className="flex-1 min-w-0 block w-full rounded-none rounded-r-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only lowercase letters, numbers, and hyphens. You can add a custom domain later.
              </p>
            </div> */}

            {/* Submit */}
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 mt-2 h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Your Restaurant...
                </>
              ) : (
                <span className="font-semibold">Create Menu for this Restaurant</span>
              )}
            </Button>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-red-100 pt-4">
          <p className="text-sm text-gray-600">
            Already have a menu?{" "}
            <Link href="/menu-list" className="font-medium text-red-600 hover:text-red-700 hover:underline">
              All Menu List
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
