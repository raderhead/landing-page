export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          excerpt: string
          formattedContent: Json | null
          id: string
          image_url: string | null
          published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          excerpt: string
          formattedContent?: Json | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          formattedContent?: Json | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          airtable_record_id: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          preferred_contact_method: string
          sync_status: string | null
        }
        Insert: {
          airtable_record_id?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone: string
          preferred_contact_method: string
          sync_status?: string | null
        }
        Update: {
          airtable_record_id?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          preferred_contact_method?: string
          sync_status?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          last_sync_id: string | null
          mls: string | null
          price: string | null
          received_at: string | null
          size: string | null
          title: string | null
          type: string | null
        }
        Insert: {
          address?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          last_sync_id?: string | null
          mls?: string | null
          price?: string | null
          received_at?: string | null
          size?: string | null
          title?: string | null
          type?: string | null
        }
        Update: {
          address?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          last_sync_id?: string | null
          mls?: string | null
          price?: string | null
          received_at?: string | null
          size?: string | null
          title?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_last_sync_id_fkey"
            columns: ["last_sync_id"]
            isOneToOne: false
            referencedRelation: "sync_operations"
            referencedColumns: ["id"]
          },
        ]
      }
      property_details: {
        Row: {
          address: string | null
          id: string
          landsize: string | null
          listingby: string | null
          listprice: string | null
          property_id: string | null
          propertysize: string | null
          received_at: string | null
          remarks: string | null
          rooms: Json | null
          salepricepersqm: string | null
          status: string | null
          virtualtour: string | null
        }
        Insert: {
          address?: string | null
          id?: string
          landsize?: string | null
          listingby?: string | null
          listprice?: string | null
          property_id?: string | null
          propertysize?: string | null
          received_at?: string | null
          remarks?: string | null
          rooms?: Json | null
          salepricepersqm?: string | null
          status?: string | null
          virtualtour?: string | null
        }
        Update: {
          address?: string | null
          id?: string
          landsize?: string | null
          listingby?: string | null
          listprice?: string | null
          property_id?: string | null
          propertysize?: string | null
          received_at?: string | null
          remarks?: string | null
          rooms?: Json | null
          salepricepersqm?: string | null
          status?: string | null
          virtualtour?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_details_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_submissions: {
        Row: {
          id: string
          quiz_data: Json
          submitted_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          id?: string
          quiz_data: Json
          submitted_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          id?: string
          quiz_data?: Json
          submitted_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      saved_properties: {
        Row: {
          id: string
          property_data: Json
          property_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          id?: string
          property_data: Json
          property_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          id?: string
          property_data?: Json
          property_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sync_operations: {
        Row: {
          id: string
          notes: string | null
          property_count: number
          source: string
          timestamp: string
        }
        Insert: {
          id: string
          notes?: string | null
          property_count: number
          source: string
          timestamp?: string
        }
        Update: {
          id?: string
          notes?: string | null
          property_count?: number
          source?: string
          timestamp?: string
        }
        Relationships: []
      }
      webhook_property_details: {
        Row: {
          created_at: string | null
          id: string
          payload: Json
          processed: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          payload: Json
          processed?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          payload?: Json
          processed?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
