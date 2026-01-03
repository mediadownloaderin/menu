export interface UserType {
  id: number,
  email: string
}

export interface RestaurantType {
  id: number;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  owner?: number,
  description?: string;
  favicon?: string;
  banner?: string;
  whatsAppNumber?: string;
  membershipType?: MembershipType;
  expiryDate?:number;
  settings?: Settings;
};

export type MembershipType = "trial" | "basic" | "lifetime";


export interface PlanType {
  id: number;
  name: string;
  description: string;
  price: string;
  type: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface ImageType {
  id: string;
  url: string;
};

export interface CategoryType {
  id: number,
  name: string,
  order?: number,
  imageUrl?: string
}

export interface MenuType {
  id: number,
  name: string,
  description?: string,
  price: number,
  salePrice?: number,
  images: string[],
  categories: number[],
  type: string,
  link?: "string",
  minOrder: 1,
  stock: -1,
  unit?: "",
  variant?: VariantType[],
  variants?: VariantType[],
}

export interface CartItemType {
  id: number,
  name: string,
  price: number,
  quantity: number,
  minOrder: number
}


export interface VariantType {
  type: string,
  value: string,
  price: number
}



export interface Settings {
  address:string;
  whatsapp:string;
  facebook:string;
  instagram:string;
  swiggy:string;
  zomato:string;
  isGrid:boolean;
  banner:string;
  phone:string;

  logo:string;
  currency:currencyType;
  countryCode:string;

  minOrderPrice: number;
  shippingCharges: number;
  pickup: boolean;
  delivery: boolean;
  addressType: string;
  
}


export interface currencyType{
  code:string;
  name:string;
  symbol:string;
}