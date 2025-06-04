import { supabase, handleSupabaseError } from './supabase';

export interface ProductFilters {
  category?: string;
  region?: string;
  farmerId?: string;
  qualityTier?: string;
  priceRange?: { min: number; max: number };
  search?: string;
  limit?: number;
  offset?: number;
}

export interface Product {
  id: string;
  farmer_id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  currency: string;
  unit: string;
  inventory_available: number;
  quality_tier: string;
  seasonality: string;
  harvest_date?: string;
  images: string[];
  is_active: boolean;
  is_organic: boolean;
  is_featured: boolean;
  rating?: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  farmer?: {
    id: string;
    display_name: string;
    region: string;
    avatar_url?: string;
    bio?: string;
  };
}

export class ProductService {
  static async getProducts(filters: ProductFilters = {}) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          farmer:users!farmer_id (
            id,
            display_name,
            region,
            avatar_url,
            bio
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.farmerId) {
        query = query.eq('farmer_id', filters.farmerId);
      }

      if (filters.qualityTier) {
        query = query.eq('quality_tier', filters.qualityTier);
      }

      if (filters.priceRange) {
        query = query
          .gte('base_price', filters.priceRange.min)
          .lte('base_price', filters.priceRange.max);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // FIXED: Region filter - first get farmers in the region, then filter products
      if (filters.region) {
        // Get farmers in the specified region first
        const { data: farmersInRegion } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'farmer')
          .eq('region', filters.region);
        
        if (farmersInRegion && farmersInRegion.length > 0) {
          const farmerIds = farmersInRegion.map(f => f.id);
          query = query.in('farmer_id', farmerIds);
        } else {
          // No farmers in this region, return empty result
          return {
            success: true,
            data: [],
            count: 0
          };
        }
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        count: data?.length || 0
      };
    } catch (error) {
      console.error('ProductService.getProducts error:', error);
      return {
        success: false,
        error: handleSupabaseError(error),
        data: [],
        count: 0
      };
    }
  }

  static async getProductById(id: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          farmer:users!farmer_id (
            id,
            display_name,
            region,
            avatar_url,
            bio,
            phone_number
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: handleSupabaseError(error),
        data: null
      };
    }
  }

  static async createProduct(productData: Partial<Product>) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: handleSupabaseError(error),
        data: null
      };
    }
  }

  static async updateProduct(id: string, updates: Partial<Product>) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: handleSupabaseError(error),
        data: null
      };
    }
  }

  static async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: handleSupabaseError(error)
      };
    }
  }

  static async getFeaturedProducts(limit = 10) {
    return this.getProducts({
      limit,
      // Can add featured filter if you have is_featured column
    });
  }

  static async getProductsByCategory(category: string, limit = 20) {
    return this.getProducts({
      category,
      limit
    });
  }

  static async getProductsByFarmer(farmerId: string, limit = 50) {
    return this.getProducts({
      farmerId,
      limit
    });
  }

  static async searchProducts(searchTerm: string, limit = 20) {
    return this.getProducts({
      search: searchTerm,
      limit
    });
  }
}