import { supabase, handleSupabaseError } from './supabase';

export class StatsService {
  /**
   * Fetches the total number of farmers using a database function.
   */
  static async getTotalFarmers(): Promise<{ success: boolean; data?: number; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('get_total_farmers');
      if (error) throw error;
      return { success: true, data: data || 0 };
    } catch (error: any) {
      console.error('StatsService.getTotalFarmers error:', error.message);
      return { success: false, error: handleSupabaseError(error) };
    }
  }

  /**
   * Fetches the total number of group buys using a database function.
   */
  static async getTotalGroups(): Promise<{ success: boolean; data?: number; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('get_total_groups');
      if (error) throw error;
      return { success: true, data: data || 0 };
    } catch (error: any) {
      console.error('StatsService.getTotalGroups error:', error.message);
      return { success: false, error: handleSupabaseError(error) };
    }
  }

  /**
   * Returns a mock value for the total amount saved.
   */
  static async getAmountSaved(): Promise<{ success: boolean; data?: string; error?: string }> {
    // This remains a mock for now, as requested
    return { success: true, data: '$1,234' };
  }
}