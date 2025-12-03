/**
 * Tebex API Types
 * Based on: https://docs.tebex.io/developers/headless-api/endpoints
 */

export interface TebexWebstore {
  id: number;
  description: string;
  name: string;
  webstore_url: string;
  currency: string;
  lang: string;
  logo: string | null;
  platform_type: string;
  platform_type_id: string;
  created_at: string;
}

export interface TebexPackage {
  id: number;
  name: string;
  description: string;
  type: string;
  disable_quantity: boolean;
  disable_gifting: boolean;
  expiration_date: string | null;
  created_at: string;
  updated_at: string;
  base_price: number;
  sales_price: number | null;
  total_price: number;
  currency: string;
  discount: number;
  image: string | null;
  category: TebexCategory | null;
}

export interface TebexCategory {
  id: number;
  name: string;
  description: string;
  packages: TebexPackage[];
  order: number;
}

export interface TebexBasket {
  ident: string;
  complete: boolean;
  id: number;
  country: string;
  ip: string;
  username_id: number | null;
  username: string | null;
  cancel_url: string;
  complete_url: string;
  complete_auto_redirect: boolean;
  base_price: number;
  sales_tax: number;
  total_price: number;
  currency: string;
  packages: TebexBasketPackage[];
  coupons: unknown[];
  giftcards: unknown[];
  creator_code: string | null;
  links: {
    checkout: string;
  };
}

export interface TebexBasketPackage {
  id: number;
  name: string;
  description: string;
  in_basket: {
    quantity: number;
    price: number;
    gift_username_id: number | null;
  };
}

export interface TebexApiResponse<T> {
  data: T;
}

export interface TebexPackagesResponse {
  data: TebexPackage[];
}

export interface TebexCategoriesResponse {
  data: TebexCategory[];
}

export interface TebexBasketResponse {
  data: TebexBasket;
}

