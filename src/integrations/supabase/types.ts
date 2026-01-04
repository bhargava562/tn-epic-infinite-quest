export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          created_at: string | null
          description: string | null
          description_tamil: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          name_tamil: string | null
          requirement_count: number | null
          requirement_type: string | null
          tokens_reward: number | null
        }
        Insert: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          created_at?: string | null
          description?: string | null
          description_tamil?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_tamil?: string | null
          requirement_count?: number | null
          requirement_type?: string | null
          tokens_reward?: number | null
        }
        Update: {
          achievement_type?: Database["public"]["Enums"]["achievement_type"]
          created_at?: string | null
          description?: string | null
          description_tamil?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_tamil?: string | null
          requirement_count?: number | null
          requirement_type?: string | null
          tokens_reward?: number | null
        }
        Relationships: []
      }
      destinations: {
        Row: {
          avg_visit_duration: number | null
          category: Database["public"]["Enums"]["destination_category"]
          created_at: string | null
          description: string | null
          description_tamil: string | null
          entry_fee: number | null
          icon_name: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          name_tamil: string | null
          opening_hours: string | null
          updated_at: string | null
        }
        Insert: {
          avg_visit_duration?: number | null
          category?: Database["public"]["Enums"]["destination_category"]
          created_at?: string | null
          description?: string | null
          description_tamil?: string | null
          entry_fee?: number | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          name_tamil?: string | null
          opening_hours?: string | null
          updated_at?: string | null
        }
        Update: {
          avg_visit_duration?: number | null
          category?: Database["public"]["Enums"]["destination_category"]
          created_at?: string | null
          description?: string | null
          description_tamil?: string | null
          entry_fee?: number | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_tamil?: string | null
          opening_hours?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dharma_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          points_earned: number | null
          trip_id: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          points_earned?: number | null
          trip_id?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          points_earned?: number | null
          trip_id?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "dharma_activities_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      filters: {
        Row: {
          created_at: string | null
          description: string | null
          destination_id: string | null
          filter_url: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          name: string
          name_tamil: string | null
          preview_url: string | null
          tokens_cost: number | null
          unlock_requirement: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          filter_url?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name: string
          name_tamil?: string | null
          preview_url?: string | null
          tokens_cost?: number | null
          unlock_requirement?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          filter_url?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name?: string
          name_tamil?: string | null
          preview_url?: string | null
          tokens_cost?: number | null
          unlock_requirement?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filters_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          created_at: string | null
          description: string | null
          destination_id: string | null
          file_url: string | null
          id: string
          is_public: boolean | null
          memory_type: Database["public"]["Enums"]["memory_type"] | null
          metadata: Json | null
          thumbnail_url: string | null
          title: string | null
          tokens_earned: number | null
          trip_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          memory_type?: Database["public"]["Enums"]["memory_type"] | null
          metadata?: Json | null
          thumbnail_url?: string | null
          title?: string | null
          tokens_earned?: number | null
          trip_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          memory_type?: Database["public"]["Enums"]["memory_type"] | null
          metadata?: Json | null
          thumbnail_url?: string | null
          title?: string | null
          tokens_earned?: number | null
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memories_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          dharma_score: number | null
          display_name: string | null
          email: string | null
          id: string
          level: number | null
          preferred_language: string | null
          tokens: number | null
          total_memories: number | null
          total_trips: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          dharma_score?: number | null
          display_name?: string | null
          email?: string | null
          id: string
          level?: number | null
          preferred_language?: string | null
          tokens?: number | null
          total_memories?: number | null
          total_trips?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          dharma_score?: number | null
          display_name?: string | null
          email?: string | null
          id?: string
          level?: number | null
          preferred_language?: string | null
          tokens?: number | null
          total_memories?: number | null
          total_trips?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      save_point_visits: {
        Row: {
          id: string
          save_point_id: string
          tokens_earned: number | null
          trip_id: string | null
          user_id: string
          visited_at: string | null
        }
        Insert: {
          id?: string
          save_point_id: string
          tokens_earned?: number | null
          trip_id?: string | null
          user_id: string
          visited_at?: string | null
        }
        Update: {
          id?: string
          save_point_id?: string
          tokens_earned?: number | null
          trip_id?: string | null
          user_id?: string
          visited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "save_point_visits_save_point_id_fkey"
            columns: ["save_point_id"]
            isOneToOne: false
            referencedRelation: "save_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "save_point_visits_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      save_points: {
        Row: {
          bid_amount: number | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          destination_id: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          name_tamil: string | null
          opening_hours: string | null
          save_point_type: Database["public"]["Enums"]["save_point_type"] | null
          tokens_reward: number | null
          updated_at: string | null
        }
        Insert: {
          bid_amount?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          name_tamil?: string | null
          opening_hours?: string | null
          save_point_type?:
            | Database["public"]["Enums"]["save_point_type"]
            | null
          tokens_reward?: number | null
          updated_at?: string | null
        }
        Update: {
          bid_amount?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_tamil?: string | null
          opening_hours?: string | null
          save_point_type?:
            | Database["public"]["Enums"]["save_point_type"]
            | null
          tokens_reward?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "save_points_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_destinations: {
        Row: {
          created_at: string | null
          destination_id: string
          id: string
          is_completed: boolean | null
          order_index: number | null
          trip_id: string
          visited_at: string | null
        }
        Insert: {
          created_at?: string | null
          destination_id: string
          id?: string
          is_completed?: boolean | null
          order_index?: number | null
          trip_id: string
          visited_at?: string | null
        }
        Update: {
          created_at?: string | null
          destination_id?: string
          id?: string
          is_completed?: boolean | null
          order_index?: number | null
          trip_id?: string
          visited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_destinations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_destinations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_level: number | null
          dharma_earned: number | null
          duration: number
          end_date: string | null
          id: string
          start_date: string | null
          status: Database["public"]["Enums"]["trip_status"] | null
          title: string | null
          tokens_earned: number | null
          total_levels: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_level?: number | null
          dharma_earned?: number | null
          duration?: number
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["trip_status"] | null
          title?: string | null
          tokens_earned?: number | null
          total_levels?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_level?: number | null
          dharma_earned?: number | null
          duration?: number
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["trip_status"] | null
          title?: string | null
          tokens_earned?: number | null
          total_levels?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          progress: number | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_filters: {
        Row: {
          filter_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          filter_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          filter_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_filters_filter_id_fkey"
            columns: ["filter_id"]
            isOneToOne: false
            referencedRelation: "filters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          dharma_score: number | null
          display_name: string | null
          id: string | null
          level: number | null
          total_memories: number | null
          total_trips: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      achievement_type:
        | "explorer"
        | "photographer"
        | "pilgrim"
        | "foodie"
        | "historian"
        | "eco_warrior"
        | "social"
      app_role: "admin" | "moderator" | "user"
      destination_category:
        | "temple"
        | "monument"
        | "nature"
        | "beach"
        | "city"
        | "village"
        | "museum"
        | "food"
      memory_type: "photo" | "video" | "audio" | "note"
      save_point_type:
        | "shop"
        | "restaurant"
        | "temple"
        | "attraction"
        | "rest_area"
      trip_status: "planning" | "active" | "paused" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_type: [
        "explorer",
        "photographer",
        "pilgrim",
        "foodie",
        "historian",
        "eco_warrior",
        "social",
      ],
      app_role: ["admin", "moderator", "user"],
      destination_category: [
        "temple",
        "monument",
        "nature",
        "beach",
        "city",
        "village",
        "museum",
        "food",
      ],
      memory_type: ["photo", "video", "audio", "note"],
      save_point_type: [
        "shop",
        "restaurant",
        "temple",
        "attraction",
        "rest_area",
      ],
      trip_status: ["planning", "active", "paused", "completed", "cancelled"],
    },
  },
} as const
