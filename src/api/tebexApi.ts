import { apiClient } from './client';
import type { 
  TebexPackagesResponse, 
  TebexCategoriesResponse, 
  TebexBasketResponse 
} from '../types/TebexTypes';

// Fetch all packages from Tebex
export const getPackages = async (): Promise<TebexPackagesResponse> => {
  const response = await apiClient.get<TebexPackagesResponse>('/tebex/packages');
  return response.data;
};

// Fetch all categories from Tebex
export const getCategories = async (): Promise<TebexCategoriesResponse> => {
  const response = await apiClient.get<TebexCategoriesResponse>('/tebex/categories');
  return response.data;
};

// Create a new basket
export const createBasket = async (): Promise<TebexBasketResponse> => {
  const response = await apiClient.post<TebexBasketResponse>('/tebex/basket', {
    complete_url: `${window.location.origin}/store?success=true`,
    cancel_url: `${window.location.origin}/store?cancelled=true`,
  });
  return response.data;
};

// Add a package to the basket
export const addPackageToBasket = async (
  basketIdent: string, 
  packageId: number, 
  quantity: number = 1
): Promise<TebexBasketResponse> => {
  const response = await apiClient.post<TebexBasketResponse>(
    `/tebex/basket/${basketIdent}/packages`,
    { package_id: packageId, quantity }
  );
  return response.data;
};

// Get basket details
export const getBasket = async (basketIdent: string): Promise<TebexBasketResponse> => {
  const response = await apiClient.get<TebexBasketResponse>(`/tebex/basket/${basketIdent}`);
  return response.data;
};

