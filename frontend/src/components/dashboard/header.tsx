import { Button } from "../ui/button";
import Logo from "../ui/logo";
import { SidebarTrigger } from "../ui/sidebar";
import { useRestaurant } from "@/lib/context/restaurant-context/use-restaurant";
import { useRouter, useSearchParams } from "next/navigation";

export function DashboardHeader() {
    const restaurant = useRestaurant();
    const slug = useSearchParams().get("slug");
    const router = useRouter();

    const expiry = restaurant?.expiryDate;

    // expiryDate is already a millisecond timestamp (e.g., 1764252586307)
    const expiryTime = typeof expiry === "number" ? expiry : null;

    // Calculate days left – ensure non-negative
    const daysLeft = expiryTime
        ? Math.max(0, (expiryTime - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

    // Show button if ≤ 2 days left AND not lifetime AND not expired
    const showButton =
        daysLeft !== null &&
        daysLeft <= 3 &&
        daysLeft > 0 &&
        restaurant?.membershipType !== "lifetime";

    return (
        <header className=" fixed sm:left-64 left-0 right-0 top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-white px-4 shadow-sm">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div className="flex items-center gap-2 bg-white rounded-lg border-2 border-white/20">
                    <Logo />
                </div>
            </div>

            {showButton && (
                <Button
                    onClick={() => {
                        router.push(`/s/dashboard/membership?slug=${slug}`);
                    }}
                    variant="ghost"
                    className="px-4 py-2 animate-pulse bg-red-100 text-red-700 rounded-lg border border-red-200 hover:bg-red-200"
                >
                    Expires in {Math.ceil(daysLeft)}{" "}
                    {Math.ceil(daysLeft) === 1 ? "day" : "days"}
                </Button>
            )}
        </header>
    );
}
