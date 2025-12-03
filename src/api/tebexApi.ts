/**
 * Tebex API Client
 * Frontend API calls to backend Tebex proxy endpoints
 * Based on: https://docs.tebex.io/developers/headless-api/endpoints
 */

import type {
  TebexPackage,
  TebexCategory,
  TebexBasket,
  TebexWebstore,
} from '../types/TebexTypes';

const API_BASE = 'http://localhost:3001/api/tebex';

// ============================================
// WEBSTORE INFO
// ============================================

/**
 * Fetch webstore information
 */
export async function fetchWebstore(): Promise<TebexWebstore> {
  const response = await fetch(`${API_BASE}/webstore`);
  if (!response.ok) throw new Error('Failed to fetch webstore');
  const data = await response.json();
  return data.data;
}

/**
 * Fetch custom pages
 */
export async function fetchPages(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/pages`);
  if (!response.ok) throw new Error('Failed to fetch pages');
  const data = await response.json();
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
  const url = includePackages
    ? `${API_BASE}/categories?includePackages=true`
    : `${API_BASE}/categories`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch categories');
  const data = await response.json();
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
  const url = includePackages
    ? `${API_BASE}/categories/${categoryId}?includePackages=true`
    : `${API_BASE}/categories/${categoryId}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch category');
  const data = await response.json();
  return data.data;
}

/**
 * Fetch all packages from the store
 */
export async function fetchPackages(): Promise<TebexPackage[]> {
  const response = await fetch(`${API_BASE}/packages`);
  if (!response.ok) throw new Error('Failed to fetch packages');
  const data = await response.json();
  return data.data || [];
}

/**
 * Fetch a specific package by ID
 */
export async function fetchPackage(packageId: number): Promise<TebexPackage> {
  const response = await fetch(`${API_BASE}/packages/${packageId}`);
  if (!response.ok) throw new Error('Failed to fetch package');
  const data = await response.json();
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
  const response = await fetch(`${API_BASE}/baskets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options || {}),
  });
  if (!response.ok) throw new Error('Failed to create basket');
  const data = await response.json();
  return data.data;
}

/**
 * Fetch basket details
 */
export async function fetchBasket(basketIdent: string): Promise<TebexBasket> {
  const response = await fetch(`${API_BASE}/baskets/${basketIdent}`);
  if (!response.ok) throw new Error('Failed to fetch basket');
  const data = await response.json();
  return data.data;
}

/**
 * Get authentication links for a basket
 */
export async function getBasketAuthLinks(
  basketIdent: string,
  returnUrl?: string
): Promise<{ name: string; url: string }[]> {
  const url = returnUrl
    ? `${API_BASE}/baskets/${basketIdent}/auth?returnUrl=${encodeURIComponent(returnUrl)}`
    : `${API_BASE}/baskets/${basketIdent}/auth`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to get auth links');
  const data = await response.json();
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
  const response = await fetch(`${API_BASE}/baskets/${basketIdent}/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ package_id: packageId, quantity }),
  });
  if (!response.ok) throw new Error('Failed to add package to basket');
  return response.json();
}

/**
 * Remove a package from the basket
 */
export async function removePackageFromBasket(
  basketIdent: string,
  packageId: number
): Promise<TebexBasket> {
  const response = await fetch(
    `${API_BASE}/baskets/${basketIdent}/packages/remove`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ package_id: packageId }),
    }
  );
  if (!response.ok) throw new Error('Failed to remove package from basket');
  return response.json();
}

/**
 * Update package quantity in basket
 */
export async function updatePackageQuantity(
  basketIdent: string,
  packageId: number,
  quantity: number
): Promise<{ success: boolean }> {
  const response = await fetch(
    `${API_BASE}/baskets/${basketIdent}/packages/${packageId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    }
  );
  if (!response.ok) throw new Error('Failed to update quantity');
  return response.json();
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
  const response = await fetch(`${API_BASE}/baskets/${basketIdent}/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coupon_code: couponCode }),
  });
  if (!response.ok) throw new Error('Failed to apply coupon');
  return response.json();
}

/**
 * Remove coupon from basket
 */
export async function removeCoupon(
  basketIdent: string
): Promise<TebexBasket> {
  const response = await fetch(
    `${API_BASE}/baskets/${basketIdent}/coupons/remove`,
    { method: 'POST' }
  );
  if (!response.ok) throw new Error('Failed to remove coupon');
  return response.json();
}

/**
 * Apply a gift card to the basket
 */
export async function applyGiftCard(
  basketIdent: string,
  cardNumber: string
): Promise<TebexBasket> {
  const response = await fetch(`${API_BASE}/baskets/${basketIdent}/giftcards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ card_number: cardNumber }),
  });
  if (!response.ok) throw new Error('Failed to apply gift card');
  return response.json();
}

/**
 * Remove gift card from basket
 */
export async function removeGiftCard(
  basketIdent: string
): Promise<TebexBasket> {
  const response = await fetch(
    `${API_BASE}/baskets/${basketIdent}/giftcards/remove`,
    { method: 'POST' }
  );
  if (!response.ok) throw new Error('Failed to remove gift card');
  return response.json();
}

/**
 * Apply a creator code to the basket
 */
export async function applyCreatorCode(
  basketIdent: string,
  creatorCode: string
): Promise<TebexBasket> {
  const response = await fetch(
    `${API_BASE}/baskets/${basketIdent}/creator-codes`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creator_code: creatorCode }),
    }
  );
  if (!response.ok) throw new Error('Failed to apply creator code');
  return response.json();
}

/**
 * Remove creator code from basket
 */
export async function removeCreatorCode(
  basketIdent: string
): Promise<TebexBasket> {
  const response = await fetch(
    `${API_BASE}/baskets/${basketIdent}/creator-codes/remove`,
    { method: 'POST' }
  );
  if (!response.ok) throw new Error('Failed to remove creator code');
  return response.json();
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
  const response = await fetch(`${API_BASE}/sidebar`);
  if (!response.ok) throw new Error('Failed to fetch sidebar');
  const data = await response.json();
  return data.data || [];
}
