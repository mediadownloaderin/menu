"use client";
import Pricing from "@/components/site/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Crown, Zap, CreditCard, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { useRestaurant } from "@/lib/context/restaurant-context/use-restaurant";
import { MembershipType } from "@/lib/types";

export default function MembershipPage() {
    const restaurant = useRestaurant();
    const membershipType:MembershipType = restaurant?.membershipType || "trial";
    const expiryDate = restaurant?.expiryDate ? new Date(restaurant.expiryDate) : undefined;

    const now = new Date();
    const msInDay = 24 * 60 * 60 * 1000;
    const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - now.getTime()) / msInDay) : undefined;

    // Consider "expiring soon" when expiry is within 7 days; if no expiry info, treat as expiring
    const isExpiringSoon = expiryDate ? expiryDate.getTime() - now.getTime() < 7 * msInDay : true;
    const isExpired = expiryDate ? expiryDate.getTime() < now.getTime() : true;

    // Show Pricing only for specific conditions
    const shouldShowPricing = () => {
        if (!restaurant?.membershipType) return true; // No membership at all
        if (membershipType === "lifetime") return false; // Never show for lifetime
        if (membershipType === "trial" || membershipType === "basic") {
            // Show for trial/basic only if expiring within 2 days or expired
            return isExpiringSoon || isExpired || (daysLeft !== undefined && daysLeft <= 2);
        }
        return false;
    };

    const showPricing = shouldShowPricing();

    const getMembershipIcon = (type: string) => {
        switch (type) {
            case "lifetime":
                return <Crown className="h-5 w-5 sm:h-6 sm:w-6" />;
            case "basic":
                return <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />;
            case "trial":
                return <Zap className="h-5 w-5 sm:h-6 sm:w-6" />;
            default:
                return <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />;
        }
    };

    const getMembershipColor = (type: string) => {
        switch (type) {
            case "lifetime":
                return "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25";
            case "basic":
                return "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25";
            case "trial":
                return "bg-gradient-to-r from-gray-500 to-slate-600 shadow-lg shadow-gray-500/25";
            case "free":
                return "bg-gradient-to-r from-gray-500 to-slate-600 shadow-lg shadow-gray-500/25";
            default:
                return "bg-gradient-to-r from-gray-500 to-slate-600 shadow-lg shadow-gray-500/25";
        }
    };

    const getMembershipDisplayName = (type: string) => {
        if (type === "lifetime") return "Lifetime";
        if (type === "trial") return "Trial";
        if (type === "basic") return "Basic";
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const getStatusBadge = () => {
        if (!restaurant?.membershipType) {
            return (
                <Badge variant="destructive" className="flex items-center gap-1 text-xs sm:text-sm">
                    <AlertTriangle className="h-3 w-3" />
                    No Membership
                </Badge>
            );
        }

        if (isExpired && membershipType !== "lifetime") {
            return (
                <Badge variant="destructive" className="flex items-center gap-1 text-xs sm:text-sm">
                    <AlertTriangle className="h-3 w-3" />
                    Expired
                </Badge>
            );
        }

        if (isExpiringSoon && membershipType !== "lifetime") {
            return (
                <Badge variant="outline" className="flex items-center gap-1 border-orange-200 bg-orange-50 text-orange-700 text-xs sm:text-sm">
                    <AlertTriangle className="h-3 w-3" />
                    Expiring Soon
                </Badge>
            );
        }

        return (
            <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100 text-xs sm:text-sm">
                <CheckCircle className="h-3 w-3" />
                Active
            </Badge>
        );
    };

    return (
        <div className="container p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="flex justify-center">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Membership Status
                </h1>
                <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
                    Manage your subscription and explore upgrade options
                </p>
            </div>

            {/* Current Membership Card */}
            <Card className="shadow-xl border-0 bg-linear-to-br from-background to-muted/20">
                <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-xl sm:text-2xl flex items-start sm:items-center gap-3">
                                {restaurant?.membershipType ? (
                                    <>
                                        <div className={`p-2 sm:p-3 rounded-full text-white ${getMembershipColor(membershipType)}`}>
                                            {getMembershipIcon(membershipType)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {getMembershipDisplayName(membershipType)} Plan
                                                {membershipType === "lifetime" && (
                                                    <Badge variant="secondary" className="bg-linear-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                                                        LIFETIME
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">
                                                {membershipType === "lifetime" 
                                                    ? "Lifetime access to all premium features"
                                                    : membershipType === "trial"
                                                    ? "Trial period with limited features"
                                                    : membershipType === "basic"
                                                    ? "Basic subscription with essential features"
                                                    : "Free plan with basic functionality"
                                                }
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 sm:p-3 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800">
                                            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>
                                        <div>
                                            No Active Plan
                                            <div className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">
                                                Get started with a subscription
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardTitle>
                            
                    {/* Action Buttons */}
                    {showPricing && (
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
                            <Button 
                                onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ 
                                    behavior: 'smooth' 
                                })}
                                variant="default"
                                className="flex-1 shadow-lg"
                            >
                                {restaurant?.membershipType ? "Upgrade Plan" : "Choose a Plan"}
                            </Button>
                        </div>
                    )}
                        </div>
                        <div className="self-start sm:self-center">
                            {getStatusBadge()}
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                    {/* Progress Bar for Active Memberships */}
                    {restaurant?.membershipType && expiryDate && !isExpired && membershipType !== "lifetime" && (
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-muted-foreground">Membership Progress</span>
                                <span className="font-medium">
                                    {daysLeft && daysLeft > 0 ? `${daysLeft} days left` : 'Expiring today'}
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                        daysLeft && daysLeft > 7 
                                            ? 'bg-green-500' 
                                            : daysLeft && daysLeft > 3 
                                            ? 'bg-orange-500' 
                                            : 'bg-red-500'
                                    }`}
                                    style={{ 
                                        width: daysLeft && daysLeft > 0 
                                            ? `${Math.min(100, (daysLeft / 30) * 100)}%` 
                                            : '0%' 
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Membership Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-xl border">
                                <span className="text-sm font-medium">Plan Type</span>
                                <Badge variant="secondary" className="capitalize text-xs sm:text-sm">
                                    {restaurant?.membershipType ? getMembershipDisplayName(membershipType) : "None"}
                                </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-xl border">
                                <span className="text-sm font-medium">Status</span>
                                <div className="text-sm font-medium capitalize">
                                    {!restaurant?.membershipType ? "Inactive" : 
                                     isExpired ? "Expired" : 
                                     isExpiringSoon ? "Expiring Soon" : 
                                     "Active"}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-xl border">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {membershipType === "lifetime" ? "Activated Date" : "Expiry Date"}
                                </span>
                                <div className="text-sm font-medium text-right">
                                    {expiryDate ? (
                                        <div>
                                            <div>{expiryDate.toLocaleDateString()}</div>
                                            {membershipType !== "lifetime" && (
                                                <div className="text-xs text-muted-foreground">
                                                    {expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        "N/A"
                                    )}
                                </div>
                            </div>

                            {daysLeft !== undefined && membershipType !== "lifetime" && (
                                <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-xl border">
                                    <span className="text-sm font-medium">Time Remaining</span>
                                    <div className={`text-sm font-medium ${
                                        daysLeft <= 3 ? 'text-red-600' : 
                                        daysLeft <= 7 ? 'text-orange-600' : 'text-green-600'
                                    }`}>
                                        {daysLeft >= 0 ? `${daysLeft} day(s)` : 'Expired'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Pricing Section */}
            {showPricing && (
                <div id="pricing-section" className="scroll-mt-20">
                    <div className="text-center space-y-3 mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {restaurant?.membershipType ? "Upgrade Your Plan" : "Choose Your Plan"}
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                            {restaurant?.membershipType 
                                ? "Upgrade to unlock more features and better benefits"
                                : "Select the perfect plan for your restaurant needs"
                            }
                        </p>
                    </div>
                    <Pricing slug={restaurant?.slug ?? ""} action="payment" />
                </div>
            )}

            {/* No Upgrade Needed Message */}
            {!showPricing && membershipType === "lifetime" && (
                <Card className="text-center border-0 shadow-xl bg-linear-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20">
                    <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 shadow-lg">
                                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">You&apos;re All Set!</h3>
                        <p className="text-muted-foreground text-sm sm:text-base mb-4 max-w-md mx-auto">
                            You have our highest tier <strong>Lifetime lifetime</strong> membership. 
                            Enjoy all premium features forever!
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Free Plan Message */}
            {!showPricing && membershipType === "trial" && (
                <Card className="text-center border-0 shadow-xl bg-linear-to-br from-blue-50 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-900/20">
                    <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 shadow-lg">
                                <Zap className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">Free Plan Active</h3>
                        <p className="text-muted-foreground text-sm sm:text-base mb-4 max-w-md mx-auto">
                            You&apos;re currently on our <strong>Free</strong> plan. Upgrade to access premium features and enhanced capabilities for your restaurant.
                        </p>
                        <Button 
                            onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
                            variant="default"
                        >
                            View Upgrade Options
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}