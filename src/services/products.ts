import { supabase, handleSupabaseError } from './supabase';
import type { ProductWithDetails } from '@/types/products';

export class ProductService {
  static async getProducts() {
    // ... existing method implementation
  }

  static async getProductById() {
    // ... existing method implementation
  }

  static async createProduct() {
    // ... existing method implementation
  }

  static async updateProduct() {
    // ... existing method implementation
  }

  static async deleteProduct() {
    // ... existing method implementation
  }

  /**
   * Fetches featured products.
   * @param {number} limit - The maximum number of featured products to return.
   * @returns {Promise<{ success: boolean; data?: ProductWithDetails[]; error?: string }>}
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
    } catch (error) {
      return { success: false, error: handleSupabaseError(error), data: [] };
    }
  }
}