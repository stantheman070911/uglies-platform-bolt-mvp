// Add this function to the existing ProductService class
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