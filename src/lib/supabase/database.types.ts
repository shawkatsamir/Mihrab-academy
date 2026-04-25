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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      age_groups: {
        Row: {
          created_at: string
          id: string
          label: string
          max_age: number
          min_age: number
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          max_age: number
          min_age: number
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          max_age?: number
          min_age?: number
          sort_order?: number
        }
        Relationships: []
      }
      attendance: {
        Row: {
          id: string
          marked_at: string
          marked_by: string
          note: string | null
          session_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
        }
        Insert: {
          id?: string
          marked_at?: string
          marked_by: string
          note?: string | null
          session_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
        }
        Update: {
          id?: string
          marked_at?: string
          marked_by?: string
          note?: string | null
          session_id?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_attendance_marked_by"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attendance_session"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attendance_session"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_session_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attendance_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_content: {
        Row: {
          content: Json
          content_type: Database["public"]["Enums"]["lesson_content_type"]
          created_at: string
          created_by: string | null
          id: string
          lesson_id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          content_type: Database["public"]["Enums"]["lesson_content_type"]
          created_at?: string
          created_by?: string | null
          id?: string
          lesson_id: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          content_type?: Database["public"]["Enums"]["lesson_content_type"]
          created_at?: string
          created_by?: string | null
          id?: string
          lesson_id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_lesson_content_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lesson_content_lesson"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          created_by: string | null
          description_md: string | null
          id: string
          milestone_id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description_md?: string | null
          id?: string
          milestone_id: string
          order_index: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description_md?: string | null
          id?: string
          milestone_id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_lessons_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lessons_milestone"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_progress: {
        Row: {
          id: string
          marked_at: string
          marked_by: string
          milestone_id: string
          session_id: string | null
          status: Database["public"]["Enums"]["milestone_status"]
          student_plan_id: string
        }
        Insert: {
          id?: string
          marked_at?: string
          marked_by: string
          milestone_id: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["milestone_status"]
          student_plan_id: string
        }
        Update: {
          id?: string
          marked_at?: string
          marked_by?: string
          milestone_id?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["milestone_status"]
          student_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_milestone_prog_marked_by"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_milestone_prog_milestone"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_milestone_prog_plan"
            columns: ["student_plan_id"]
            isOneToOne: false
            referencedRelation: "student_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_milestone_prog_plan"
            columns: ["student_plan_id"]
            isOneToOne: false
            referencedRelation: "v_student_progress"
            referencedColumns: ["student_plan_id"]
          },
          {
            foreignKeyName: "fk_milestone_prog_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_milestone_prog_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_session_details"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          created_at: string
          created_by: string | null
          description_md: string | null
          estimated_sessions: number | null
          id: string
          order_index: number
          subject_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description_md?: string | null
          estimated_sessions?: number | null
          id?: string
          order_index: number
          subject_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description_md?: string | null
          estimated_sessions?: number | null
          id?: string
          order_index?: number
          subject_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_milestones_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_milestones_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_milestones_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_subject_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_log: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          error: string | null
          id: string
          payload: Json | null
          recipient_id: string | null
          sent_at: string
          session_id: string | null
          status: Database["public"]["Enums"]["notification_status"]
          type: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["notification_channel"]
          error?: string | null
          id?: string
          payload?: Json | null
          recipient_id?: string | null
          sent_at?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          type: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          error?: string | null
          id?: string
          payload?: Json | null
          recipient_id?: string | null
          sent_at?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notif_recipient"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_notif_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_notif_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_session_details"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_ratings: {
        Row: {
          comment: string | null
          id: string
          rating: number
          session_id: string
          student_id: string
          submitted_at: string
        }
        Insert: {
          comment?: string | null
          id?: string
          rating: number
          session_id: string
          student_id: string
          submitted_at?: string
        }
        Update: {
          comment?: string | null
          id?: string
          rating?: number
          session_id?: string
          student_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_parent_ratings_session"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_parent_ratings_session"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_session_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_parent_ratings_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template_subjects: {
        Row: {
          id: string
          is_required: boolean
          order_index: number
          subject_id: string
          template_id: string
        }
        Insert: {
          id?: string
          is_required?: boolean
          order_index: number
          subject_id: string
          template_id: string
        }
        Update: {
          id?: string
          is_required?: boolean
          order_index?: number
          subject_id?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_plan_tpl_subjects_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_plan_tpl_subjects_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_subject_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_plan_tpl_subjects_template"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "plan_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_templates: {
        Row: {
          age_group_id: string | null
          created_at: string
          created_by: string
          id: string
          is_default: boolean
          title: string
          updated_at: string
        }
        Insert: {
          age_group_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_default?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          age_group_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_default?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_plan_tpl_age_group"
            columns: ["age_group_id"]
            isOneToOne: false
            referencedRelation: "age_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_plan_tpl_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          photo_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          is_active?: boolean
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      screenshots: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          session_id: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          session_id: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          session_id?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_screenshots_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_screenshots_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_session_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_screenshots_uploaded_by"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_notes: {
        Row: {
          content_md: string
          created_at: string
          id: string
          is_private: boolean
          session_id: string
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          content_md: string
          created_at?: string
          id?: string
          is_private?: boolean
          session_id: string
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          content_md?: string
          created_at?: string
          id?: string
          is_private?: boolean
          session_id?: string
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_session_notes_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_session_notes_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_session_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_session_notes_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_session_notes_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_session_notes_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "v_teacher_performance"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      session_series: {
        Row: {
          created_at: string
          created_by: string
          duration_minutes: number
          end_date: string | null
          id: string
          recurrence_days: number[] | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"]
          session_time: string
          start_date: string
          status: Database["public"]["Enums"]["series_status"]
          student_id: string
          subject_id: string
          teacher_id: string
          timezone: string
          updated_at: string
          zoom_join_url: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          duration_minutes?: number
          end_date?: string | null
          id?: string
          recurrence_days?: number[] | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"]
          session_time: string
          start_date?: string
          status?: Database["public"]["Enums"]["series_status"]
          student_id: string
          subject_id: string
          teacher_id: string
          timezone?: string
          updated_at?: string
          zoom_join_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          duration_minutes?: number
          end_date?: string | null
          id?: string
          recurrence_days?: number[] | null
          recurrence_type?: Database["public"]["Enums"]["recurrence_type"]
          session_time?: string
          start_date?: string
          status?: Database["public"]["Enums"]["series_status"]
          student_id?: string
          subject_id?: string
          teacher_id?: string
          timezone?: string
          updated_at?: string
          zoom_join_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_series_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_series_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_series_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_series_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_subject_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_series_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_series_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "v_teacher_performance"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      session_supervisor_evals: {
        Row: {
          created_at: string
          id: string
          notes_md: string | null
          rating: number | null
          session_id: string
          supervisor_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes_md?: string | null
          rating?: number | null
          session_id: string
          supervisor_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes_md?: string | null
          rating?: number | null
          session_id?: string
          supervisor_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_supervisor_evals_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_supervisor_evals_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_session_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_supervisor_evals_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_supervisor_evals_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_supervisor_evals_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "v_teacher_performance"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      session_teacher_evals: {
        Row: {
          categories: Json
          created_at: string
          id: string
          is_visible_to_parent: boolean
          notes_md: string | null
          session_id: string
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          categories?: Json
          created_at?: string
          id?: string
          is_visible_to_parent?: boolean
          notes_md?: string | null
          session_id: string
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          categories?: Json
          created_at?: string
          id?: string
          is_visible_to_parent?: boolean
          notes_md?: string | null
          session_id?: string
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_teacher_evals_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_teacher_evals_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_session_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_teacher_evals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_teacher_evals_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_teacher_evals_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "v_teacher_performance"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      sessions: {
        Row: {
          auto_completed: boolean
          cancelled_by: string | null
          cancelled_reason: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          created_by: string
          duration_minutes: number
          homework: Json
          id: string
          is_exception: boolean
          scheduled_at: string
          series_id: string | null
          session_type: Database["public"]["Enums"]["session_type"]
          shift_reason: string | null
          shifted_at: string | null
          shifted_from_session_id: string | null
          status: Database["public"]["Enums"]["session_status"]
          student_id: string
          subject_id: string
          teacher_id: string
          teacher_notes_md: string | null
          updated_at: string
          zoom_join_url: string | null
        }
        Insert: {
          auto_completed?: boolean
          cancelled_by?: string | null
          cancelled_reason?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by: string
          duration_minutes?: number
          homework?: Json
          id?: string
          is_exception?: boolean
          scheduled_at: string
          series_id?: string | null
          session_type?: Database["public"]["Enums"]["session_type"]
          shift_reason?: string | null
          shifted_at?: string | null
          shifted_from_session_id?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          student_id: string
          subject_id: string
          teacher_id: string
          teacher_notes_md?: string | null
          updated_at?: string
          zoom_join_url?: string | null
        }
        Update: {
          auto_completed?: boolean
          cancelled_by?: string | null
          cancelled_reason?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by?: string
          duration_minutes?: number
          homework?: Json
          id?: string
          is_exception?: boolean
          scheduled_at?: string
          series_id?: string | null
          session_type?: Database["public"]["Enums"]["session_type"]
          shift_reason?: string | null
          shifted_at?: string | null
          shifted_from_session_id?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          student_id?: string
          subject_id?: string
          teacher_id?: string
          teacher_notes_md?: string | null
          updated_at?: string
          zoom_join_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sessions_cancelled_by"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_completed_by"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_series"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "session_series"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_subject_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "v_teacher_performance"
            referencedColumns: ["teacher_id"]
          },
          {
            foreignKeyName: "sessions_shifted_from_session_id_fkey"
            columns: ["shifted_from_session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_shifted_from_session_id_fkey"
            columns: ["shifted_from_session_id"]
            isOneToOne: false
            referencedRelation: "v_session_details"
            referencedColumns: ["id"]
          },
        ]
      }
      student_plan_subjects: {
        Row: {
          completed_at: string | null
          id: string
          order_index: number
          started_at: string | null
          status: Database["public"]["Enums"]["plan_subject_status"]
          student_plan_id: string
          subject_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          order_index: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["plan_subject_status"]
          student_plan_id: string
          subject_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          order_index?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["plan_subject_status"]
          student_plan_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_stu_plan_subjects_plan"
            columns: ["student_plan_id"]
            isOneToOne: false
            referencedRelation: "student_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stu_plan_subjects_plan"
            columns: ["student_plan_id"]
            isOneToOne: false
            referencedRelation: "v_student_progress"
            referencedColumns: ["student_plan_id"]
          },
          {
            foreignKeyName: "fk_stu_plan_subjects_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stu_plan_subjects_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_subject_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      student_plans: {
        Row: {
          created_at: string
          created_by: string
          custom_name: string | null
          id: string
          status: Database["public"]["Enums"]["plan_status"]
          student_id: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          custom_name?: string | null
          id?: string
          status?: Database["public"]["Enums"]["plan_status"]
          student_id: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          custom_name?: string | null
          id?: string
          status?: Database["public"]["Enums"]["plan_status"]
          student_id?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_stu_plans_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stu_plans_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stu_plans_template"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "plan_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      student_subjects: {
        Row: {
          assigned_at: string
          assigned_by: string
          id: string
          is_active: boolean
          student_id: string
          subject_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          id?: string
          is_active?: boolean
          student_id: string
          subject_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          id?: string
          is_active?: boolean
          student_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_stu_sub_assigned_by"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stu_sub_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stu_sub_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stu_sub_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_subject_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          age_group_id: string | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          enrollment_date: string
          id: string
          parent_whatsapp: string | null
          updated_at: string
        }
        Insert: {
          age_group_id?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          enrollment_date?: string
          id: string
          parent_whatsapp?: string | null
          updated_at?: string
        }
        Update: {
          age_group_id?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          enrollment_date?: string
          id?: string
          parent_whatsapp?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_students_age_group"
            columns: ["age_group_id"]
            isOneToOne: false
            referencedRelation: "age_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_students_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_students_profile"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          category: Database["public"]["Enums"]["subject_category"]
          created_at: string
          created_by: string | null
          description: string | null
          estimated_sessions: number | null
          id: string
          learning_goals: Json
          name: string
          overview_md: string | null
          sort_order: number
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["subject_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_sessions?: number | null
          id?: string
          learning_goals?: Json
          name: string
          overview_md?: string | null
          sort_order?: number
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["subject_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_sessions?: number | null
          id?: string
          learning_goals?: Json
          name?: string
          overview_md?: string | null
          sort_order?: number
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_subjects_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supervisor_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          id: string
          supervisor_id: string
          teacher_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          id?: string
          supervisor_id: string
          teacher_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          id?: string
          supervisor_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_sup_assign_assigned_by"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sup_assign_supervisor"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sup_assign_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sup_assign_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "v_teacher_performance"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      supervisors: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_supervisors_profile"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_earnings: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          marked_by: string
          session_id: string
          status: string
          teacher_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          marked_by: string
          session_id: string
          status?: string
          teacher_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          marked_by?: string
          session_id?: string
          status?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_earnings_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_earnings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_earnings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_session_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_earnings_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_earnings_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "v_teacher_performance"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      teacher_evaluations: {
        Row: {
          created_at: string
          id: string
          notes_md: string | null
          period_end: string
          period_start: string
          score: number
          supervisor_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes_md?: string | null
          period_end: string
          period_start: string
          score: number
          supervisor_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes_md?: string | null
          period_end?: string
          period_start?: string
          score?: number
          supervisor_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_evals_supervisor"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_evals_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_evals_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "v_teacher_performance"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      teacher_subjects: {
        Row: {
          is_primary: boolean
          subject_id: string
          teacher_id: string
        }
        Insert: {
          is_primary?: boolean
          subject_id: string
          teacher_id: string
        }
        Update: {
          is_primary?: boolean
          subject_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_teacher_subjects_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_teacher_subjects_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_subject_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_teacher_subjects_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_teacher_subjects_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "v_teacher_performance"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      teachers: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          price_per_session: number | null
          sogo_email: string | null
          updated_at: string
          zoom_personal_link: string | null
          zoom_personal_meeting_id: string | null
          zoom_user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id: string
          price_per_session?: number | null
          sogo_email?: string | null
          updated_at?: string
          zoom_personal_link?: string | null
          zoom_personal_meeting_id?: string | null
          zoom_user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          price_per_session?: number | null
          sogo_email?: string | null
          updated_at?: string
          zoom_personal_link?: string | null
          zoom_personal_meeting_id?: string | null
          zoom_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_teachers_profile"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_session_details: {
        Row: {
          attendance_status:
            | Database["public"]["Enums"]["attendance_status"]
            | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          homework: Json | null
          id: string | null
          is_exception: boolean | null
          parent_rating: number | null
          rating_comment: string | null
          scheduled_at: string | null
          series_id: string | null
          session_type: Database["public"]["Enums"]["session_type"] | null
          status: Database["public"]["Enums"]["session_status"] | null
          student_id: string | null
          student_name: string | null
          student_photo: string | null
          subject_category:
            | Database["public"]["Enums"]["subject_category"]
            | null
          subject_id: string | null
          subject_name: string | null
          teacher_id: string | null
          teacher_name: string | null
          teacher_notes_md: string | null
          teacher_photo: string | null
          zoom_join_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sessions_series"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "session_series"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_subject_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "v_teacher_performance"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      v_student_progress: {
        Row: {
          attendance_pct: number | null
          milestone_pct: number | null
          milestones_completed: number | null
          plan_status: Database["public"]["Enums"]["plan_status"] | null
          sessions_attended: number | null
          student_id: string | null
          student_name: string | null
          student_plan_id: string | null
          subjects_completed: number | null
          total_milestones: number | null
          total_subjects: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_stu_plans_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      v_subject_overview: {
        Row: {
          category: Database["public"]["Enums"]["subject_category"] | null
          content_item_count: number | null
          estimated_sessions: number | null
          id: string | null
          learning_goals: Json | null
          lesson_count: number | null
          milestone_count: number | null
          name: string | null
          overview_md: string | null
          sort_order: number | null
          thumbnail_url: string | null
        }
        Relationships: []
      }
      v_teacher_earnings: {
        Row: {
          amount_cents: number | null
          earned_at: string | null
          id: string | null
          scheduled_at: string | null
          status: string | null
          student_id: string | null
          student_name: string | null
          subject_id: string | null
          subject_name: string | null
          teacher_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sessions_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_subject_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_earnings_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_earnings_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "v_teacher_performance"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      v_teacher_performance: {
        Row: {
          avg_rating: number | null
          completed_sessions: number | null
          full_name: string | null
          is_active: boolean | null
          photo_url: string | null
          sessions_this_month: number | null
          sogo_email: string | null
          teacher_id: string | null
          total_ratings: number | null
          total_sessions: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_teachers_profile"
            columns: ["teacher_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_sessions_from_series: {
        Args: { p_lookahead_days?: number }
        Returns: number
      }
      get_my_role: { Args: never; Returns: string }
    }
    Enums: {
      attendance_status: "present" | "absent" | "late"
      lesson_content_type: "note" | "pdf" | "youtube"
      milestone_status: "not_started" | "in_progress" | "completed"
      notification_channel: "email" | "whatsapp"
      notification_status: "queued" | "sent" | "delivered" | "failed"
      plan_status: "active" | "paused" | "completed" | "archived"
      plan_subject_status: "not_started" | "in_progress" | "completed"
      recurrence_type: "daily" | "weekly" | "custom"
      series_status: "active" | "paused" | "ended"
      session_status:
        | "scheduled"
        | "live"
        | "completed"
        | "cancelled"
        | "no_show"
        | "shifted"
      session_type: "recurring" | "one_time"
      subject_category: "quran" | "arabic" | "islamic_studies"
      user_role: "admin" | "supervisor" | "teacher" | "student"
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
      attendance_status: ["present", "absent", "late"],
      lesson_content_type: ["note", "pdf", "youtube"],
      milestone_status: ["not_started", "in_progress", "completed"],
      notification_channel: ["email", "whatsapp"],
      notification_status: ["queued", "sent", "delivered", "failed"],
      plan_status: ["active", "paused", "completed", "archived"],
      plan_subject_status: ["not_started", "in_progress", "completed"],
      recurrence_type: ["daily", "weekly", "custom"],
      series_status: ["active", "paused", "ended"],
      session_status: [
        "scheduled",
        "live",
        "completed",
        "cancelled",
        "no_show",
        "shifted",
      ],
      session_type: ["recurring", "one_time"],
      subject_category: ["quran", "arabic", "islamic_studies"],
      user_role: ["admin", "supervisor", "teacher", "student"],
    },
  },
} as const
