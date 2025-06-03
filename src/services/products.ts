import { supabase, handleSupabaseError } from './supabase';
import type { Product, CreateProductRequest } from '@/types/products';

export class ProductService {
  // Get products with farmer info
  static async getProducts(filters: {
    category?: string;
    region?: string;
    farmerId?: string;
    quality?: string;
    limit?: number;
  } = {}) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          farmer:users!farmer_id (
            id, display_name, region, avatar_url, bio
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters.category) query = query.eq('category_id', filters.category);
      if (filters.region) query = query.eq('location->region', filters.region);
      if (filters.farmerId) query = query.eq('farmer_id', filters.farmerId);
      if (filters.quality) query = query.eq('quality_grade', filters.quality);
      if (filters.limit) query = query.limit(filters.limit);

      const { data: products, error } = await query;

      if (error) throw error;
      return { success: true, data: products || [] };
    } catch (error) {
      return { 
        success: false, 
        error: handleSupabaseError(error) 
      };
    }
  }

  // Get single product with details
  static async getProduct(productId: string) {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          farmer:users!farmer_id (
            id, display_name, region, avatar_url, bio, phone_number
          )
        `)
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return { success: true, data: product };
    } catch (error) {
      return { 
        success: false, 
        error: handleSupabaseError(error) 
      };
    }
  }

  // Create new product (farmers only)
  static async createProduct(request: CreateProductRequest, farmerId: string) {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          farmer_id: farmerId,
          name: request.name,
          description: request.description,
          category_id: request.categoryId,
          price: request.price,
          stock_quantity: request.stockQuantity,
          unit: request.unit || 'kg',
          quality_grade: request.qualityGrade,
          harvest_date: request.harvestDate,
          expiry_date: request.expiryDate,
          organic_certified: request.organicCertified,
          images: request.images || [],
          location: request.location,
          farming_methods: request.farmingMethods || []
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: product };
    } catch (error) {
      return { 
        success: false, 
        error: handleSupabaseError(error) 
      };
    }
  }

  // Update product inventory after group buy
  static async updateInventory(productId: string, quantitySold: number) {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .update({
          stock_quantity: supabase.rpc('decrement_inventory', {
            product_id: productId,
            quantity: quantitySold
          })
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: product };
    } catch (error) {
      return { 
        success: false, 
        error: handleSupabaseError(error) 
      };
    }
  }
}

export default ProductService;