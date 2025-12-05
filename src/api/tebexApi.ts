/**
 * Tebex API Client
 * Frontend API calls to backend Tebex proxy endpoints
 * Based on: https://docs.tebex.io/developers/headless-api/endpoints
 * 
 * Ahora usa axios a través de apiClient para:
 * - Parsing JSON automático
 * - Mejor manejo de errores
 * - Interceptors centralizados
 * - Timeouts configurados
 */

import apiClient from './client';
import type {
  TebexPackage,
  TebexCategory,
  TebexBasket,
  TebexWebstore,
} from '../types/TebexTypes';

// ============================================
// WEBSTORE INFO
// ============================================

/**
 * Fetch webstore information
 */
export async function fetchWebstore(): Promise<TebexWebstore> {
  const { data } = await apiClient.get('/tebex/webstore');
  return data.data;
}

/**
 * Fetch custom pages
 */
export async function fetchPages(): Promise<unknown[]> {
  const { data } = await apiClient.get('/tebex/pages');
  return data.data || [];
}

// ============================================
// CATEGORIES & PACKAGES
// ============================================

/**
 * Fetch all categories
 * @param includePackages - Whether to include packages in each category
 */
export async function fetchCategories(
  includePackages = false
): Promise<TebexCategory[]> {
  const { data } = await apiClient.get('/tebex/categories', {
    params: includePackages ? { includePackages: 'true' } : {},
  });
  return data.data || [];
}

/**
 * Fetch a specific category
 * @param categoryId - The category ID
 * @param includePackages - Whether to include packages
 */
export async function fetchCategory(
  categoryId: number,
  includePackages = false
): Promise<TebexCategory> {
  const { data } = await apiClient.get(`/tebex/categories/${categoryId}`, {
    params: includePackages ? { includePackages: 'true' } : {},
  });
  return data.data;
}

/**
 * Fetch all packages from the store
 */
export async function fetchPackages(): Promise<TebexPackage[]> {
  const { data } = await apiClient.get('/tebex/packages');
  return data.data || [];
}

/**
 * Fetch a specific package by ID
 */
export async function fetchPackage(packageId: number): Promise<TebexPackage> {
  const { data } = await apiClient.get(`/tebex/packages/${packageId}`);
  return data.data;
}

// ============================================
// BASKETS
// ============================================

interface CreateBasketOptions {
  complete_url?: string;
  cancel_url?: string;
}

/**
 * Create a new basket
 */
export async function createBasket(
  options?: CreateBasketOptions
): Promise<TebexBasket> {
  const { data } = await apiClient.post('/tebex/baskets', options || {});
  return data.data;
}

/**
 * Fetch basket details
 */
export async function fetchBasket(basketIdent: string): Promise<TebexBasket> {
  const { data } = await apiClient.get(`/tebex/baskets/${basketIdent}`);
  return data.data;
}

/**
 * Get authentication links for a basket
 */
export async function getBasketAuthLinks(
  basketIdent: string,
  returnUrl?: string
): Promise<{ name: string; url: string }[]> {
  const { data } = await apiClient.get(`/tebex/baskets/${basketIdent}/auth`, {
    params: returnUrl ? { returnUrl } : {},
  });
  return data.data || [];
}

// ============================================
// BASKET PACKAGE OPERATIONS
// ============================================

/**
 * Add a package to the basket
 */
export async function addPackageToBasket(
  basketIdent: string,
  packageId: number,
  quantity = 1
): Promise<TebexBasket> {
  const { data } = await apiClient.post(`/tebex/baskets/${basketIdent}/packages`, {
    package_id: packageId,
    quantity,
  });
  return data;
}

/**
 * Remove a package from the basket
 */
export async function removePackageFromBasket(
  basketIdent: string,
  packageId: number
): Promise<TebexBasket> {
  const { data } = await apiClient.post(`/tebex/baskets/${basketIdent}/packages/remove`, {
    package_id: packageId,
  });
  return data;
}

/**
 * Update package quantity in basket
 */
export async function updatePackageQuantity(
  basketIdent: string,
  packageId: number,
  quantity: number
): Promise<{ success: boolean }> {
  const { data } = await apiClient.put(`/tebex/baskets/${basketIdent}/packages/${packageId}`, {
    quantity,
  });
  return data;
}

// ============================================
// PROMOTIONS & DISCOUNTS
// ============================================

/**
 * Apply a coupon code to the basket
 */
export async function applyCoupon(
  basketIdent: string,
  couponCode: string
): Promise<TebexBasket> {
  const { data } = await apiClient.post(`/tebex/baskets/${basketIdent}/coupons`, {
    coupon_code: couponCode,
  });
  return data;
}

/**
 * Remove coupon from basket
 */
export async function removeCoupon(basketIdent: string): Promise<TebexBasket> {
  const { data } = await apiClient.post(`/tebex/baskets/${basketIdent}/coupons/remove`);
  return data;
}

/**
 * Apply a gift card to the basket
 */
export async function applyGiftCard(
  basketIdent: string,
  cardNumber: string
): Promise<TebexBasket> {
  const { data } = await apiClient.post(`/tebex/baskets/${basketIdent}/giftcards`, {
    card_number: cardNumber,
  });
  return data;
}

/**
 * Remove gift card from basket
 */
export async function removeGiftCard(basketIdent: string): Promise<TebexBasket> {
  const { data } = await apiClient.post(`/tebex/baskets/${basketIdent}/giftcards/remove`);
  return data;
}

/**
 * Apply a creator code to the basket
 */
export async function applyCreatorCode(
  basketIdent: string,
  creatorCode: string
): Promise<TebexBasket> {
  const { data } = await apiClient.post(`/tebex/baskets/${basketIdent}/creator-codes`, {
    creator_code: creatorCode,
  });
  return data;
}

/**
 * Remove creator code from basket
 */
export async function removeCreatorCode(basketIdent: string): Promise<TebexBasket> {
  const { data } = await apiClient.post(`/tebex/baskets/${basketIdent}/creator-codes/remove`);
  return data;
}

// ============================================
// SIDEBAR
// ============================================

interface SidebarModule {
  id: number;
  type: string | null;
  start_time: string;
  end_time: string | null;
  data: Record<string, unknown>;
}

/**
 * Fetch sidebar modules (top customers, recent purchases, etc.)
 */
export async function fetchSidebar(): Promise<SidebarModule[]> {
  const { data } = await apiClient.get('/tebex/sidebar');
  return data.data || [];
}
