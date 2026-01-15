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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      leads: {
        Row: {
          admin_notes: string | null
          assigned_partners: string[] | null
          company_name: string
          company_size: string | null
          contact_name: string
          created_at: string
          email: string
          forwarded_at: string | null
          id: string
          industry: string | null
          message: string | null
          phone: string | null
          selected_product: string | null
          source_page: string | null
          source_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_partners?: string[] | null
          company_name: string
          company_size?: string | null
          contact_name: string
          created_at?: string
          email: string
          forwarded_at?: string | null
          id?: string
          industry?: string | null
          message?: string | null
          phone?: string | null
          selected_product?: string | null
          source_page?: string | null
          source_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          assigned_partners?: string[] | null
          company_name?: string
          company_size?: string | null
          contact_name?: string
          created_at?: string
          email?: string
          forwarded_at?: string | null
          id?: string
          industry?: string | null
          message?: string | null
          phone?: string | null
          selected_product?: string | null
          source_page?: string | null
          source_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_change_requests: {
        Row: {
          admin_notes: string | null
          changes: Json
          created_at: string
          id: string
          partner_id: string
          requester_email: string
          requester_name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          changes: Json
          created_at?: string
          id?: string
          partner_id: string
          requester_email: string
          requester_name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          changes?: Json
          created_at?: string
          id?: string
          partner_id?: string
          requester_email?: string
          requester_name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_change_requests_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_change_requests_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_public"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_clicks: {
        Row: {
          clicked_at: string
          id: string
          page_source: string | null
          partner_name: string
          partner_website: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          page_source?: string | null
          partner_name: string
          partner_website: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          id?: string
          page_source?: string | null
          partner_name?: string
          partner_website?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          activation_date: string | null
          address: string | null
          admin_contact_email: string | null
          admin_contact_name: string | null
          admin_notes: string | null
          applications: string[] | null
          cancellation_date: string | null
          contact_person: string | null
          created_at: string
          customer_examples: string[] | null
          description: string | null
          email: string | null
          geography: string[] | null
          id: string
          industries: string[] | null
          is_featured: boolean | null
          logo_dark_bg: boolean
          logo_url: string | null
          monthly_fee: number | null
          name: string
          phone: string | null
          product_filters: Json | null
          secondary_industries: string[] | null
          slug: string
          updated_at: string
          website: string
        }
        Insert: {
          activation_date?: string | null
          address?: string | null
          admin_contact_email?: string | null
          admin_contact_name?: string | null
          admin_notes?: string | null
          applications?: string[] | null
          cancellation_date?: string | null
          contact_person?: string | null
          created_at?: string
          customer_examples?: string[] | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string
          industries?: string[] | null
          is_featured?: boolean | null
          logo_dark_bg?: boolean
          logo_url?: string | null
          monthly_fee?: number | null
          name: string
          phone?: string | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          slug: string
          updated_at?: string
          website: string
        }
        Update: {
          activation_date?: string | null
          address?: string | null
          admin_contact_email?: string | null
          admin_contact_name?: string | null
          admin_notes?: string | null
          applications?: string[] | null
          cancellation_date?: string | null
          contact_person?: string | null
          created_at?: string
          customer_examples?: string[] | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string
          industries?: string[] | null
          is_featured?: boolean | null
          logo_dark_bg?: boolean
          logo_url?: string | null
          monthly_fee?: number | null
          name?: string
          phone?: string | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          slug?: string
          updated_at?: string
          website?: string
        }
        Relationships: []
      }
    }
    Views: {
      partners_public: {
        Row: {
          applications: string[] | null
          created_at: string | null
          customer_examples: string[] | null
          description: string | null
          geography: string[] | null
          id: string | null
          industries: string[] | null
          is_featured: boolean | null
          logo_dark_bg: boolean | null
          logo_url: string | null
          name: string | null
          product_filters: Json | null
          secondary_industries: string[] | null
          slug: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          applications?: string[] | null
          created_at?: string | null
          customer_examples?: string[] | null
          description?: string | null
          geography?: string[] | null
          id?: string | null
          industries?: string[] | null
          is_featured?: boolean | null
          logo_dark_bg?: boolean | null
          logo_url?: string | null
          name?: string | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          slug?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          applications?: string[] | null
          created_at?: string | null
          customer_examples?: string[] | null
          description?: string | null
          geography?: string[] | null
          id?: string | null
          industries?: string[] | null
          is_featured?: boolean | null
          logo_dark_bg?: boolean | null
          logo_url?: string | null
          name?: string | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          slug?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
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
    Enums: {},
  },
} as const
