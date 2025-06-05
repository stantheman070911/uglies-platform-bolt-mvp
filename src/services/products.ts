/**
 * @file src/services/products.ts
 * @description This service handles all logic related to fetching and managing products.
 * It uses a performant database VIEW (`products_with_farmer_details`) to simplify queries.
 *
 * Adherence to "Violent Psychopath Maintenance Standard":
 * - All functions are clearly documented with JSDoc.
 * - Types are explicit and imported.
 * - All Supabase queries are centralized here.
 * - Error handling is consistent.
 * - Logic is designed for clarity and maintainability.
 */

import { supabase, handleSupabaseError } from './supabase';
import type { Product as ProductType, ProductFilter as ProductFilters } from '@/types/products';

// This is the shape of the data as returned from our VIEW.
// It's slightly different from the base table type.
export interface ProductFromView extends ProductType {
  farmer_name: string;
  farmer_region: string;
  farmer_avatar_url: string;
  farmer_bio: string;
  category_name: string;
}

export class ProductService {
  /**
   * Fetches a list of products using the performant `products_with_farmer_details` VIEW.
   * Supports filtering by category, farmer, region, price, and search term.
   * @param {ProductFilters} filters - An object of filters to apply to the query.
   * @returns {Promise<{ success: boolean; data: ProductFromView[]; count: number; error?: string; }>}
   * A list of products matching the filters.
   */
  static async getProducts(filters: ProductFilters = {}): Promise<{ success: boolean; data: ProductFromView[]; count: number; error?: string; }> {
    try {
      // Query the new, efficient VIEW instead of the base tables.
      // This is the single source of truth for fetching product lists.
      let query = supabase
        .from('products_with_farmer_details')
        .select('*', { count: 'exact' }) // Request the total count for pagination
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Apply filters directly to the view's columns.
      if (filters.category) {
        // Correctly filter by the category name from the joined view.
        query = query.eq('category_name', filters.category);
      }
      if (filters.farmerId) {
        query = query.eq('farmer_id', filters.farmerId);
      }
      if (filters.qualityTier) {
        query = query.eq('quality_tier', filters.qualityTier);
      }
      if (filters.region) {
        // The inefficient two-step query is now a simple, fast, single-step filter.
        query = query.eq('farmer_region', filters.region);
      }
      
      // Handle price range if it exists.
      if (filters.priceRange) {
        query = query
          .gte('price', filters.priceRange.min)
          .lte('price', filters.priceRange.max);
      }

      // Handle search term.
      if (filters.search) {
        // Search across product name, description, and the farmer's name.
        const searchTerm = `%${filters.search}%`;
        query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm},farmer_name.ilike.${searchTerm}`);
      }

      // Apply pagination.
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      // Execute the final query.
      const { data, error, count } = await query;

      if (error) {
        // If the query fails, throw the error to be caught by the catch block.
        throw error;
      }

      return {
        success: true,
        data: (data as ProductFromView[]) || [],
        count: count || 0,
      };

    } catch (error: any) {
      console.error('ProductService.getProducts error:', error);
      return {
        success: false,
        error: handleSupabaseError(error),
        data: [],
        count: 0,
      };
    }
  }

  /**
   * Fetches a single product by its ID.
   * @param {string} id - The UUID of the product to fetch.
   * @returns {Promise<{ success: boolean; data?: ProductFromView; error?: string }>}
   * An object containing the product data if found.
   */
  static async getProductById(id: string): Promise<{ success: boolean; data?: ProductFromView; error?: string }> {
    try {
      // Use the performant view to get all details in one shot.
      const { data, error } = await supabase
        .from('products_with_farmer_details')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single(); // Expect only one result.

      if (error) throw error;

      return { success: true, data: data as ProductFromView };
    } catch (error: any) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }

  // --- The CUD (Create, Update, Delete) operations still act on the base 'products' table ---

  /**
   * Creates a new product record.
   * @param {Partial<ProductType>} productData - The data for the new product.
   * @returns {Promise<{ success: boolean; data?: ProductType; error?: string }>}
   * An object containing the newly created product data.
   */
  static async createProduct(productData: Partial<ProductType>): Promise<{ success: boolean; data?: ProductType; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{ ...productData, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: data as ProductType };
    } catch (error: any) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }

  /**
   * Updates an existing product.
   * @param {string} id - The ID of the product to update.
   * @param {Partial<ProductType>} updates - The fields to update.
   * @returns {Promise<{ success: boolean; data?: ProductType; error?: string }>}
   * An object containing the updated product data.
   */
  static async updateProduct(id: string, updates: Partial<ProductType>): Promise<{ success: boolean; data?: ProductType; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: data as ProductType };
    } catch (error: any) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }

  /**
   * Soft-deletes a product by setting its `is_active` flag to false.
   * @param {string} id - The ID of the product to delete.
   * @returns {Promise<{ success: boolean; error?: string }>}
   * An object indicating success or failure.
   */
  static async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
}
