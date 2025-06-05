/**
 * @file src/services/groups.ts
 * @description Service for all group-buy-related database operations.
 * The critical 'joinGroup' action now uses an atomic RPC for data safety.
 * All other functions are also updated to align with the latest database schema.
 */
import { supabase, handleSupabaseError, createRealtimeSubscription } from './supabase';
import type { GroupBuy, CreateGroupRequest, GroupParticipant, GroupStatus } from '@/types/groups';
import type { Product } from '@/types/products';
import type { User } from '@/types/auth';

/**
 * @interface FullGroupBuy
 * @description Extends the base GroupBuy type to include nested product and participant details,
 * as often fetched from the database for display purposes.
 */
export interface FullGroupBuy extends GroupBuy {
  product?: Product;
  participants?: (GroupParticipant & { user?: Pick<User, 'id' | 'displayName' | 'avatarUrl'> })[];
}

export class GroupBuyingService {
  static calculateGroupPrice(basePrice: number, quantity: number): number {
    let discountedPrice: number;
    if (quantity >= 20) {
      discountedPrice = basePrice * 0.8; // 20% off
    } else if (quantity >= 10) {
      discountedPrice = basePrice * 0.9; // 10% off
    } else if (quantity >= 5) {
      discountedPrice = basePrice * 0.95;  // 5% off
    } else {
      discountedPrice = basePrice;
    }
    // Ensure currency-safe rounding.
    return Math.round(discountedPrice * 100) / 100;
  }

  static async createGroup(request: CreateGroupRequest): Promise<{ success: boolean; data?: GroupBuy; error?: string }> {
    try {
      const groupToInsert = {
        product_id: request.productId,
        creator_id: request.initiatorId,
        title: request.title,
        target_quantity: request.targetQuantity,
        current_quantity: 0,
        unit_price: request.basePrice,
        end_date: request.deadline,
        delivery_method: request.deliveryMethod,
        is_public: true,
        status: 'forming' as GroupStatus,
      };

      const { data, error } = await supabase
        .from('group_buys')
        .insert(groupToInsert)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data as GroupBuy };
    } catch (error: any) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }

  static async joinGroup(groupId: string, userId: string, quantity: number): Promise<{ success: boolean; error?: string; newGroupPrice?: number }> {
    try {
      const { data, error: rpcError } = await supabase.rpc('join_group_atomic', {
        p_group_id_input: groupId,
        p_user_id_input: userId,
        p_quantity_input: quantity
      });

      if (rpcError) {
        console.error('RPC error in joinGroup:', rpcError);
        throw rpcError;
      }
      
      const result = data?.[0];

      if (!result) {
        console.error('RPC call to join_group_atomic returned no data.');
        throw new Error('Server did not confirm the join operation.');
      }

      if (!result.success) {
        console.warn('Join group attempt failed (handled by DB):', result.message);
        throw new Error(result.message);
      }

      return { success: true, newGroupPrice: result.new_group_price };

    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred while joining the group.'
      };
    }
  }

  static async getGroupDetails(groupId: string): Promise<{ success: boolean; data?: FullGroupBuy; error?: string }> {
    try {
      const { data: group, error } = await supabase
        .from('group_buys')
        .select(`
          id,
          product_id,
          creator_id,
          title,
          description,
          target_quantity,
          current_quantity,
          unit_price,
          invite_code,
          status,
          end_date,
          delivery_method,
          created_at,
          updated_at,
          product:products (
            id, name, description, price, images, unit,
            farmer:users!farmer_id (id, display_name, avatar_url)
          ),
          participants:group_participants (
            id, user_id, quantity, unit_price, joined_at, status,
            user:users!user_id (id, display_name, avatar_url)
          )
        `)
        .eq('id', groupId)
        .single();

      if (error) throw error;
      if (!group) return { success: false, error: 'Group not found.' };

      return { success: true, data: group as FullGroupBuy };
    } catch (error: any) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }

  static async getActiveGroups(region?: string, limit: number = 20): Promise<{ success: boolean; data?: FullGroupBuy[]; error?: string }> {
    try {
      let query = supabase
        .from('group_buys')
        .select(`
          id, product_id, title, target_quantity, current_quantity, unit_price, status, end_date, invite_code,
          product:products (name, images, unit, farmer:users!farmer_id(display_name)),
          participants:group_participants(count)
        `)
        .in('status', ['forming' as GroupStatus, 'active' as GroupStatus])
        .order('created_at', { ascending: false })
        .limit(limit);

      const { data: groups, error } = await query;

      if (error) throw error;
      return { success: true, data: (groups as FullGroupBuy[]) || [] };
    } catch (error: any) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }

  static subscribeToGroupParticipants(groupId: string, callback: (payload: any) => void) {
    return createRealtimeSubscription(
      'group_participants',
      callback,
      `group_id=eq.${groupId}`
    );
  }

  static subscribeToGroupStatus(groupId: string, callback: (payload: any) => void) {
    return createRealtimeSubscription(
      'group_buys',
      callback,
      `id=eq.${groupId}`
    );
  }

  static subscribeToAllGroupChanges(callback: () => void) {
    const channel = supabase.channel('group-list-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'group_buys' },
        callback
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'group_participants' },
        callback
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
}