import { supabase, handleSupabaseError, createRealtimeSubscription } from './supabase';
import type { GroupBuy, GroupParticipant, CreateGroupRequest } from '@/types/groups';

export class GroupBuyingService {
  // Generate unique invite codes
  static generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Calculate dynamic pricing based on quantity
  static calculateGroupPrice(basePrice: number, quantity: number): number {
    if (quantity >= 20) return Math.round(basePrice * 0.8 * 100) / 100; // 20% off
    if (quantity >= 10) return Math.round(basePrice * 0.9 * 100) / 100; // 10% off  
    if (quantity >= 5) return Math.round(basePrice * 0.95 * 100) / 100;  // 5% off
    return basePrice;
  }

  // Create new group buy
  static async createGroup(request: CreateGroupRequest) {
    try {
      const inviteCode = this.generateInviteCode();
      
      const { data: group, error } = await supabase
        .from('group_buys')
        .insert({
          product_id: request.productId,
          creator_id: request.initiatorId,
          target_quantity: request.targetQuantity,
          current_quantity: 0,
          unit_price: request.basePrice,
          invite_code: inviteCode,
          end_date: request.deadline,
          delivery_method: request.deliveryMethod,
          region: request.region,
          is_public: true,
          status: 'forming'
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: group };
    } catch (error) {
      return { 
        success: false, 
        error: handleSupabaseError(error) 
      };
    }
  }

  // Join existing group
  static async joinGroup(groupId: string, userId: string, quantity: number) {
    try {
      const { data: group, error: groupError } = await supabase
        .from('group_buys')
        .select('*')
        .eq('id', groupId)
        .eq('status', 'forming')
        .single();

      if (groupError) throw groupError;

      const newQuantity = (group.current_quantity || 0) + quantity;
      const newPrice = this.calculateGroupPrice(group.unit_price, newQuantity);

      const { error: participantError } = await supabase
        .from('group_participants')
        .insert({
          group_id: groupId,
          user_id: userId,
          quantity,
          unit_price: newPrice
        });

      if (participantError) throw participantError;

      const { error: updateError } = await supabase
        .from('group_buys')
        .update({
          current_quantity: newQuantity,
          unit_price: newPrice,
          status: newQuantity >= group.target_quantity ? 'active' : 'forming'
        })
        .eq('id', groupId);

      if (updateError) throw updateError;

      return { success: true, newPrice };
    } catch (error) {
      return { 
        success: false, 
        error: handleSupabaseError(error) 
      };
    }
  }

  // Get group details with participants
  static async getGroupDetails(groupId: string) {
    try {
      const { data: group, error } = await supabase
        .from('group_buys')
        .select(`
          *,
          product:products(*),
          participants:group_participants(*)
        `)
        .eq('id', groupId)
        .single();

      if (error) throw error;
      return { success: true, data: group };
    } catch (error) {
      return { 
        success: false, 
        error: handleSupabaseError(error) 
      };
    }
  }

  // Get active groups by region
  static async getActiveGroups(region?: string, limit = 20) {
    try {
      let query = supabase
        .from('group_buys')
        .select(`
          *,
          product:products(*),
          participants:group_participants(*)
        `)
        .in('status', ['forming', 'active'])
        .order('created_at', { ascending: false })
        .limit(limit);

      if (region) {
        query = query.eq('region', region);
      }

      const { data: groups, error } = await query;

      if (error) throw error;
      return { success: true, data: groups };
    } catch (error) {
      return { 
        success: false, 
        error: handleSupabaseError(error) 
      };
    }
  }

  // Subscribe to group updates
  static subscribeToGroup(groupId: string, callback: (payload: any) => void) {
    return createRealtimeSubscription(
      'group_participants',
      callback,
      `group_id=eq.${groupId}`
    );
  }

  // Subscribe to group status updates
  static subscribeToGroupStatus(groupId: string, callback: (payload: any) => void) {
    return createRealtimeSubscription(
      'group_buys',
      callback,
      `id=eq.${groupId}`
    );
  }
}