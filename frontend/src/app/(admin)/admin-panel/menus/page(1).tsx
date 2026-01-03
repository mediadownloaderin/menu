"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Save, RefreshCw, Crown, Zap, Star, User, CreditCard, Eye } from "lucide-react";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { MembershipType, RestaurantType } from "@/lib/types";
import BouncingDotsLoader from "@/components/ui/bounce-loader";

interface User {
    id: number;
    email: string;
}

export default function AllRestaurants() {
    const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
    const [modifiedRestaurants, setModifiedRestaurants] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        getAllRestaurants();
    }, []);

    const getAllRestaurants = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${config.backend_url}/api/admin/all-restaurants`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch restaurants");
            }

            const data = await res.json();
            setRestaurants(data);
            setModifiedRestaurants(new Set());
        } catch (error) {
            console.error(error);
            toast.error("Failed to get restaurants");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMembershipChange = (
        restaurantId: number,
        field: "membershipType" | "expiryDate",
        value: string | number
    ) => {
        setRestaurants((prev) =>
            prev.map((restaurant) => {
                if (restaurant.id === restaurantId) {
                    const updatedRestaurant = { ...restaurant };

                    if (field === "membershipType") {
                        updatedRestaurant.membershipType = value as MembershipType;
                    } else if (field === "expiryDate") {
                        updatedRestaurant.expiryDate = value as number;
                    }

                    return updatedRestaurant;
                }
                return restaurant;
            })
        );

        setModifiedRestaurants((prev) => new Set(prev).add(restaurantId));
    };

    const updateMembership = async (restaurantId: number) => {
        const restaurant = restaurants.find((r) => r.id === restaurantId);
        if (!restaurant) return;

        setUpdatingIds((prev) => new Set(prev).add(restaurantId));

        try {
            const res = await fetch(`${config.backend_url}/api/admin/restaurants/${restaurantId}/membership`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    membershipType: restaurant.membershipType,
                    expiryDate: restaurant.expiryDate,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update membership");
            }

            setModifiedRestaurants((prev) => {
                const newSet = new Set(prev);
                newSet.delete(restaurantId);
                return newSet;
            });

            toast.success(`Updated membership for ${restaurant.name}`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to update ${restaurant.name}`);
        } finally {
            setUpdatingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(restaurantId);
                return newSet;
            });
        }
    };

    const updateAllModified = async () => {
        const updatePromises = Array.from(modifiedRestaurants).map((id) => updateMembership(id));
        await Promise.all(updatePromises);
    };

    const getMembershipIcon = (type: MembershipType) => {
        switch (type) {
            case "trial":
                return <Zap className="h-4 w-4" />;
            case "basic":
                return <CreditCard className="h-4 w-4" />;
            case "lifetime":
                return <Crown className="h-4 w-4 text-purple-500" />;
            default:
                return <CreditCard className="h-4 w-4" />;
        }
    };

    const getMembershipColor = (type: MembershipType) => {
        switch (type) {
            case "trial":
                return "bg-blue-100 text-blue-800";
            case "basic":
                return "bg-gray-100 text-gray-800";
            case "lifetime":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const isExpired = (expiryDate: number | undefined) => {
        if (!expiryDate) return false;
        return expiryDate < Date.now();
    };

    

    return (
        <>
        {
            isLoading?<BouncingDotsLoader/>:
            <div className="sm:p-6 p-0 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Restaurant Management</h1>
                    <p className="text-muted-foreground">Manage membership plans for all restaurants</p>
                </div>

                <div className="flex gap-2">
                    {modifiedRestaurants.size > 0 && (
                        <Button
                            onClick={updateAllModified}
                            className="gap-2"
                            disabled={updatingIds.size > 0}
                        >
                            <Save className="h-4 w-4" />
                            Save All ({modifiedRestaurants.size})
                        </Button>
                    )}
                    <Button variant="outline" onClick={getAllRestaurants} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Restaurant Name</TableHead>
                                <TableHead>Owner Email</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Membership</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {restaurants.map((restaurant) => {
                                const membershipType: MembershipType = restaurant.membershipType || "trial";
                                const expiryDate = restaurant.expiryDate;
                                
                                const isModified = modifiedRestaurants.has(restaurant.id);
                                const isUpdating = updatingIds.has(restaurant.id);
                                const expired = isExpired(expiryDate);

                                return (
                                    <TableRow
                                        key={restaurant.id}
                                        className={
                                            isModified ? "bg-blue-50" : expired ? "bg-red-50" : ""
                                        }
                                    >
                                        <TableCell>
                                            <div className="font-medium">{restaurant.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-xs">
                                                {restaurant.owner || "Unknown owner"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-sm bg-muted px-2 py-1 rounded">/{restaurant.slug}</code>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={membershipType}
                                                onValueChange={(value) =>
                                                    handleMembershipChange(restaurant.id, "membershipType", value as MembershipType)
                                                }
                                                disabled={isUpdating}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="trial">Trial</SelectItem>
                                                    <SelectItem value="basic">Basic</SelectItem>
                                                    <SelectItem value="lifetime">Lifetime</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            {membershipType !== 'lifetime' ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="date"
                                                        value={
                                                            expiryDate
                                                                ? new Date(expiryDate).toISOString().split("T")[0]
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            handleMembershipChange(
                                                                restaurant.id,
                                                                "expiryDate",
                                                                new Date(e.target.value).getTime()
                                                            )
                                                        }
                                                        disabled={isUpdating}
                                                        className={`w-36 ${expired ? "border-red-300" : ""}`}
                                                    />
                                                </div>
                                            ) : <div>None</div>}
                                        </TableCell>
                                        <TableCell>
                                            {membershipType !== 'lifetime' ? (
                                                <div className="flex flex-row gap-1">
                                                    <Badge 
                                                        className={`${getMembershipColor(membershipType)} w-fit text-xs`}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            {getMembershipIcon(membershipType)}
                                                            {membershipType.charAt(0).toUpperCase() + membershipType.slice(1)}
                                                        </div>
                                                    </Badge>
                                                    {expired && (
                                                        <Badge variant="destructive" className="w-fit text-xs">
                                                            Expired
                                                        </Badge>
                                                    )}
                                                    {isModified && (
                                                        <Badge variant="outline" className="w-fit text-xs animate-pulse">
                                                            Unsaved
                                                        </Badge>
                                                    )}
                                                </div>
                                            ) : (
                                                <Badge className={`${getMembershipColor(membershipType)} w-fit text-xs`}>
                                                    <div className="flex items-center gap-1">
                                                        {getMembershipIcon(membershipType)}
                                                        Platinum
                                                    </div>
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => updateMembership(restaurant.id)}
                                                    disabled={!isModified || isUpdating}
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    {isUpdating ? (
                                                        <RefreshCw className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <Save className="h-3 w-3" />
                                                    )}
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={() => window.open(`/s?slug=${restaurant.slug}`, '_blank')}
                                                    variant={'outline'}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {restaurants.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Restaurants Found</h3>
                            <p className="text-muted-foreground text-center">
                                There are no restaurants in the system yet.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        }</>
    );
}