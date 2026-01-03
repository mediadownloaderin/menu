"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, RefreshCw, MessageCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { config } from "@/lib/config";

interface PlatformData {
  id: number;
  paymentType: "whatsapp" | "razorpay";
  whatsapp: string;
  adminEmail: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
}

export default function PaymentSettingsPage() {
  const [platformData, setPlatformData] = useState<PlatformData>({
    id: 0,
    paymentType: "whatsapp",
    whatsapp: "",
    adminEmail: "",
    razorpayKeyId: "",
    razorpayKeySecret: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    getPlatformData();
  }, []);

  const getPlatformData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${config.backend_url}/api/admin/platform-data`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch platform data");
      }
      
      const data = await res.json();
      setPlatformData(data);
      setHasChanges(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load platform settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PlatformData, value: string) => {
    setPlatformData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handlePaymentTypeChange = (value: "whatsapp" | "razorpay") => {
    setPlatformData(prev => ({
      ...prev,
      paymentType: value
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      const res = await fetch(`${config.backend_url}/api/admin/platform-data`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(platformData),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }
      setHasChanges(false);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const validateWhatsapp = (number: string) => {
    // Basic validation for WhatsApp number
    const whatsappRegex = /^[0-9+\-\s()]{10,}$/;
    return whatsappRegex.test(number);
  };
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment Settings</h1>
            <p className="text-muted-foreground">Configure payment gateway and contact settings</p>
          </div>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-48"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Settings</h1>
          <p className="text-muted-foreground">Configure payment gateway and contact settings</p>
        </div>

        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="outline" className="animate-pulse">
              Unsaved Changes
            </Badge>
          )}
          <Button 
            onClick={saveSettings} 
            disabled={!hasChanges || isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
          <Button variant="outline" onClick={getPlatformData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Payment Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateway Configuration
          </CardTitle>
          <CardDescription>
            Choose your preferred payment method and configure the settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Type Selection */}
          <div className="space-y-4">
            <Label htmlFor="paymentType">Payment Method</Label>
            <Select
              value={platformData.paymentType}
              onValueChange={handlePaymentTypeChange}
            >
              <SelectTrigger id="paymentType" className="w-full md:w-64">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Payment
                  </div>
                </SelectItem>
                <SelectItem value="razorpay">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Razorpay
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm text-muted-foreground">
              {platformData.paymentType === "whatsapp" 
                ? "Customers will contact you via WhatsApp for payment processing"
                : "Customers will pay directly through Razorpay gateway"
              }
            </div>
          </div>

          {/* WhatsApp Configuration */}
          {platformData.paymentType === "whatsapp" && (
            <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <Label htmlFor="whatsapp" className="text-blue-800">
                  WhatsApp Number
                </Label>
              </div>
              <Input
                id="whatsapp"
                placeholder="+1234567890"
                value={platformData.whatsapp}
                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                className="max-w-md"
              />
              <div className="text-sm text-blue-700">
                Enter the WhatsApp number where customers will contact you for payments. 
                Include country code (e.g., +91 for India).
              </div>
              {platformData.whatsapp && !validateWhatsapp(platformData.whatsapp) && (
                <div className="text-sm text-red-600">
                  Please enter a valid WhatsApp number
                </div>
              )}
            </div>
          )}

          {/* Razorpay Configuration */}
          {platformData.paymentType === "razorpay" && (
            <div className="space-y-4 p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <Label className="text-green-800">
                  Razorpay Credentials
                </Label>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                  <Input
                    id="razorpayKeyId"
                    placeholder="rzp_test_xxxxxxxxxxxx"
                    value={platformData.razorpayKeyId}
                    onChange={(e) => handleInputChange("razorpayKeyId", e.target.value)}
                    className="max-w-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
                  <Input
                    id="razorpayKeySecret"
                    type="password"
                    placeholder="Enter your Razorpay key secret"
                    value={platformData.razorpayKeySecret}
                    onChange={(e) => handleInputChange("razorpayKeySecret", e.target.value)}
                    className="max-w-md"
                  />
                </div>
              </div>
              
              <div className="text-sm text-green-700">
                You can find these credentials in your Razorpay dashboard under Settings → API Keys.
                Make sure to use test credentials for development and live credentials for production.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}