import { MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRestaurant } from '@/lib/context/restaurant-context/use-restaurant';
import { Img } from '../ui/img-component';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function RestaurantHeader() {
    const resContext = useRestaurant();
    if (resContext)
        return (
            <div className="relative">
                {/* Banner with gradient overlay */}
                {resContext.settings?.banner && (
                    <div className="w-full overflow-hidden relative h-48 sm:h-56 md:h-64">
                        <div className="w-full h-full">
                            <Img
                                src={resContext.settings?.banner}
                                alt={`${resContext.name} banner`}
                                className="w-full h-full object-cover"
                            />

                            {resContext.settings?.logo && (
                                <div className="absolute inset-0 flex items-center justify-center -translate-y-6 sm:-translate-y-8">
                                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white flex items-center justify-center">
                                        <Avatar className="w-18 h-18 sm:w-26 sm:h-26">
                                            <AvatarImage src={resContext.settings?.logo} />
                                            <AvatarFallback>ML</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                            )}


                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-black/5" />
                        </div>
                    </div>
                )}


                {/* Content area */}
                <div
                    className={`relative bg-white pb-6 ${resContext.settings?.banner ? '-mt-12 rounded-t-3xl pt-6' : 'pt-6'
                        } `}
                >
                    {/* Logo */}


                    {/* Restaurant info */}
                    <div className="text-left mt-6 px-4 sm:px-6  mx-auto">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                            {resContext?.name}
                        </h1>

                        {/* Address */}
                        {resContext.settings?.address && (
                            <div className="flex items-center text-left justify-start gap-1 text-gray-600 mt-2 text-sm sm:text-base">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span>{resContext.settings?.address}</span>


                                {/* Phone */}
                                {resContext.settings?.phone && (
                                    <Link className=' ml-4 flex items-center justify-center gap-2' href={`tel:`}>
                                        <Phone className="w-3 h-3 flex-shrink-0" />
                                        <span>{resContext.settings.phone}</span></Link>
                                )}

                            </div>
                        )}


                        {/* Description */}
                        {resContext?.description && (
                            <div className="flex items-center text-left justify-start gap-1 text-gray-600 mt-1 text-sm sm:text-base">
                                <span>{resContext?.description}</span>
                            </div>
                        )}




                    </div>
                </div>
            </div>
        );
}