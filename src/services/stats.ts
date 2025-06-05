import { supabase, handleSupabaseError } from './supabase';

export class StatsService {
  static async getTotalFarmers(): Promise<{ success: boolean; data?: number; error?: string }> {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'farmer')
        .eq('is_active', true);

      if (error) throw error;
      return { success: true, data: count || 0 };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }

  static async getTotalGroups(): Promise<{ success: boolean; data?: number; error?: string }> {
    try {
      const { count, error } = await supabase
        .from('group_buys')
        .select('*', { count: 'exact', head: true })
        .in('status', ['forming', 'active']);

      if (error) throw error;
      return { success: true, data: count || 0 };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }

  static async getAmountSaved(): Promise<{ success: boolean; data?: string; error?: string }> {
    // For now, return a mock value as calculating actual savings would require complex aggregation
    return { success: true, data: "$1,234" };
  }
}