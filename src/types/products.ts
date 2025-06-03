export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  currency: string;
  unit: string;
  stockQuantity: number;
  images: string[];
  categoryId: string;
  farmerId: string;
  rating?: number;
  reviewCount?: number;
  isOrganic: boolean;
  isFeatured: boolean;
  nutritionalInfo?: string;
  harvestDate?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
}

export enum ProductSortOption {
  PRICE_LOW = 'price_low',
  PRICE_HIGH = 'price_high',
  NEWEST = 'newest',
  POPULAR = 'popular',
  RATING = 'rating'
}

export interface ProductFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  searchTerm?: string;
  sortBy?: ProductSortOption;
}