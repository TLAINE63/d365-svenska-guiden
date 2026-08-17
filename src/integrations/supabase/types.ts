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
      assessments: {
        Row: {
          background: Json
          company: string
          consent: boolean
          contact_email: string
          contact_name: string
          created_at: string
          dimension_scores: Json
          followup_preference: string | null
          free_text: string | null
          id: string
          meta: Json
          responses: Json
        }
        Insert: {
          background?: Json
          company: string
          consent?: boolean
          contact_email: string
          contact_name: string
          created_at?: string
          dimension_scores?: Json
          followup_preference?: string | null
          free_text?: string | null
          id?: string
          meta?: Json
          responses?: Json
        }
        Update: {
          background?: Json
          company?: string
          consent?: boolean
          contact_email?: string
          contact_name?: string
          created_at?: string
          dimension_scores?: Json
          followup_preference?: string | null
          free_text?: string | null
          id?: string
          meta?: Json
          responses?: Json
        }
        Relationships: []
      }
      contact_attempt_blocked: {
        Row: {
          created_at: string
          id: string
          partner_id: string
          source_context: string
        }
        Insert: {
          created_at?: string
          id?: string
          partner_id: string
          source_context?: string
        }
        Update: {
          created_at?: string
          id?: string
          partner_id?: string
          source_context?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_attempt_blocked_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_attempt_blocked_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_basic_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_attempt_blocked_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_public"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
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
          message_id?: string | null
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
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          subject?: string | null
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
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
      isv_solution_overrides: {
        Row: {
          combos: string[] | null
          created_at: string
          short_description: string | null
          solution_id: string
          updated_at: string
          use_cases: string[] | null
          what: string | null
          when_fits: string | null
        }
        Insert: {
          combos?: string[] | null
          created_at?: string
          short_description?: string | null
          solution_id: string
          updated_at?: string
          use_cases?: string[] | null
          what?: string | null
          when_fits?: string | null
        }
        Update: {
          combos?: string[] | null
          created_at?: string
          short_description?: string | null
          solution_id?: string
          updated_at?: string
          use_cases?: string[] | null
          what?: string | null
          when_fits?: string | null
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
          attribution_news_id: string | null
          attribution_source: string | null
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
          attribution_news_id?: string | null
          attribution_source?: string | null
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
          attribution_news_id?: string | null
          attribution_source?: string | null
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
        Relationships: [
          {
            foreignKeyName: "leads_attribution_news_id_fkey"
            columns: ["attribution_news_id"]
            isOneToOne: false
            referencedRelation: "partner_news"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_ai_knowledge: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          matching_profile: Json
          notes: string | null
          partner_id: string
          raw_content: string | null
          source_version: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          matching_profile?: Json
          notes?: string | null
          partner_id: string
          raw_content?: string | null
          source_version?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          matching_profile?: Json
          notes?: string | null
          partner_id?: string
          raw_content?: string | null
          source_version?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_ai_knowledge_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_ai_knowledge_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_basic_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_ai_knowledge_partner_id_fkey"
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
            referencedRelation: "partners_basic_public"
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
            referencedRelation: "partners_basic_public"
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
      partner_feeds: {
        Row: {
          created_at: string
          default_news_type: string
          default_product_areas: string[]
          feed_type: string
          feed_url: string
          id: string
          is_active: boolean
          items_imported: number
          last_error: string | null
          last_fetched_at: string | null
          last_success_at: string | null
          partner_id: string
          source_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_news_type?: string
          default_product_areas?: string[]
          feed_type?: string
          feed_url: string
          id?: string
          is_active?: boolean
          items_imported?: number
          last_error?: string | null
          last_fetched_at?: string | null
          last_success_at?: string | null
          partner_id: string
          source_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_news_type?: string
          default_product_areas?: string[]
          feed_type?: string
          feed_url?: string
          id?: string
          is_active?: boolean
          items_imported?: number
          last_error?: string | null
          last_fetched_at?: string | null
          last_success_at?: string | null
          partner_id?: string
          source_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_feeds_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_feeds_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_basic_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_feeds_partner_id_fkey"
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
            referencedRelation: "partners_basic_public"
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
      partner_news: {
        Row: {
          created_at: string
          editorial_title: string
          id: string
          image_url: string | null
          industry: string | null
          is_featured: boolean
          news_date: string
          news_type: string
          partner_id: string
          product_area: string
          product_areas: string[]
          published_at: string | null
          show_on_home: boolean
          show_on_partner_profile: boolean
          show_on_product_page: boolean
          source_feed_id: string | null
          source_guid: string | null
          source_type: string
          source_url: string
          status: string
          summary: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          editorial_title: string
          id?: string
          image_url?: string | null
          industry?: string | null
          is_featured?: boolean
          news_date?: string
          news_type?: string
          partner_id: string
          product_area?: string
          product_areas?: string[]
          published_at?: string | null
          show_on_home?: boolean
          show_on_partner_profile?: boolean
          show_on_product_page?: boolean
          source_feed_id?: string | null
          source_guid?: string | null
          source_type?: string
          source_url: string
          status?: string
          summary: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          editorial_title?: string
          id?: string
          image_url?: string | null
          industry?: string | null
          is_featured?: boolean
          news_date?: string
          news_type?: string
          partner_id?: string
          product_area?: string
          product_areas?: string[]
          published_at?: string | null
          show_on_home?: boolean
          show_on_partner_profile?: boolean
          show_on_product_page?: boolean
          source_feed_id?: string | null
          source_guid?: string | null
          source_type?: string
          source_url?: string
          status?: string
          summary?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_news_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_news_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_basic_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_news_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_news_source_feed_id_fkey"
            columns: ["source_feed_id"]
            isOneToOne: false
            referencedRelation: "partner_feeds"
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
            referencedRelation: "partners_basic_public"
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
          stats: Json
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
          stats?: Json
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
          stats?: Json
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_submissions: {
        Row: {
          address: string | null
          ai_profile: Json
          applications: string[] | null
          contact_person: string | null
          contact_photo_url: string | null
          delivery_profile: Json | null
          description: string | null
          email: string | null
          geography: string[] | null
          id: string
          implementations_done: string | null
          implementations_per_app: Json
          industries: string[] | null
          industry_apps: Json | null
          invitation_id: string
          logo_url: string | null
          name: string
          not_a_fit: string[] | null
          notes: string | null
          office_cities: string[] | null
          partner_id: string | null
          phone: string | null
          platform_capabilities: string[] | null
          positioning_statement: string | null
          product_filters: Json | null
          product_profiles: Json
          secondary_industries: string[] | null
          submitted_at: string
          team_size_sweden: string | null
          website: string
        }
        Insert: {
          address?: string | null
          ai_profile?: Json
          applications?: string[] | null
          contact_person?: string | null
          contact_photo_url?: string | null
          delivery_profile?: Json | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string
          implementations_done?: string | null
          implementations_per_app?: Json
          industries?: string[] | null
          industry_apps?: Json | null
          invitation_id: string
          logo_url?: string | null
          name: string
          not_a_fit?: string[] | null
          notes?: string | null
          office_cities?: string[] | null
          partner_id?: string | null
          phone?: string | null
          platform_capabilities?: string[] | null
          positioning_statement?: string | null
          product_filters?: Json | null
          product_profiles?: Json
          secondary_industries?: string[] | null
          submitted_at?: string
          team_size_sweden?: string | null
          website: string
        }
        Update: {
          address?: string | null
          ai_profile?: Json
          applications?: string[] | null
          contact_person?: string | null
          contact_photo_url?: string | null
          delivery_profile?: Json | null
          description?: string | null
          email?: string | null
          geography?: string[] | null
          id?: string
          implementations_done?: string | null
          implementations_per_app?: Json
          industries?: string[] | null
          industry_apps?: Json | null
          invitation_id?: string
          logo_url?: string | null
          name?: string
          not_a_fit?: string[] | null
          notes?: string | null
          office_cities?: string[] | null
          partner_id?: string | null
          phone?: string | null
          platform_capabilities?: string[] | null
          positioning_statement?: string | null
          product_filters?: Json | null
          product_profiles?: Json
          secondary_industries?: string[] | null
          submitted_at?: string
          team_size_sweden?: string | null
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
            referencedRelation: "partners_basic_public"
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
          agreement_signed_at: string | null
          ai_profile: Json
          ai_summary: string | null
          ai_summary_generated_at: string | null
          applications: string[] | null
          cancellation_date: string | null
          contact_person: string | null
          contact_photo_url: string | null
          created_at: string
          customer_examples: string[] | null
          delivery_profile: Json | null
          description: string | null
          description_ai_generated: boolean | null
          description_generated_at: string | null
          email: string | null
          extended_content: string | null
          extended_content_updated_at: string | null
          extended_summary: string | null
          geography: string[] | null
          hide_basic_card: boolean
          id: string
          implementations_done: string | null
          implementations_per_app: Json
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
          not_a_fit: string[] | null
          observed_company_sizes: Json
          observed_delivery_geo: Json
          observed_industries: Json
          observed_locations: string[]
          observed_products: Json
          observed_revenue: Json
          observed_updated_at: string | null
          office_cities: string[] | null
          org_number: string | null
          partner_size_tier: number | null
          partner_size_tier_needs_review: boolean
          phone: string | null
          platform_capabilities: string[] | null
          positioning_statement: string | null
          product_filters: Json | null
          product_profiles: Json
          profile_level: string
          published_at: string | null
          related_party: boolean
          secondary_industries: string[] | null
          slug: string
          source_document_filename: string | null
          source_document_mime: string | null
          source_document_text: string | null
          source_document_updated_at: string | null
          source_document_url: string | null
          team_size_sweden: string | null
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
          agreement_signed_at?: string | null
          ai_profile?: Json
          ai_summary?: string | null
          ai_summary_generated_at?: string | null
          applications?: string[] | null
          cancellation_date?: string | null
          contact_person?: string | null
          contact_photo_url?: string | null
          created_at?: string
          customer_examples?: string[] | null
          delivery_profile?: Json | null
          description?: string | null
          description_ai_generated?: boolean | null
          description_generated_at?: string | null
          email?: string | null
          extended_content?: string | null
          extended_content_updated_at?: string | null
          extended_summary?: string | null
          geography?: string[] | null
          hide_basic_card?: boolean
          id?: string
          implementations_done?: string | null
          implementations_per_app?: Json
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
          not_a_fit?: string[] | null
          observed_company_sizes?: Json
          observed_delivery_geo?: Json
          observed_industries?: Json
          observed_locations?: string[]
          observed_products?: Json
          observed_revenue?: Json
          observed_updated_at?: string | null
          office_cities?: string[] | null
          org_number?: string | null
          partner_size_tier?: number | null
          partner_size_tier_needs_review?: boolean
          phone?: string | null
          platform_capabilities?: string[] | null
          positioning_statement?: string | null
          product_filters?: Json | null
          product_profiles?: Json
          profile_level?: string
          published_at?: string | null
          related_party?: boolean
          secondary_industries?: string[] | null
          slug: string
          source_document_filename?: string | null
          source_document_mime?: string | null
          source_document_text?: string | null
          source_document_updated_at?: string | null
          source_document_url?: string | null
          team_size_sweden?: string | null
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
          agreement_signed_at?: string | null
          ai_profile?: Json
          ai_summary?: string | null
          ai_summary_generated_at?: string | null
          applications?: string[] | null
          cancellation_date?: string | null
          contact_person?: string | null
          contact_photo_url?: string | null
          created_at?: string
          customer_examples?: string[] | null
          delivery_profile?: Json | null
          description?: string | null
          description_ai_generated?: boolean | null
          description_generated_at?: string | null
          email?: string | null
          extended_content?: string | null
          extended_content_updated_at?: string | null
          extended_summary?: string | null
          geography?: string[] | null
          hide_basic_card?: boolean
          id?: string
          implementations_done?: string | null
          implementations_per_app?: Json
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
          not_a_fit?: string[] | null
          observed_company_sizes?: Json
          observed_delivery_geo?: Json
          observed_industries?: Json
          observed_locations?: string[]
          observed_products?: Json
          observed_revenue?: Json
          observed_updated_at?: string | null
          office_cities?: string[] | null
          org_number?: string | null
          partner_size_tier?: number | null
          partner_size_tier_needs_review?: boolean
          phone?: string | null
          platform_capabilities?: string[] | null
          positioning_statement?: string | null
          product_filters?: Json | null
          product_profiles?: Json
          profile_level?: string
          published_at?: string | null
          related_party?: boolean
          secondary_industries?: string[] | null
          slug?: string
          source_document_filename?: string | null
          source_document_mime?: string | null
          source_document_text?: string | null
          source_document_updated_at?: string | null
          source_document_url?: string | null
          team_size_sweden?: string | null
          updated_at?: string
          website?: string
          youtube_video_id?: string | null
        }
        Relationships: []
      }
      product_prices: {
        Row: {
          category: string
          created_at: string
          id: string
          is_quote: boolean
          price_note: string | null
          price_sek: number | null
          price_unit: string
          product_key: string
          product_name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_quote?: boolean
          price_note?: string | null
          price_sek?: number | null
          price_unit?: string
          product_key: string
          product_name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_quote?: boolean
          price_note?: string | null
          price_sek?: number | null
          price_unit?: string
          product_key?: string
          product_name?: string
          sort_order?: number
          updated_at?: string
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
      seo_keyword_daily: {
        Row: {
          cpc: number | null
          created_at: string
          database: string
          estimated_traffic: number | null
          id: string
          keyword: string
          position: number | null
          previous_position: number | null
          raw: Json | null
          search_volume: number | null
          snapshot_date: string
          source: string
          url: string | null
        }
        Insert: {
          cpc?: number | null
          created_at?: string
          database?: string
          estimated_traffic?: number | null
          id?: string
          keyword: string
          position?: number | null
          previous_position?: number | null
          raw?: Json | null
          search_volume?: number | null
          snapshot_date: string
          source?: string
          url?: string | null
        }
        Update: {
          cpc?: number | null
          created_at?: string
          database?: string
          estimated_traffic?: number | null
          id?: string
          keyword?: string
          position?: number | null
          previous_position?: number | null
          raw?: Json | null
          search_volume?: number | null
          snapshot_date?: string
          source?: string
          url?: string | null
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
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      unprofiled_partners: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_visible: boolean
          name: string
          note: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          name: string
          note?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          name?: string
          note?: string | null
          updated_at?: string
          website?: string | null
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
      partner_events_public: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string | null
          event_date: string | null
          event_link: string | null
          event_time: string | null
          id: string | null
          image_url: string | null
          is_online: boolean | null
          location: string | null
          partner_id: string | null
          recording_available: boolean | null
          recording_url: string | null
          registration_deadline: string | null
          registration_link: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_date?: string | null
          event_link?: string | null
          event_time?: string | null
          id?: string | null
          image_url?: string | null
          is_online?: boolean | null
          location?: string | null
          partner_id?: string | null
          recording_available?: boolean | null
          recording_url?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_date?: string | null
          event_link?: string | null
          event_time?: string | null
          id?: string | null
          image_url?: string | null
          is_online?: boolean | null
          location?: string | null
          partner_id?: string | null
          recording_available?: boolean | null
          recording_url?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
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
            referencedRelation: "partners_basic_public"
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
      partners_basic_public: {
        Row: {
          created_at: string | null
          extended_content: string | null
          extended_content_updated_at: string | null
          extended_summary: string | null
          id: string | null
          name: string | null
          observed_company_sizes: Json | null
          observed_delivery_geo: Json | null
          observed_industries: Json | null
          observed_locations: string[] | null
          observed_products: Json | null
          observed_revenue: Json | null
          observed_updated_at: string | null
          profile_level: string | null
          slug: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          extended_content?: string | null
          extended_content_updated_at?: string | null
          extended_summary?: string | null
          id?: string | null
          name?: string | null
          observed_company_sizes?: Json | null
          observed_delivery_geo?: Json | null
          observed_industries?: Json | null
          observed_locations?: string[] | null
          observed_products?: Json | null
          observed_revenue?: Json | null
          observed_updated_at?: string | null
          profile_level?: string | null
          slug?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          extended_content?: string | null
          extended_content_updated_at?: string | null
          extended_summary?: string | null
          id?: string | null
          name?: string | null
          observed_company_sizes?: Json | null
          observed_delivery_geo?: Json | null
          observed_industries?: Json | null
          observed_locations?: string[] | null
          observed_products?: Json | null
          observed_revenue?: Json | null
          observed_updated_at?: string | null
          profile_level?: string | null
          slug?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      partners_public: {
        Row: {
          agreement_signed: boolean | null
          ai_profile: Json | null
          ai_summary: string | null
          ai_summary_generated_at: string | null
          applications: string[] | null
          contact_person: string | null
          contact_photo_url: string | null
          created_at: string | null
          customer_examples: string[] | null
          delivery_profile: Json | null
          description: string | null
          email: string | null
          extended_content: string | null
          extended_content_updated_at: string | null
          geography: string[] | null
          id: string | null
          implementations_done: string | null
          implementations_per_app: Json | null
          industries: string[] | null
          industry_apps: Json | null
          industry_pitches: Json | null
          is_featured: boolean | null
          logo_dark_bg: boolean | null
          logo_url: string | null
          map_url: string | null
          name: string | null
          not_a_fit: string[] | null
          office_cities: string[] | null
          partner_size_tier: number | null
          partner_size_tier_needs_review: boolean | null
          phone: string | null
          positioning_statement: string | null
          product_filters: Json | null
          related_party: boolean | null
          secondary_industries: string[] | null
          slug: string | null
          team_size_sweden: string | null
          updated_at: string | null
          website: string | null
          youtube_video_id: string | null
        }
        Insert: {
          agreement_signed?: boolean | null
          ai_profile?: Json | null
          ai_summary?: string | null
          ai_summary_generated_at?: string | null
          applications?: string[] | null
          contact_person?: string | null
          contact_photo_url?: string | null
          created_at?: string | null
          customer_examples?: string[] | null
          delivery_profile?: Json | null
          description?: string | null
          email?: string | null
          extended_content?: string | null
          extended_content_updated_at?: string | null
          geography?: string[] | null
          id?: string | null
          implementations_done?: string | null
          implementations_per_app?: Json | null
          industries?: string[] | null
          industry_apps?: Json | null
          industry_pitches?: Json | null
          is_featured?: boolean | null
          logo_dark_bg?: boolean | null
          logo_url?: string | null
          map_url?: string | null
          name?: string | null
          not_a_fit?: string[] | null
          office_cities?: string[] | null
          partner_size_tier?: number | null
          partner_size_tier_needs_review?: boolean | null
          phone?: string | null
          positioning_statement?: string | null
          product_filters?: Json | null
          related_party?: boolean | null
          secondary_industries?: string[] | null
          slug?: string | null
          team_size_sweden?: string | null
          updated_at?: string | null
          website?: string | null
          youtube_video_id?: string | null
        }
        Update: {
          agreement_signed?: boolean | null
          ai_profile?: Json | null
          ai_summary?: string | null
          ai_summary_generated_at?: string | null
          applications?: string[] | null
          contact_person?: string | null
          contact_photo_url?: string | null
          created_at?: string | null
          customer_examples?: string[] | null
          delivery_profile?: Json | null
          description?: string | null
          email?: string | null
          extended_content?: string | null
          extended_content_updated_at?: string | null
          geography?: string[] | null
          id?: string | null
          implementations_done?: string | null
          implementations_per_app?: Json | null
          industries?: string[] | null
          industry_apps?: Json | null
          industry_pitches?: Json | null
          is_featured?: boolean | null
          logo_dark_bg?: boolean | null
          logo_url?: string | null
          map_url?: string | null
          name?: string | null
          not_a_fit?: string[] | null
          office_cities?: string[] | null
          partner_size_tier?: number | null
          partner_size_tier_needs_review?: boolean | null
          phone?: string | null
          positioning_statement?: string | null
          product_filters?: Json | null
          related_party?: boolean | null
          secondary_industries?: string[] | null
          slug?: string | null
          team_size_sweden?: string | null
          updated_at?: string | null
          website?: string | null
          youtube_video_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_all_partner_names: {
        Args: never
        Returns: {
          agreement_signed: boolean
          id: string
          is_featured: boolean
          name: string
          product_filters: Json
          slug: string
        }[]
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
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
