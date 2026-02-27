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
      partner_clicks: {
        Row: {
          clicked_at: string
          id: string
          ip_address_anonymized: string | null
          page_source: string | null
          partner_name: string
          partner_website: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          ip_address_anonymized?: string | null
          page_source?: string | null
          partner_name: string
          partner_website: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          id?: string
          ip_address_anonymized?: string | null
          page_source?: string | null
          partner_name?: string
          partner_website?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      partner_event_tokens: {
        Row: {
          created_at: string
          id: string
          last_accessed_at: string | null
          partner_id: string
          token: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_accessed_at?: string | null
          partner_id: string
          token?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_accessed_at?: string | null
          partner_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_event_tokens_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: true
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_event_tokens_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: true
            referencedRelation: "partners_public"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_events: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string | null
          end_time: string | null
          event_date: string
          event_link: string | null
          event_time: string | null
          id: string
          image_url: string | null
          is_online: boolean
          location: string | null
          partner_id: string | null
          recording_available: boolean
          recording_url: string | null
          registration_deadline: string | null
          registration_link: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date: string
          event_link?: string | null
          event_time?: string | null
          id?: string
          image_url?: string | null
          is_online?: boolean
          location?: string | null
          partner_id?: string | null
          recording_available?: boolean
          recording_url?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date?: string
          event_link?: string | null
          event_time?: string | null
          id?: string
          image_url?: string | null
          is_online?: boolean
          location?: string | null
          partner_id?: string | null
          recording_available?: boolean
          recording_url?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_events_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_events_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_public"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          partner_id: string | null
          partner_name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          token: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          partner_id?: string | null
          partner_name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          token?: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          partner_id?: string | null
          partner_name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_invitations_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_invitations_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_public"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_submissions: {
        Row: {
          address: string | null
          applications: string[] | null
          contact_person: string | null
          description: string | null
          email: string | null
          geography: string[] | null
          id: string
          industries: string[] | null
          industry_apps: Json | null
          invitation_id: string
          logo_url: string | null
          name: string
          notes: string | null
          office_cities: string[] | null
          partner_id: string | null
          phone: string | null
          product_filters: Json | null
          secondary_industries: string[] | null
          submitted_at: string
          website: string
        }
        Insert: {
          address?: string | null
          applications?: string[] | null
          contact_person?: string | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string
          industries?: string[] | null
          industry_apps?: Json | null
          invitation_id: string
          logo_url?: string | null
          name: string
          notes?: string | null
          office_cities?: string[] | null
          partner_id?: string | null
          phone?: string | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          submitted_at?: string
          website: string
        }
        Update: {
          address?: string | null
          applications?: string[] | null
          contact_person?: string | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string
          industries?: string[] | null
          industry_apps?: Json | null
          invitation_id?: string
          logo_url?: string | null
          name?: string
          notes?: string | null
          office_cities?: string[] | null
          partner_id?: string | null
          phone?: string | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          submitted_at?: string
          website?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_submissions_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "partner_invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_submissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_submissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_public"
            referencedColumns: ["id"]
          },
        ]
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
          industry_apps: Json | null
          is_featured: boolean | null
          logo_dark_bg: boolean
          logo_url: string | null
          map_url: string | null
          monthly_fee: number | null
          name: string
          office_cities: string[] | null
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
          industry_apps?: Json | null
          is_featured?: boolean | null
          logo_dark_bg?: boolean
          logo_url?: string | null
          map_url?: string | null
          monthly_fee?: number | null
          name: string
          office_cities?: string[] | null
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
          industry_apps?: Json | null
          is_featured?: boolean | null
          logo_dark_bg?: boolean
          logo_url?: string | null
          map_url?: string | null
          monthly_fee?: number | null
          name?: string
          office_cities?: string[] | null
          phone?: string | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          slug?: string
          updated_at?: string
          website?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      visitor_analytics: {
        Row: {
          geo_city: string | null
          geo_country: string | null
          geo_country_code: string | null
          geo_region: string | null
          id: string
          ip_anonymized: string | null
          is_bounce: boolean | null
          page_path: string
          referrer: string | null
          session_id: string | null
          time_on_page_seconds: number | null
          user_agent: string | null
          visited_at: string
        }
        Insert: {
          geo_city?: string | null
          geo_country?: string | null
          geo_country_code?: string | null
          geo_region?: string | null
          id?: string
          ip_anonymized?: string | null
          is_bounce?: boolean | null
          page_path: string
          referrer?: string | null
          session_id?: string | null
          time_on_page_seconds?: number | null
          user_agent?: string | null
          visited_at?: string
        }
        Update: {
          geo_city?: string | null
          geo_country?: string | null
          geo_country_code?: string | null
          geo_region?: string | null
          id?: string
          ip_anonymized?: string | null
          is_bounce?: boolean | null
          page_path?: string
          referrer?: string | null
          session_id?: string | null
          time_on_page_seconds?: number | null
          user_agent?: string | null
          visited_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      partners_public: {
        Row: {
          applications: string[] | null
          contact_person: string | null
          created_at: string | null
          customer_examples: string[] | null
          description: string | null
          email: string | null
          geography: string[] | null
          id: string | null
          industries: string[] | null
          industry_apps: Json | null
          is_featured: boolean | null
          logo_dark_bg: boolean | null
          logo_url: string | null
          map_url: string | null
          name: string | null
          office_cities: string[] | null
          phone: string | null
          product_filters: Json | null
          secondary_industries: string[] | null
          slug: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          applications?: string[] | null
          contact_person?: string | null
          created_at?: string | null
          customer_examples?: string[] | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string | null
          industries?: string[] | null
          industry_apps?: Json | null
          is_featured?: boolean | null
          logo_dark_bg?: boolean | null
          logo_url?: string | null
          map_url?: string | null
          name?: string | null
          office_cities?: string[] | null
          phone?: string | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          slug?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          applications?: string[] | null
          contact_person?: string | null
          created_at?: string | null
          customer_examples?: string[] | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string | null
          industries?: string[] | null
          industry_apps?: Json | null
          is_featured?: boolean | null
          logo_dark_bg?: boolean | null
          logo_url?: string | null
          map_url?: string | null
          name?: string | null
          office_cities?: string[] | null
          phone?: string | null
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
