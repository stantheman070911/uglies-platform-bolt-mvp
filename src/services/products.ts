import { supabase, handleSupabaseError } from './supabase';
import type { Product as ProductType, ProductWithDetails } from '@/types/products';

// Interface for product filtering options.
export interface ProductFilters {
  categoryName?: string;
  farmerId?: string;
  qualityGrade?: string;
  search?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
}

export class ProductService {
  /**
   * Fetches a list of products using the `products_with_details` VIEW.
   */
  static async getProducts(filters: ProductFilters = {}): Promise<{ success: boolean; data: ProductWithDetails[]; count: number; error?: string; }> {
    try {
      let query = supabase
        .from('products_with_details')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters.categoryName) {
        query = query.eq('category_name', filters.categoryName);
      }
      if (filters.farmerId) {
        query = query.eq('farmer_id', filters.farmerId);
      }
      if (filters.qualityGrade) {
        query = query.eq('quality_grade', filters.qualityGrade);
      }
      if (filters.featured) {
        query = query.eq('featured', true);
      }
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm},farmer_name.ilike.${searchTerm},category_name.ilike.${searchTerm}`);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: (data as ProductWithDetails[]) || [],
        count: count || 0,
      };
    } catch (error: any) {
      console.error('ProductService.getProducts error:', error.message);
      return {
        success: false,
        error: handleSupabaseError(error),
        data: [],
        count: 0,
      };
    }
  }

  /**
   * Fetches a single product by its ID using the `products_with_details` VIEW.
   */
  static async getProductById(id: string): Promise<{ success: boolean; data?: ProductWithDetails; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products_with_details')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Product not found or not active.', data: undefined };
        }
        throw error;
      }
      return { success: true, data: data as ProductWithDetails };
    } catch (error: any) {
      console.error(`ProductService.getProductById error (id: ${id}):`, error.message);
      return { success: false, error: handleSupabaseError(error) };
    }
  }
  
  /**
   * Fetches featured products.
   */
  static async getFeaturedProducts(limit: number = 3): Promise<{ success: boolean; data?: ProductWithDetails[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products_with_details')
        .select('*')
        .eq('is_active', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data: data as ProductWithDetails[] };
    } catch (error: any) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
}