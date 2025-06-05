/**
 * @file src/services/groups.ts
 * @description This service handles all logic related to group buying.
 * It includes creating groups, joining groups, calculating dynamic pricing,
 * fetching group details, and managing real-time subscriptions for group updates.
 * All interactions with the Supabase database concerning group buys are centralized here.
 */

import { supabase, handleSupabaseError, createRealtimeSubscription } from './supabase';
// Ensuring all necessary types are imported for clarity and type safety.
import type { GroupBuy, GroupParticipant, CreateGroupRequest, GroupStatus } from '@/types/groups';
import type { Product } from '@/types/products'; // Assuming Product type might be needed for group details
import type { User } from '@/types/auth'; // Assuming User type might be needed for participant details

/**
 * Defines the expected structure for a group buy when fetched with its associated product
 * and participant details. This ensures clarity when working with complex nested data.
 */
export interface FullGroupBuy extends GroupBuy {
  product?: Product; // The product associated with this group buy.
  participants?: (GroupParticipant & { user?: Pick<User, 'id' | 'displayName' | 'avatarUrl'> })[]; // Participants with basic user info.
}

/**
 * @class GroupBuyingService
 * @classdesc Provides static methods to manage group buying functionalities.
 * This includes creating groups, joining groups, calculating prices,
 * fetching group data, and subscribing to real-time updates.
 *
 * Adherence to "Violent Psychopath Maintenance Standard":
 * - Every function's purpose is explicitly stated.
 * - Parameters are clearly typed and explained if non-obvious.
 * - Return types are explicit.
 * - Error handling is consistent and uses a centralized Supabase error handler.
 * - Database interactions are clearly demarcated.
 * - Complex logic (like pricing or atomic operations) is commented to explain the "why".
 */
export class GroupBuyingService {
  /**
   * Generates a unique 6-character alphanumeric invite code for a new group buy.
   * This method is kept client-side for now, but for true uniqueness guarantee at scale,
   * it would be better implemented as part of a database function or with a retry mechanism
   * that checks for collisions before insertion if `set_invite_code` trigger is not used.
   * The `set_invite_code` trigger in the DB schema handles this server-side now.
   * @returns {string} A 6-character uppercase alphanumeric invite code.
   */
  static generateInviteCode(): string {
    // Character set for the invite code. Using uppercase and numbers for readability.
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
    // Note: The actual unique code generation is handled by a Supabase trigger `set_invite_code`
    // which calls the `generate_invite_code()` SQL function. This client-side version
    // is mostly a fallback or for UI display before submission if needed.
  }

  /**
   * Calculates the dynamic price per unit based on the current quantity in a group buy.
   * Implements tiered discounting:
   * - 20+ items: 20% discount
   * - 10-19 items: 10% discount
   * - 5-9 items: 5% discount
   * - Less than 5 items: No discount
   * Prices are rounded to 2 decimal places to avoid floating point inaccuracies for currency.
   * This logic is mirrored in the `calculate_group_price` SQL function.
   * @param {number} basePrice - The original price of the product per unit.
   * @param {number} quantity - The current total quantity committed to the group buy.
   * @returns {number} The calculated price per unit after applying discounts.
   */
  static calculateGroupPrice(basePrice: number, quantity: number): number {
    let discountedPrice: number;
    if (quantity >= 20) {
      discountedPrice = basePrice * 0.8; // 20% off
    } else if (quantity >= 10) {
      discountedPrice = basePrice * 0.9; // 10% off  
    } else if (quantity >= 5) {
      discountedPrice = basePrice * 0.95;  // 5% off
    } else {
      discountedPrice = basePrice; // No discount
    }
    // Ensure currency-safe rounding to two decimal places.
    return Math.round(discountedPrice * 100) / 100;
  }

  /**
   * Creates a new group buy in the database.
   * The invite code is generated automatically by a database trigger.
   * The initial status is 'forming' and current quantity is 0.
   * @param {CreateGroupRequest} request - The data required to create a new group.
   * Includes productId, initiatorId, targetQuantity, basePrice, deadline,
   * deliveryMethod, and region.
   * @returns {Promise<{ success: boolean; data?: GroupBuy; error?: string }>}
   * An object indicating success or failure, with the created group data or an error message.
   */
  static async createGroup(request: CreateGroupRequest): Promise<{ success: boolean; data?: GroupBuy; error?: string }> {
    try {
      // The `invite_code` will be set by the `set_invite_code` trigger in Supabase.
      // `current_price_per_unit` should be initialized to the product's base price,
      // as the group starts with 0 participants (or 1, if the initiator auto-joins).
      // This logic assumes the basePrice passed in `request` is the product's actual base_price.
      // The `calculate_group_price` function will adjust this as members join.
      const initialPrice = this.calculateGroupPrice(request.basePrice, 0); // Price with 0 quantity

      const { data: group, error } = await supabase
        .from('group_buys')
        .insert({
          product_id: request.productId,
          initiator_id: request.initiatorId,
          target_quantity: request.targetQuantity,
          current_quantity: 0, // Starts empty, initiator might join separately
          current_price_per_unit: initialPrice, // Price for 0 items (base price usually)
          // invite_code is handled by DB trigger
          end_date: request.deadline, // Renamed from 'deadline' in request to 'end_date' in DB
          delivery_method: request.deliveryMethod,
          region: request.region,
          is_public: true, // Defaulting to public, can be a parameter if needed
          status: 'forming' as GroupStatus, // Explicitly type status
        })
        .select() // Select the newly inserted row
        .single(); // Expect a single row back

      if (error) throw error; // Propagate Supabase error to the catch block

      return { success: true, data: group as GroupBuy };
    } catch (error: any) {
      // Use the centralized error handler for consistent error messages.
      return { 
        success: false, 
        error: handleSupabaseError(error) 
      };
    }
  }

  /**
   * Joins a user to an existing group buy by calling an atomic database function `join_group_atomic`.
   * This is the preferred method as it ensures data integrity across multiple table updates.
   * The RPC function handles quantity checks, price recalculation, participant insertion,
   * and group buy record updates in a single transaction.
   * @param {string} groupId - The ID of the group to join.
   * @param {string} userId - The ID of the user joining.
   * @param {number} quantity - The number of items the user is committing to.
   * @returns {Promise<{ success: boolean; newPrice?: number; error?: string }>}
   * An object indicating success or failure, the new unit price if successful, or an error message.
   */
  static async joinGroup(groupId: string, userId: string, quantity: number): Promise<{ success: boolean; newPrice?: number; error?: string }> {
    try {
      // A single, atomic call to our database function.
      // Parameters are prefixed with 'p_' by convention for RPC calls.
      const { data, error: rpcError } = await supabase.rpc('join_group_atomic', {
        p_group_id: groupId,
        p_user_id: userId,
        p_quantity: quantity,
      });

      if (rpcError) throw rpcError; // Network or execution error from Supabase
      
      // The RPC function is designed to return a single row: { success BOOLEAN, message TEXT, new_price DECIMAL }
      if (data && !data.success) {
        // Handle logical errors returned from the SQL function (e.g., "Group is full", "Deadline passed")
        throw new Error(data.message || 'Failed to join group due to a server condition.');
      }

      // If successful, the data object itself from rpc is the expected output
      // { success: true, message: 'Successfully joined...', new_price: 12.34 }
      return { success: true, newPrice: data.new_price };
    } catch (error: any) {
      // Handles both network errors and logical errors thrown from the RPC or within this try block.
      return { 
        success: false, 
        // Use the error message if available, otherwise provide a generic one.
        error: error.message || 'An unexpected error occurred while joining the group.'
      };
    }
  }

  /**
   * Fetches the detailed information for a specific group buy, including its associated product
   * and a list of its participants with their basic user information.
   * @param {string} groupId - The ID of the group buy to fetch.
   * @returns {Promise<{ success: boolean; data?: FullGroupBuy; error?: string }>}
   * An object indicating success or failure, with the detailed group data or an error message.
   */
  static async getGroupDetails(groupId: string): Promise<{ success: boolean; data?: FullGroupBuy; error?: string }> {
    try {
      const { data: group, error } = await supabase
        .from('group_buys')
        .select(`
          id,
          product_id,
          initiator_id,
          invite_code,
          status,
          target_quantity,
          current_quantity,
          current_price_per_unit,
          deadline: end_date, 
          delivery_method,
          region,
          created_at,
          updated_at,
          product:products (
            id,
            name,
            description,
            base_price,
            images,
            farmer:users!farmer_id (
              id,
              display_name,
              avatar_url
            )
          ),
          participants:group_participants (
            id,
            user_id,
            quantity,
            estimated_cost,
            joined_at,
            user:users!user_id (
              id,
              display_name,
              avatar_url
            )
          )
        `)
        .eq('id', groupId)
        .single(); // Expecting only one group for a given ID.

      if (error) throw error;
      if (!group) return { success: false, error: 'Group not found.' };

      return { success: true, data: group as FullGroupBuy };
    } catch (error: any) {
      return { 
        success: false, 
        error: handleSupabaseError(error) 
      };
    }
  }

  /**
   * Fetches a list of active or forming group buys, optionally filtered by region.
   * Includes product and participant details for each group.
   * Results are ordered by creation date, newest first.
   * @param {string} [region] - Optional. The region to filter group buys by.
   * @param {number} [limit=20] - Optional. The maximum number of groups to fetch.
   * @returns {Promise<{ success: boolean; data?: FullGroupBuy[]; error?: string }>}
   * An object indicating success or failure, with the list of groups or an error message.
   */
  static async getActiveGroups(region?: string, limit = 20): Promise<{ success: boolean; data?: FullGroupBuy[]; error?: string }> {
    try {
      let query = supabase
        .from('group_buys')
        .select(`
          id,
          product_id,
          initiator_id,
          invite_code,
          status,
          target_quantity,
          current_quantity,
          current_price_per_unit,
          deadline: end_date,
          delivery_method,
          region,
          created_at,
          product:products (
            id,
            name,
            base_price,
            images,
            farmer:users!farmer_id (
              display_name
            )
          ),
          participants:group_participants (
            user_id,
            quantity
          )
        `)
        .in('status', ['forming', 'active']) // Only fetch groups that are actively forming or confirmed.
        .order('created_at', { ascending: false })
        .limit(limit);

      if (region) {
        query = query.eq('region', region);
      }

      const { data: groups, error } = await query;

      if (error) throw error;
      return { success: true, data: (groups as FullGroupBuy[]) || [] };
    } catch (error: any) {
      return { 
        success: false, 
        error: handleSupabaseError(error) 
      };
    }
  }

  /**
   * Subscribes to real-time changes for participants of a specific group.
   * This is useful for updating the UI live as users join or leave a group.
   * @param {string} groupId - The ID of the group to subscribe to.
   * @param {(payload: any) => void} callback - The function to call when a change occurs.
   * The payload contains information about the change event.
   * @returns {ReturnType<typeof createRealtimeSubscription>} A Supabase real-time channel subscription.
   * Call `.unsubscribe()` on this object to stop listening.
   */
  static subscribeToGroupParticipants(groupId: string, callback: (payload: any) => void) {
    // The filter ensures we only get updates for the specified group_id.
    return createRealtimeSubscription(
      'group_participants', // Table to listen on
      callback,             // Function to execute on change
      `group_id=eq.${groupId}` // Filter condition
    );
  }

  /**
   * Subscribes to real-time changes for the status or details of a specific group buy.
   * Useful for live updates to group status (e.g., 'forming' -> 'active').
   * @param {string} groupId - The ID of the group buy to subscribe to.
   * @param {(payload: any) => void} callback - The function to call when a change occurs.
   * @returns {ReturnType<typeof createRealtimeSubscription>} A Supabase real-time channel subscription.
   */
  static subscribeToGroupStatus(groupId: string, callback: (payload: any) => void) {
    // Listens for changes on the 'group_buys' table for the specific group ID.
    return createRealtimeSubscription(
      'group_buys',
      callback,
      `id=eq.${groupId}`
    );
  }
}
