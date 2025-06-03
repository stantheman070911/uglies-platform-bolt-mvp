export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: string;
          display_name: string;
          avatar_url: string | null;
          created_at: string;
          last_login: string | null;
          is_verified: boolean;
          is_active: boolean;
          metadata: Record<string, any> | null;
        };
        Insert: {
          id?: string;
          email: string;
          role: string;
          display_name: string;
          avatar_url?: string | null;
          created_at?: string;
          last_login?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
          metadata?: Record<string, any> | null;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          display_name?: string;
          avatar_url?: string | null;
          created_at?: string;
          last_login?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
          metadata?: Record<string, any> | null;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          discount_price: number | null;
          currency: string;
          unit: string;
          stock_quantity: number;
          images: string[];
          category_id: string;
          farmer_id: string;
          rating: number | null;
          review_count: number | null;
          is_organic: boolean;
          is_featured: boolean;
          nutritional_info: string | null;
          harvest_date: string | null;
          expiry_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          discount_price?: number | null;
          currency: string;
          unit: string;
          stock_quantity: number;
          images: string[];
          category_id: string;
          farmer_id: string;
          rating?: number | null;
          review_count?: number | null;
          is_organic: boolean;
          is_featured?: boolean;
          nutritional_info?: string | null;
          harvest_date?: string | null;
          expiry_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          discount_price?: number | null;
          currency?: string;
          unit?: string;
          stock_quantity?: number;
          images?: string[];
          category_id?: string;
          farmer_id?: string;
          rating?: number | null;
          review_count?: number | null;
          is_organic?: boolean;
          is_featured?: boolean;
          nutritional_info?: string | null;
          harvest_date?: string | null;
          expiry_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image: string | null;
          parent_id: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
        };
      };
      group_buys: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          description: string | null;
          target_quantity: number;
          current_quantity: number;
          unit_price: number;
          discount_unit_price: number;
          currency: string;
          creator_id: string;
          status: string;
          start_date: string;
          end_date: string;
          min_participants: number;
          max_participants: number;
          current_participants: number;
          is_public: boolean;
          location: {
            latitude: number;
            longitude: number;
            address: string;
          } | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          description?: string | null;
          target_quantity: number;
          current_quantity?: number;
          unit_price: number;
          discount_unit_price: number;
          currency: string;
          creator_id: string;
          status?: string;
          start_date: string;
          end_date: string;
          min_participants: number;
          max_participants: number;
          current_participants?: number;
          is_public?: boolean;
          location?: {
            latitude: number;
            longitude: number;
            address: string;
          } | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          description?: string | null;
          target_quantity?: number;
          current_quantity?: number;
          unit_price?: number;
          discount_unit_price?: number;
          currency?: string;
          creator_id?: string;
          status?: string;
          start_date?: string;
          end_date?: string;
          min_participants?: number;
          max_participants?: number;
          current_participants?: number;
          is_public?: boolean;
          location?: {
            latitude: number;
            longitude: number;
            address: string;
          } | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}