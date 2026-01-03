"use client"
import ImageBucket from "@/components/dashboard/media-bucket";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Img } from "@/components/ui/img-component";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { config } from "@/lib/config";
import { useAuth } from "@/lib/context/auth-context/auth-context";
import { currency, defaultCurrency } from "@/lib/data";
import type { Settings, RestaurantType } from "@/lib/types";
import { Loader2, Save, Store, Trash2, Truck, Phone, Share2, MessageCircle, Facebook, Instagram } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SettingPage = () => {
    const slug = useSearchParams().get("slug");
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorLoading, setErrorLoading] = useState(false);
    const { token } = useAuth();
    const initialStoreSettings = {
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
        countryCode: "+91"
    }
    const [settings, setSettings] = useState<Settings>(initialStoreSettings);

    const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        setSettings((prev) => {
            const newSettings = { ...(prev ?? {}), [key]: value };
            // Update storeData as well
            setStoreData((prevStore) => ({
                ...prevStore,
                settings: newSettings
            }));
            return newSettings;
        });
    };

    const [storeData, setStoreData] = useState<RestaurantType>({
        id: 0,
        name: '',
        slug: '',
        domain: '',
        logo: '',
        description: '',
        favicon: '',
        settings: settings
    });
    const [storeInitialData, setStoreInitialData] = useState<RestaurantType>(storeData)

    const onChange = <K extends keyof RestaurantType>(field: K, value: RestaurantType[K]) => {
        setStoreData((prev) => ({ ...prev, [field]: value }))
    }

    useEffect(() => {
        setHasChanges(JSON.stringify(storeData) !== JSON.stringify(storeInitialData))
    }, [storeData, storeInitialData])

    useEffect(() => {
        const getRestaurantData = async () => {
            try {
                setIsPageLoading(true)
                const res = await fetch(`${config.backend_url}/api/restaurant/get-restaurant-data/${slug}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                const data = await res.json();
                if (!res.ok) {
                    console.log(data);
                    setErrorLoading(true);
                } else {
                    setStoreData(data);
                    setSettings(data?.settings ?? initialStoreSettings);
                    setStoreInitialData(data);
                }

            } catch (error) {
                console.log(error);
                setErrorLoading(true)
            } finally {
                setIsPageLoading(false)
            }
        }
        getRestaurantData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, token]);

    const handleStoreUpdate = async () => {
        try {
            setIsSaving(true)
            const res = await fetch(`${config.backend_url}/api/restaurant/update-any/${slug}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                method: "PUT",
                body: JSON.stringify(storeData)
            });
            if (!res.ok) {
                toast.error("Failed to save changes");
            } else {
                toast.success("Settings updated successfully");
                setHasChanges(false)
            }

        } catch (error) {
            console.log(error);
            toast.error("Failed to save changes");
        } finally {
            setIsSaving(false)
        }
    }

    if (errorLoading) return (
        <div className="p-4 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="text-red-500 text-lg mb-2">Failed to Load Store Details</div>
                <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                </Button>
            </div>
        </div>
    )

    if (isPageLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <BouncingDotsLoader />
        </div>
    )

    return (
        <>
            {isPageLoading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <BouncingDotsLoader />
                </div>
            ) : (
                <div className="p-4 md:p-6 pb-20 mx-auto mb-5 ">
                    {/* Header Section */}
                    <div className="flex flex-col mb-8 gap-4 border-b pb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Store Settings</h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Manage your store configuration and preferences
                                </p>
                            </div>
                            <Button
                                onClick={handleStoreUpdate}
                                disabled={isSaving || !hasChanges}
                                className="w-full md:w-auto transition-all"
                                size="lg"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={handleStoreUpdate}
                                disabled={isSaving || !hasChanges}
                                className={`${hasChanges ? " fixed bottom-5 right-5" : "hidden"}`}
                                size="lg"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>

                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                        {hasChanges && (
                                            <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full animate-pulse">
                                                Unsaved Changes
                                            </span>
                                        )}
                                    </>
                                )}
                            </Button>
                        </div>

                        {hasChanges && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-amber-800">
                                    <span className="text-sm font-medium">You have unsaved changes</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Store Information Card */}
                    <Card className="mb-6">
                        <CardHeader className="border-b bg-gray-50/50">
                            <CardTitle className="text-xl flex items-center gap-3">
                                <Store className="h-5 w-5 text-blue-600" />
                                Restaurant Information
                            </CardTitle>
                            <CardDescription>
                                Basic restaurant details that customers will see on your restaurant front page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-8">
                            {/* Logo Section */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Store Logo</Label>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Upload your restaurant banner. Recommended size: 16:9 aspect ratio
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    {storeData.settings?.logo ? (
                                        <div className="relative group">
                                            <Img
                                                src={storeData.settings?.logo}
                                                alt="Store logo"
                                                className="rounded-lg w-36 h-36 border-2 border-gray-200 object-cover aspect-video"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute -top-2 -right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-white shadow-md hover:bg-gray-100"
                                                onClick={() => updateSetting("logo", "")}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <ImageBucket
                                            text="Select Logo (Upload First)"
                                            onSelect={(url) => updateSetting("logo", url)}
                                        />
                                    )}
                                </div>
                            </div>




                            {/* Banner Section */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Store Banner</Label>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Upload your restaurant banner. Recommended size: 16:9 aspect ratio
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    {storeData.settings?.banner ? (
                                        <div className="relative group">
                                            <Img
                                                src={storeData.settings?.banner}
                                                alt="Store logo"
                                                className="rounded-lg h-36 border-2 border-gray-200 object-cover aspect-video"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute -top-2 -right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-white shadow-md hover:bg-gray-100"
                                                onClick={() => updateSetting("banner", "")}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <ImageBucket
                                            text="Select Banner (Upload First)"
                                            onSelect={(url) => updateSetting("banner", url)}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Name Section */}
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium">Restaurant Name</Label>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        The name of your restaurant as it appears to customers
                                    </p>
                                </div>
                                <Input
                                    value={storeData.name}
                                    onChange={(e) => onChange("name", e.target.value)}
                                    placeholder="Enter your store name"
                                    maxLength={50}
                                    className="focus-visible:ring-2 focus-visible:ring-blue-500/50"
                                />
                            </div>

                            {/* Description Section */}
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium">Store Description</Label>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        A brief description of your restaurant. This appears on your store&apos;s about page.
                                    </p>
                                </div>
                                <Textarea
                                    value={storeData.description || ""}
                                    onChange={(e) => onChange("description", e.target.value)}
                                    placeholder="Tell customers about your store, your products, and what makes you unique..."
                                    maxLength={500}
                                    rows={4}
                                    className="focus-visible:ring-2 focus-visible:ring-blue-500/50 min-h-[120px] resize-vertical"
                                />
                            </div>



                            {/* Currency Section */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg bg-white">
                                <div className="flex-1">
                                    <Label className="text-sm font-semibold block mb-2 text-gray-900">Menu Currency</Label>
                                    <p className="text-sm text-gray-600">
                                        Select the currency shown on your menu
                                    </p>
                                </div>

                                <Select
                                    value={settings.currency?.code || ""} // ✅ show selected value
                                    onValueChange={(value) => {
                                        const selected = currency.find((item) => item.code === value);
                                        if (selected) {
                                            updateSetting("currency", selected);
                                        }
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
                            </div>

                        </CardContent>
                    </Card>

                    {/* Contact Information Card */}
                    <Card className="mb-6">
                        <CardHeader className="border-b bg-green-50/50">
                            <CardTitle className="text-xl flex items-center gap-3">
                                <Phone className="h-5 w-5 text-green-600" />
                                Contact Information
                            </CardTitle>
                            <CardDescription>
                                Add your store&apos;s contact details for customers to reach you
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {/* Phone Number */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg bg-white">
                                <div className="flex-1">
                                    <Label className="text-sm font-semibold block mb-2 text-gray-900">Phone Number</Label>
                                    <p className="text-sm text-gray-600">
                                        Primary contact number for customer inquiries and orders
                                    </p>
                                </div>
                                <Input
                                    type="tel"
                                    value={settings?.phone ?? ""}
                                    onChange={(e) => updateSetting("phone", e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="w-64 focus-visible:ring-2 focus-visible:ring-green-500"
                                />
                            </div>

                            {/* Store Address */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4 border rounded-lg bg-white">
                                <div className="flex-1">
                                    <Label className="text-sm font-semibold block mb-2 text-gray-900">Store Address</Label>
                                    <p className="text-sm text-gray-600">
                                        Your physical store location (Keep it small)
                                    </p>
                                </div>
                                <textarea
                                    value={settings?.address ?? ""}
                                    onChange={(e) => updateSetting("address", e.target.value)}
                                    placeholder="Enter your complete store address..."
                                    rows={3}
                                    className="w-64 p-3 border rounded-md focus-visible:ring-2 focus-visible:ring-green-500 resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Media & Online Presence */}
                    <Card className="mb-6">
                        <CardHeader className="border-b bg-purple-50/50">
                            <CardTitle className="text-xl flex items-center gap-3">
                                <Share2 className="h-5 w-5 text-purple-600" />
                                Social Media & Online Profiles
                            </CardTitle>
                            <CardDescription>
                                Connect your social media accounts and food delivery profiles
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {/* WhatsApp */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg bg-white">
                                <div className="flex-1">
                                    <Label className="text-sm font-semibold  mb-2 text-gray-900 flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 text-green-500" />
                                        WhatsApp Business
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                        WhatsApp number for customer orders and support
                                    </p>
                                </div>
                                <Input
                                    type="url"
                                    value={settings?.whatsapp ?? ""}
                                    onChange={(e) => updateSetting("whatsapp", e.target.value)}
                                    placeholder="+919876543210"
                                    className="w-64 focus-visible:ring-2 focus-visible:ring-green-500"
                                />
                            </div>

                            {/* Facebook */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg bg-white">
                                <div className="flex-1">
                                    <Label className="text-sm font-semibold  mb-2 text-gray-900 flex items-center gap-2">
                                        <Facebook className="h-4 w-4 text-blue-600" />
                                        Facebook Page
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                        Link to your Facebook business page or profile
                                    </p>
                                </div>
                                <Input
                                    type="url"
                                    value={settings?.facebook ?? ""}
                                    onChange={(e) => updateSetting("facebook", e.target.value)}
                                    placeholder="https://facebook.com/yourstore"
                                    className="w-64 focus-visible:ring-2 focus-visible:ring-blue-500"
                                />
                            </div>

                            {/* Instagram */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg bg-white">
                                <div className="flex-1">
                                    <Label className="text-sm font-semibold  mb-2 text-gray-900 flex items-center gap-2">
                                        <Instagram className="h-4 w-4 text-pink-600" />
                                        Instagram Profile
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                        Your Instagram handle for food photos and updates
                                    </p>
                                </div>
                                <Input
                                    type="url"
                                    value={settings?.instagram ?? ""}
                                    onChange={(e) => updateSetting("instagram", e.target.value)}
                                    placeholder="your-insta-username"
                                    className="w-64 focus-visible:ring-2 focus-visible:ring-pink-500"
                                />
                            </div>

                            {/* Food Delivery Platforms */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                {/* Swiggy */}
                                <div className="flex flex-col gap-4 p-4 border rounded-lg bg-orange-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">S</span>
                                        </div>
                                        <Label className="text-sm font-semibold text-gray-900">Swiggy Store</Label>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Link to your Swiggy restaurant listing
                                    </p>
                                    <Input
                                        type="url"
                                        value={settings?.swiggy ?? ""}
                                        onChange={(e) => updateSetting("swiggy", e.target.value)}
                                        placeholder="https://swiggy.com/restaurant-link"
                                        className="focus-visible:ring-2 focus-visible:ring-orange-500"
                                    />
                                </div>

                                {/* Zomato */}
                                <div className="flex flex-col gap-4 p-4 border rounded-lg bg-red-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">Z</span>
                                        </div>
                                        <Label className="text-sm font-semibold text-gray-900">Zomato Restaurant</Label>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Link to your Zomato restaurant page
                                    </p>
                                    <Input
                                        type="url"
                                        value={settings?.zomato ?? ""}
                                        onChange={(e) => updateSetting("zomato", e.target.value)}
                                        placeholder="https://zomato.com/restaurant-link"
                                        className="focus-visible:ring-2 focus-visible:ring-red-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    {/* Delivery & Pickup Settings Card */}
                    <Card className="mb-6">
                        <CardHeader className="border-b bg-gray-50/50">
                            <CardTitle className="text-xl flex items-center gap-3">
                                <Truck className="h-5 w-5 text-purple-600" />
                                Theme Options
                            </CardTitle>
                            <CardDescription>
                                Configure how your store front look
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {/* Pickup Option */}
                            <div className="flex  flex-row justify-between  items-center gap-4 p-4 border rounded-lg bg-white">
                                <div className="flex-1">
                                    <Label className="text-sm font-medium block mb-1">Display menu as Grid </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Enable it to List your menu as Grid
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.isGrid}
                                    onCheckedChange={(checked) => updateSetting("isGrid", checked)}
                                />
                            </div>


                        </CardContent>
                    </Card>

                    {/* Floating Save Button for Mobile */}
                    {hasChanges && (
                        <div className="fixed bottom-6 right-6 z-50 md:hidden">
                            <Button
                                onClick={handleStoreUpdate}
                                disabled={isSaving}
                                className="shadow-lg rounded-full w-14 h-14 p-0"
                                size="icon"
                            >
                                {isSaving ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <Save className="h-6 w-6" />
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default SettingPage