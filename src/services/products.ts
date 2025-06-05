/**
 * @file src/services/products.ts
 * @description Service for all product-related database operations.
 * Uses the `products_with_details` database VIEW for efficient querying.
 * Aligned with the schema from `rough_fire.sql`.
 * Adherence to "Violent Psychopath Maintenance Standard":
 * - JSDoc for clarity.
 * - Strong typing.
 * - Centralized error handling.
 */
import { supabase, handleSupabaseError } from './supabase';
// Assuming ProductType is defined based on your `products` table in `rough_fire.sql`
import type { Product as ProductType } from '@/types/products'; 

// Interface for the data structure returned by the `products_with_details` VIEW.
// This should accurately reflect all columns selected in the VIEW definition.
export interface ProductWithDetails extends ProductType {
  farmer_name: string | null;
  farmer_bio: string | null;
  farmer_avatar_url: string | null;
  farmer_role: string | null;
  // farmer_region: string | null; // Add this if you add `region` to your `users` table and the VIEW
  category_name: string | null;
  category_description: string | null;
}

// Interface for product filtering options.
export interface ProductFilters {
  categoryName?: string; // Filter by category_name from the VIEW
  farmerId?: string;
  qualityGrade?: string; // Matches 'quality_grade' in products table
  search?: string;
  limit?: number;
  offset?: number;
  // region?: string; // For filtering by farmer's region - requires `region` on `users` table
}

export class ProductService {
  /**
   * Fetches a list of products using the `products_with_details` VIEW.
   * @param {ProductFilters} filters - Filtering options.
   * @returns {Promise<{ success: boolean; data: ProductWithDetails[]; count: number; error?: string; }>}
   * The list of products, total count for pagination, and error status.
   */
  static async getProducts(filters: ProductFilters = {}): Promise<{ success: boolean; data: ProductWithDetails[]; count: number; error?: string; }> {
    try {
      let query = supabase
        .from('products_with_details') // Querying the VIEW
        .select('*', { count: 'exact' }) // Always request count for pagination
        .eq('is_active', true) // Only active products
        .order('created_at', { ascending: false }); // Default sort

      // Apply filters based on the columns available in the VIEW
      if (filters.categoryName) {
        query = query.eq('category_name', filters.categoryName);
      }
      if (filters.farmerId) {
        query = query.eq('farmer_id', filters.farmerId);
      }
      if (filters.qualityGrade) {
        query = query.eq('quality_grade', filters.qualityGrade);
      }
      // If you add 'farmer_region' to the VIEW:
      // if (filters.region) {
      //   query = query.eq('farmer_region', filters.region);
      // }

      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        // Search in product name, description, farmer name, and category name.
        query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm},farmer_name.ilike.${searchTerm},category_name.ilike.${searchTerm}`);
      }

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        // Supabase range is inclusive: [offset, offset + limit - 1]
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error; // Let the catch block handle it.

      return {
        success: true,
        data: (data as ProductWithDetails[]) || [], // Ensure data is an array.
        count: count || 0,
      };
    } catch (error: any) {
      console.error('ProductService.getProducts error:', error.message);
      return {
        success: false,
        error: handleSupabaseError(error), // Use your centralized error handler.
        data: [],
        count: 0,
      };
    }
  }

  /**
   * Fetches a single product by its ID using the `products_with_details` VIEW.
   * @param {string} id - The UUID of the product.
   * @returns {Promise<{ success: boolean; data?: ProductWithDetails; error?: string }>} The product or an error.
   */
  static async getProductById(id: string): Promise<{ success: boolean; data?: ProductWithDetails; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products_with_details') // Querying the VIEW
        .select('*')
        .eq('id', id)
        .eq('is_active', true) // Ensure only active products are fetched by ID directly.
        .single(); // Expect one row.

      if (error) {
        if (error.code === 'PGRST116') { // PostgREST code for "No rows found"
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

  // CUD (Create, Update, Delete) operations still target the base 'products' table.
  // These are examples; ensure they match your exact `ProductType` and requirements.

  static async createProduct(productData: Omit<ProductType, 'id' | 'created_at' | 'updated_at' | 'farmer'>): Promise<{ success: boolean; data?: ProductType; error?: string }> {
    try {
      // Ensure required fields are present according to your DB schema (not null constraints)
      const { data, error } = await supabase
        .from('products')
        .insert([productData]) // Pass as an array for insert
        .select()
        .single();
      if (error) throw error;
      return { success: true, data: data as ProductType };
    } catch (error: any) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }

  static async updateProduct(id: string, updates: Partial<ProductType>): Promise<{ success: boolean; data?: ProductType; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() }) // Always update `updated_at`
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return { success: true, data: data as ProductType };
    } catch (error: any) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
  
  static async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // This is a soft delete, per your schema's `is_active` convention.
      const { error } = await supabase
        .from('products')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
}

