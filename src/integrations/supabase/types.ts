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
      ai_usage_log: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          ip_hash: string
          usage_day: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          ip_hash: string
          usage_day?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          ip_hash?: string
          usage_day?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          metadata: Json | null
          recipient_email: string
          status: string
          subject: string | null
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email: string
          status?: string
          subject?: string | null
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email?: string
          status?: string
          subject?: string | null
          template_name?: string
        }
        Relationships: []
      }
      funnel_events: {
        Row: {
          event_name: string
          event_type: string
          id: string
          ip_anonymized: string | null
          metadata: Json
          occurred_at: string
          page_path: string | null
          session_id: string | null
          step_number: number | null
          user_agent: string | null
        }
        Insert: {
          event_name: string
          event_type: string
          id?: string
          ip_anonymized?: string | null
          metadata?: Json
          occurred_at?: string
          page_path?: string | null
          session_id?: string | null
          step_number?: number | null
          user_agent?: string | null
        }
        Update: {
          event_name?: string
          event_type?: string
          id?: string
          ip_anonymized?: string | null
          metadata?: Json
          occurred_at?: string
          page_path?: string | null
          session_id?: string | null
          step_number?: number | null
          user_agent?: string | null
        }
        Relationships: []
      }
      industry_pages: {
        Row: {
          ai_generated_at: string | null
          applications: Json
          challenges: Json
          created_at: string
          faq: Json
          hero_image_url: string | null
          id: string
          intro: string | null
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          processes: Json
          related_industries: string[]
          roles: Json
          slug: string
          updated_at: string
        }
        Insert: {
          ai_generated_at?: string | null
          applications?: Json
          challenges?: Json
          created_at?: string
          faq?: Json
          hero_image_url?: string | null
          id?: string
          intro?: string | null
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          processes?: Json
          related_industries?: string[]
          roles?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          ai_generated_at?: string | null
          applications?: Json
          challenges?: Json
          created_at?: string
          faq?: Json
          hero_image_url?: string | null
          id?: string
          intro?: string | null
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          processes?: Json
          related_industries?: string[]
          roles?: Json
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_articles: {
        Row: {
          category: string
          content_type: string
          created_at: string
          description: string | null
          format: string
          id: string
          image_url: string | null
          is_published: boolean
          published_at: string | null
          slug: string | null
          target_roles: string[]
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category?: string
          content_type?: string
          created_at?: string
          description?: string | null
          format?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          slug?: string | null
          target_roles?: string[]
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string
          content_type?: string
          created_at?: string
          description?: string | null
          format?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          slug?: string | null
          target_roles?: string[]
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
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
      partner_filter_exposures: {
        Row: {
          filter_context: Json
          id: string
          ip_anonymized: string | null
          page_path: string
          partner_id: string | null
          partner_slug: string
          session_id: string | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          filter_context?: Json
          id?: string
          ip_anonymized?: string | null
          page_path: string
          partner_id?: string | null
          partner_slug: string
          session_id?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          filter_context?: Json
          id?: string
          ip_anonymized?: string | null
          page_path?: string
          partner_id?: string | null
          partner_slug?: string
          session_id?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Relationships: []
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
      partner_profile_views: {
        Row: {
          id: string
          ip_address_anonymized: string | null
          page_source: string | null
          partner_id: string | null
          partner_slug: string
          referrer: string | null
          user_agent: string | null
          view_type: string
          viewed_at: string
        }
        Insert: {
          id?: string
          ip_address_anonymized?: string | null
          page_source?: string | null
          partner_id?: string | null
          partner_slug: string
          referrer?: string | null
          user_agent?: string | null
          view_type: string
          viewed_at?: string
        }
        Update: {
          id?: string
          ip_address_anonymized?: string | null
          page_source?: string | null
          partner_id?: string | null
          partner_slug?: string
          referrer?: string | null
          user_agent?: string | null
          view_type?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_profile_views_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_profile_views_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_public"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_report_drafts: {
        Row: {
          companies: Json
          created_at: string
          error_message: string | null
          excluded_organisation_uuids: string[]
          id: string
          intro_text: string | null
          partner_id: string | null
          partner_name: string
          partner_slug: string
          period_end: string
          period_start: string
          recipient_email: string | null
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          companies?: Json
          created_at?: string
          error_message?: string | null
          excluded_organisation_uuids?: string[]
          id?: string
          intro_text?: string | null
          partner_id?: string | null
          partner_name: string
          partner_slug: string
          period_end: string
          period_start: string
          recipient_email?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          companies?: Json
          created_at?: string
          error_message?: string | null
          excluded_organisation_uuids?: string[]
          id?: string
          intro_text?: string | null
          partner_id?: string | null
          partner_name?: string
          partner_slug?: string
          period_end?: string
          period_start?: string
          recipient_email?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_submissions: {
        Row: {
          address: string | null
          applications: string[] | null
          contact_person: string | null
          contact_photo_url: string | null
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
          platform_capabilities: string[] | null
          product_filters: Json | null
          secondary_industries: string[] | null
          submitted_at: string
          website: string
        }
        Insert: {
          address?: string | null
          applications?: string[] | null
          contact_person?: string | null
          contact_photo_url?: string | null
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
          platform_capabilities?: string[] | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          submitted_at?: string
          website: string
        }
        Update: {
          address?: string | null
          applications?: string[] | null
          contact_person?: string | null
          contact_photo_url?: string | null
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
          platform_capabilities?: string[] | null
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
          agreement_notes: string | null
          agreement_signed: boolean
          ai_summary: string | null
          ai_summary_generated_at: string | null
          applications: string[] | null
          cancellation_date: string | null
          contact_person: string | null
          contact_photo_url: string | null
          created_at: string
          customer_examples: string[] | null
          description: string | null
          email: string | null
          geography: string[] | null
          id: string
          industries: string[] | null
          industry_apps: Json | null
          industry_pitches: Json
          invoice_contact: string | null
          invoice_email: string | null
          is_featured: boolean | null
          legal_name: string | null
          logo_dark_bg: boolean
          logo_url: string | null
          map_url: string | null
          monthly_fee: number | null
          name: string
          office_cities: string[] | null
          org_number: string | null
          phone: string | null
          platform_capabilities: string[] | null
          product_filters: Json | null
          secondary_industries: string[] | null
          slug: string
          updated_at: string
          website: string
          youtube_video_id: string | null
        }
        Insert: {
          activation_date?: string | null
          address?: string | null
          admin_contact_email?: string | null
          admin_contact_name?: string | null
          admin_notes?: string | null
          agreement_notes?: string | null
          agreement_signed?: boolean
          ai_summary?: string | null
          ai_summary_generated_at?: string | null
          applications?: string[] | null
          cancellation_date?: string | null
          contact_person?: string | null
          contact_photo_url?: string | null
          created_at?: string
          customer_examples?: string[] | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string
          industries?: string[] | null
          industry_apps?: Json | null
          industry_pitches?: Json
          invoice_contact?: string | null
          invoice_email?: string | null
          is_featured?: boolean | null
          legal_name?: string | null
          logo_dark_bg?: boolean
          logo_url?: string | null
          map_url?: string | null
          monthly_fee?: number | null
          name: string
          office_cities?: string[] | null
          org_number?: string | null
          phone?: string | null
          platform_capabilities?: string[] | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          slug: string
          updated_at?: string
          website: string
          youtube_video_id?: string | null
        }
        Update: {
          activation_date?: string | null
          address?: string | null
          admin_contact_email?: string | null
          admin_contact_name?: string | null
          admin_notes?: string | null
          agreement_notes?: string | null
          agreement_signed?: boolean
          ai_summary?: string | null
          ai_summary_generated_at?: string | null
          applications?: string[] | null
          cancellation_date?: string | null
          contact_person?: string | null
          contact_photo_url?: string | null
          created_at?: string
          customer_examples?: string[] | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string
          industries?: string[] | null
          industry_apps?: Json | null
          industry_pitches?: Json
          invoice_contact?: string | null
          invoice_email?: string | null
          is_featured?: boolean | null
          legal_name?: string | null
          logo_dark_bg?: boolean
          logo_url?: string | null
          map_url?: string | null
          monthly_fee?: number | null
          name?: string
          office_cities?: string[] | null
          org_number?: string | null
          phone?: string | null
          platform_capabilities?: string[] | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          slug?: string
          updated_at?: string
          website?: string
          youtube_video_id?: string | null
        }
        Relationships: []
      }
      semrush_monthly_stats: {
        Row: {
          authority_score: number | null
          backlinks: number | null
          created_at: string
          domain: string
          id: string
          month: string
          notes: string | null
          organic_keywords: number | null
          organic_traffic: number | null
          referring_domains: number | null
          top_keywords: Json | null
          top_pages: Json | null
          updated_at: string
        }
        Insert: {
          authority_score?: number | null
          backlinks?: number | null
          created_at?: string
          domain?: string
          id?: string
          month: string
          notes?: string | null
          organic_keywords?: number | null
          organic_traffic?: number | null
          referring_domains?: number | null
          top_keywords?: Json | null
          top_pages?: Json | null
          updated_at?: string
        }
        Update: {
          authority_score?: number | null
          backlinks?: number | null
          created_at?: string
          domain?: string
          id?: string
          month?: string
          notes?: string | null
          organic_keywords?: number | null
          organic_traffic?: number | null
          referring_domains?: number | null
          top_keywords?: Json | null
          top_pages?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      seo_keyword_rankings: {
        Row: {
          clicks: number | null
          created_at: string
          ctr: number | null
          id: string
          impressions: number | null
          index_status: string
          keyword: string
          month: string
          notes: string | null
          position: number | null
          target_url: string | null
          updated_at: string
        }
        Insert: {
          clicks?: number | null
          created_at?: string
          ctr?: number | null
          id?: string
          impressions?: number | null
          index_status?: string
          keyword: string
          month: string
          notes?: string | null
          position?: number | null
          target_url?: string | null
          updated_at?: string
        }
        Update: {
          clicks?: number | null
          created_at?: string
          ctr?: number | null
          id?: string
          impressions?: number | null
          index_status?: string
          keyword?: string
          month?: string
          notes?: string | null
          position?: number | null
          target_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seo_keyword_weekly: {
        Row: {
          clicks: number
          created_at: string
          ctr: number | null
          id: string
          impressions: number
          keyword: string
          position: number | null
          source: string
          target_url: string | null
          week_start: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          ctr?: number | null
          id?: string
          impressions?: number
          keyword: string
          position?: number | null
          source?: string
          target_url?: string | null
          week_start: string
        }
        Update: {
          clicks?: number
          created_at?: string
          ctr?: number | null
          id?: string
          impressions?: number
          keyword?: string
          position?: number | null
          source?: string
          target_url?: string | null
          week_start?: string
        }
        Relationships: []
      }
      seo_tracked_keywords: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          keyword: string
          notes: string | null
          target_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          keyword: string
          notes?: string | null
          target_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          keyword?: string
          notes?: string | null
          target_url?: string | null
          updated_at?: string
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
      snitcher_visits: {
        Row: {
          company_country: string | null
          company_domain: string | null
          company_industry: string | null
          company_logo_url: string | null
          company_name: string | null
          company_size: string | null
          id: string
          organisation_uuid: string
          partner_slugs: string[]
          raw_data: Json | null
          session_ended_at: string | null
          session_started_at: string | null
          session_uuid: string
          synced_at: string
          visited_urls: Json
          workspace_uuid: string
        }
        Insert: {
          company_country?: string | null
          company_domain?: string | null
          company_industry?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_size?: string | null
          id?: string
          organisation_uuid: string
          partner_slugs?: string[]
          raw_data?: Json | null
          session_ended_at?: string | null
          session_started_at?: string | null
          session_uuid: string
          synced_at?: string
          visited_urls?: Json
          workspace_uuid: string
        }
        Update: {
          company_country?: string | null
          company_domain?: string | null
          company_industry?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_size?: string | null
          id?: string
          organisation_uuid?: string
          partner_slugs?: string[]
          raw_data?: Json | null
          session_ended_at?: string | null
          session_started_at?: string | null
          session_uuid?: string
          synced_at?: string
          visited_urls?: Json
          workspace_uuid?: string
        }
        Relationships: []
      }
      visitor_analytics: {
        Row: {
          geo_city: string | null
          geo_country: string | null
          geo_country_code: string | null
          geo_org: string | null
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
          geo_org?: string | null
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
          geo_org?: string | null
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
          agreement_signed: boolean | null
          applications: string[] | null
          contact_person: string | null
          contact_photo_url: string | null
          created_at: string | null
          customer_examples: string[] | null
          description: string | null
          email: string | null
          geography: string[] | null
          id: string | null
          industries: string[] | null
          industry_apps: Json | null
          industry_pitches: Json | null
          invoice_contact: string | null
          invoice_email: string | null
          is_featured: boolean | null
          legal_name: string | null
          logo_dark_bg: boolean | null
          logo_url: string | null
          map_url: string | null
          name: string | null
          office_cities: string[] | null
          org_number: string | null
          phone: string | null
          product_filters: Json | null
          secondary_industries: string[] | null
          slug: string | null
          updated_at: string | null
          website: string | null
          youtube_video_id: string | null
        }
        Insert: {
          agreement_signed?: boolean | null
          applications?: string[] | null
          contact_person?: string | null
          contact_photo_url?: string | null
          created_at?: string | null
          customer_examples?: string[] | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string | null
          industries?: string[] | null
          industry_apps?: Json | null
          industry_pitches?: Json | null
          invoice_contact?: string | null
          invoice_email?: string | null
          is_featured?: boolean | null
          legal_name?: string | null
          logo_dark_bg?: boolean | null
          logo_url?: string | null
          map_url?: string | null
          name?: string | null
          office_cities?: string[] | null
          org_number?: string | null
          phone?: string | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          slug?: string | null
          updated_at?: string | null
          website?: string | null
          youtube_video_id?: string | null
        }
        Update: {
          agreement_signed?: boolean | null
          applications?: string[] | null
          contact_person?: string | null
          contact_photo_url?: string | null
          created_at?: string | null
          customer_examples?: string[] | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string | null
          industries?: string[] | null
          industry_apps?: Json | null
          industry_pitches?: Json | null
          invoice_contact?: string | null
          invoice_email?: string | null
          is_featured?: boolean | null
          legal_name?: string | null
          logo_dark_bg?: boolean | null
          logo_url?: string | null
          map_url?: string | null
          name?: string | null
          office_cities?: string[] | null
          org_number?: string | null
          phone?: string | null
          product_filters?: Json | null
          secondary_industries?: string[] | null
          slug?: string | null
          updated_at?: string | null
          website?: string | null
          youtube_video_id?: string | null
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
