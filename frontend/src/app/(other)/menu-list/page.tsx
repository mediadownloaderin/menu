"use client"
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import Logo from '@/components/ui/logo'
import { Skeleton } from '@/components/ui/skeleton'
import { config } from '@/lib/config'
import { useAuth } from '@/lib/context/auth-context/auth-context'
import { RestaurantType } from '@/lib/types'
import { Plus, LinkIcon, ExternalLink, LayoutDashboard, StoreIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function StoreList() {
    const { isAuthLoading, user, token } = useAuth();
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<RestaurantType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user) {
            router.push('/signin');
        }

        const fetchRestaurants = async () => {
            try {
                const res = await fetch(`${config.backend_url}/api/restaurant/get-all`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                })
                if (!res.ok) return router.push('/onboarding')

                const data = await res.json();
                console.log("DATA", data)
                if (!data.restaurants || data.restaurants.length === 0) {
                    router.push('/onboarding')
                } else {
                    console.log("restaurants", data.restaurants)
                    setRestaurants(data.restaurants)
                }
            } catch (error) {
                console.error('Failed to fetch restaurants:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRestaurants();







    }, [isAuthLoading, router, token, user])




    if (isLoading) {
        return (
            <div className="p-6 max-w-3xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-10 w-[120px]" />
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-[180px]" />
                                <Skeleton className="h-4 w-[220px]" />
                            </CardHeader>
                            <CardContent className="flex gap-3 pb-6">
                                <Skeleton className="h-10 w-[120px]" />
                                <Skeleton className="h-10 w-[150px]" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (!restaurants) return <div className="p-6">No restaurants found</div>



    return (
        <div className="min-w-screen mx-auto p-4 md:p-2 space-y-6 min-h-screen">
            {/* Header Section */}
            <div className="pb-4 shadow-md md:p-6 flex mx-0 flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b">
                <Logo />

            </div>
            <div className='w-full p-4 flex items-center justify-between'>
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-semibold">Digital Menu List</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your digital menus and access their dashboards here
                    </p>
                </div>
                <div className='flex flex-col sm:flex-row w-full md:w-auto gap-2'>
                    <Button
                        onClick={() => router.push('/onboarding')}
                        className="w-full md:w-auto"
                        variant="default"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add More Digital Menu
                    </Button>
                    {/* <Logout /> */}
                </div>
            </div>
            {/* restaurants Grid */}
            {restaurants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 mx-2 rounded-lg border border-dashed">
                    <StoreIcon className="h-10 w-10 mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Menu for any Restaurants yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Get started by creating your first store</p>
                    <Button
                        onClick={() => router.push('/onboarding')}
                        variant="outline"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Digital menu
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {restaurants.map((store) => {
                        const domain = store.domain || `${config.frontend_url}/s?slug=${store.slug}`
                        const dashboardUrl = `${config.frontend_url}/s/dashboard/home?slug=${store.slug}`

                        return (
                            <Card
                                key={store.id}
                                className="hover:shadow transition-all duration-200 overflow-hidden"
                            >
                                <CardHeader>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 rounded-lg bg-muted">
                                            <StoreIcon className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <CardTitle 
                                            onClick={() => window.open(`${domain}`, '_blank')} className="text-lg">
                                                <p className='flex items-center justify-start gap-3  '>{store.name} 
                                            <ExternalLink className="mr-2 h-4 w-4" /></p>
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2">
                                                <LinkIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                <span className="truncate text-sm">{domain}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
                                                                               <Button
                                            className="flex-1 bg-red-800"
                                            onClick={() => window.open(`${dashboardUrl}`, '_blank')}

                                        >
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                           Open Dashboard
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}